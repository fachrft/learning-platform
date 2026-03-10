"use server";

import { db } from "@/db";
import { Users } from "@/db/schema/users";
import { Courses } from "@/db/schema/courses";
import { PaymentTransactions } from "@/db/schema/payments";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { count, eq, sql, desc, and } from "drizzle-orm";

export async function getAdminDashboardStatsAction() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Total Students
    const studentsRes = await db
      .select({ total: count() })
      .from(Users)
      .where(eq(Users.role, "student"));
    const totalStudents = studentsRes[0]?.total || 0;

    // Total Premium Students
    const premiumRes = await db
      .select({ total: count() })
      .from(Users)
      .where(and(eq(Users.role, "student"), eq(Users.subscription, "premium")));
    const totalPremium = premiumRes[0]?.total || 0;

    // Total Courses
    const coursesRes = await db.select({ total: count() }).from(Courses);
    const totalCourses = coursesRes[0]?.total || 0;

    // Total Revenue
    const revenueRes = await db
      .select({ total: sql<number>`sum(${PaymentTransactions.amount})` })
      .from(PaymentTransactions)
      .where(eq(PaymentTransactions.status, "paid"));
    const totalRevenue = revenueRes[0]?.total || 0;

    // Recent Students
    const recentStudents = await db.query.Users.findMany({
      where: eq(Users.role, "student"),
      orderBy: [desc(Users.createdAt)],
      limit: 5,
      columns: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Recent Transactions
    const recentTransactions = await db.query.PaymentTransactions.findMany({
      orderBy: [desc(PaymentTransactions.createdAt)],
      limit: 5,
      with: {
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      success: true,
      data: {
        totalStudents,
        totalPremium,
        totalCourses,
        totalRevenue: Number(totalRevenue),
        recentStudents,
        recentTransactions,
      },
    };
  } catch (error: any) {
    console.error("Error fetching admin dashboard stats:", error);
    return { success: false, error: error.message };
  }
}
