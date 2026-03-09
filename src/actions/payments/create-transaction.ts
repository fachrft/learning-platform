"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { PaymentTransactions } from "@/db/schema";
import { snap } from "@/lib/midtrans";

export async function createTransactionAction(planId: "monthly" | "yearly") {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Tentukan harga
    const price = planId === "yearly" ? 799000 : 99000;
    const planName =
      planId === "yearly" ? "Premium Tahunan" : "Premium Bulanan";

    // Bikin Order ID unik: TR-1710000000-abcd (sekitar 20-an karakter)
    const orderId = `TR-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

    // 1. Buat transaksi di Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price,
      },
      customer_details: {
        first_name: session.user.name ?? "Student",
        email: session.user.email ?? "",
      },
      item_details: [
        {
          id: planId,
          price: price,
          quantity: 1,
          name: planName,
        },
      ],
    };

    const transaction = await snap.createTransaction(parameter);
    const snapToken = transaction.token;

    // 2. Simpan "draft" transaksi ke tabel payment_transactions kita
    await db.insert(PaymentTransactions).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      orderId: orderId,
      plan: planId,
      amount: price,
      status: "pending",
      snapToken: snapToken,
    });

    return { success: true, token: snapToken };
  } catch (error) {
    console.error("[CREATE_TRANSACTION_ERROR]", error);
    return { success: false, error: "Gagal membuat transaksi" };
  }
}
