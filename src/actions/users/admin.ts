"use server";

import { db } from "@/db";
import { Users } from "@/db/schema/users";
import { CourseEnrollments } from "@/db/schema/courses";
import { Subscriptions } from "@/db/schema/payments";
import { eq, desc, count } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getAdminStudentsAction() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const studentsResult = await db
      .select({
        id: Users.id,
        name: Users.name,
        email: Users.email,
        subscription: Users.subscription,
        createdAt: Users.createdAt,
        subscriptionEnd: Subscriptions.currentPeriodEnd,
        enrolledCourses: count(CourseEnrollments.courseId),
      })
      .from(Users)
      .leftJoin(CourseEnrollments, eq(Users.id, CourseEnrollments.userId))
      .leftJoin(Subscriptions, eq(Users.id, Subscriptions.userId))
      .where(eq(Users.role, "student"))
      .groupBy(
        Users.id,
        Users.name,
        Users.email,
        Users.subscription,
        Users.createdAt,
        Subscriptions.currentPeriodEnd,
      )
      .orderBy(desc(Users.createdAt));

    return { success: true, data: studentsResult };
  } catch (error: any) {
    console.error("Error fetching admin students:", error);
    return { success: false, error: error.message };
  }
}
