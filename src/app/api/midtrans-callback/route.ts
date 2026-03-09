import { NextResponse } from "next/server";
import { db } from "@/db";
import { PaymentTransactions, Subscriptions, Users } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { addMonths, addYears } from "date-fns";
import { sendPremiumWelcomeEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Verifikasi Signature Key (Keamanan)
    // Formula: SHA512(order_id + status_code + gross_amount + server_key)
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const signatureSource =
      body.order_id + body.status_code + body.gross_amount + serverKey;
    const signature = crypto
      .createHash("sha512")
      .update(signatureSource)
      .digest("hex");

    if (signature !== body.signature_key) {
      return NextResponse.json(
        { message: "Invalid Signature" },
        { status: 403 },
      );
    }

    const orderId = body.order_id;
    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;

    // 2. Cari transaksi di DB kita
    const [transaction] = await db
      .select()
      .from(PaymentTransactions)
      .where(eq(PaymentTransactions.orderId, orderId))
      .limit(1);

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 },
      );
    }

    let status: "pending" | "paid" | "failed" | "expired" = "pending";

    // 3. Logika penentuan status Midtrans
    if (transactionStatus === "capture") {
      if (fraudStatus === "challenge") {
        status = "pending";
      } else if (fraudStatus === "accept") {
        status = "paid";
      }
    } else if (transactionStatus === "settlement") {
      status = "paid";
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      status = "failed";
    } else if (transactionStatus === "pending") {
      status = "pending";
    }

    // 4. Update status transaksi
    await db
      .update(PaymentTransactions)
      .set({
        status: status,
        paymentType: body.payment_type, // "gopay", "bank_transfer", dll
        paidAt: status === "paid" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(PaymentTransactions.orderId, orderId));

    // 5. Jika sukses bayar, AKTIFKAN/UPDATE PREMIUM
    if (status === "paid") {
      const isYearly = transaction.plan === "yearly";
      const now = new Date();
      const expiryDate = isYearly ? addYears(now, 1) : addMonths(now, 1);

      // A. Update status user ke premium
      await db
        .update(Users)
        .set({
          subscription: "premium",
          updatedAt: new Date(),
        })
        .where(eq(Users.id, transaction.userId));

      // B. Upsert ke tabel Subscriptions
      // Cek apakah user sudah punya subscription sebelumnya
      const [existingSub] = await db
        .select()
        .from(Subscriptions)
        .where(eq(Subscriptions.userId, transaction.userId))
        .limit(1);

      if (existingSub) {
        await db
          .update(Subscriptions)
          .set({
            plan: transaction.plan,
            status: "active",
            currentPeriodStart: now,
            currentPeriodEnd: expiryDate,
            midtransOrderId: orderId,
            updatedAt: new Date(),
          })
          .where(eq(Subscriptions.userId, transaction.userId));
      } else {
        await db.insert(Subscriptions).values({
          id: crypto.randomUUID(),
          userId: transaction.userId,
          plan: transaction.plan,
          status: "active",
          currentPeriodStart: now,
          currentPeriodEnd: expiryDate,
          midtransOrderId: orderId,
        });
      }

      // C. Kirim email notifikasi premium ke user
      try {
        const [user] = await db
          .select({ email: Users.email, name: Users.name })
          .from(Users)
          .where(eq(Users.id, transaction.userId))
          .limit(1);

        if (user?.email) {
          await sendPremiumWelcomeEmail({
            to: user.email,
            name: user.name ?? "Seefluencer Student",
            plan: transaction.plan,
            expiryDate,
          });
        }
      } catch (emailError) {
        // Gagal kirim email jangan sampai batalin webhook response
        console.error("[WEBHOOK_EMAIL_ERROR]", emailError);
      }
    }

    return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error("[MIDTRANS_WEBHOOK_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
