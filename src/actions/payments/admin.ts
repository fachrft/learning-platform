"use server";

import { db } from "@/db";
import { PaymentTransactions, Subscriptions } from "@/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { desc, eq, sql } from "drizzle-orm";

export async function getAdminSubscriptionsAction() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const subscriptions = await db.query.Subscriptions.findMany({
      orderBy: [desc(Subscriptions.createdAt)],
      with: {
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
      },
    });

    return { success: true, data: subscriptions };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Gagal mengambil data subscriptions",
    };
  }
}

export async function getAdminPaymentTransactionsAction() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const transactions = await db.query.PaymentTransactions.findMany({
      orderBy: [desc(PaymentTransactions.createdAt)],
      with: {
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
      },
    });

    return { success: true, data: transactions };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Gagal mengambil data transactions",
    };
  }
}

export async function getAdminRevenueStatsAction() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const revenueResult = await db
      .select({
        total: sql<number>`sum(${PaymentTransactions.amount})`,
      })
      .from(PaymentTransactions)
      .where(eq(PaymentTransactions.status, "paid"));

    const totalRevenue = revenueResult[0]?.total || 0;

    return { success: true, data: { totalRevenue } };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Gagal mendapat ringkasan transaksi",
    };
  }
}
