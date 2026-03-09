"use server";

import { db } from "@/db";
import {
  Courses,
  Chapters,
  Lessons,
  CourseReviews,
  CourseEnrollments,
  UserProgress,
} from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getPublishedCoursesAction() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const courses = await db.query.Courses.findMany({
      where: eq(Courses.status, "published"),
      orderBy: [asc(Courses.sortOrder)],
      with: {
        course_enrollments: true,
        course_reviews: {
          with: {
            user: {
              columns: {
                name: true,
              },
            },
          },
        },
        chapters: {
          orderBy: [asc(Chapters.sortOrder)],
          with: {
            lessons: {
              orderBy: [asc(Lessons.sortOrder)],
              with: {
                ...(userId
                  ? {
                      user_progress: {
                        where: eq(UserProgress.userId, userId),
                      },
                    }
                  : {}),
              },
            },
          },
        },
      },
    });
    return { success: true, data: courses };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal mendapatkan kursus.";
    return { success: false, error: message };
  }
}

export async function getCourseDetailAction(slug: string) {
  try {
    const course = await db.query.Courses.findFirst({
      where: eq(Courses.slug, slug),
      with: {
        course_enrollments: true,
        course_reviews: {
          with: {
            user: {
              columns: {
                name: true,
              },
            },
          },
        },
        chapters: {
          orderBy: [asc(Chapters.sortOrder)],
          with: {
            lessons: {
              orderBy: [asc(Lessons.sortOrder)],
              columns: {
                id: true,
                title: true,
                type: true,
                slug: true,
                sortOrder: true,
              },
            },
          },
        },
      },
    });

    if (!course || course.status === "draft") {
      return {
        success: false,
        error: "Kursus tidak ditemukan atau masih draft.",
      };
    }

    return { success: true, data: course };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Gagal mendapatkan detail kursus.";
    return { success: false, error: message };
  }
}

export async function submitCourseReviewAction(
  courseId: string,
  rating: number,
  comment: string | null,
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Silakan login terlebih dahulu." };
    }

    const existingReview = await db.query.CourseReviews.findFirst({
      where: and(
        eq(CourseReviews.courseId, courseId),
        eq(CourseReviews.userId, session.user.id),
      ),
    });

    if (existingReview) {
      await db
        .update(CourseReviews)
        .set({ rating, comment, updatedAt: new Date() })
        .where(eq(CourseReviews.id, existingReview.id));
    } else {
      await db.insert(CourseReviews).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        courseId,
        rating,
        comment,
      });
    }

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal menyimpan review.";
    return { success: false, error: message };
  }
}

export async function enrollCourseAction(courseId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Silakan login terlebih dahulu." };
    }

    const userId = session.user.id;

    // Cek apakah udah pernah join
    const existingEnrollment = await db.query.CourseEnrollments.findFirst({
      where: and(
        eq(CourseEnrollments.courseId, courseId),
        eq(CourseEnrollments.userId, userId),
      ),
    });

    if (!existingEnrollment) {
      // kalau belum join, tambahin ke table
      await db.insert(CourseEnrollments).values({
        userId,
        courseId,
      });
    }

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal mendaftar kursus.";
    return { success: false, error: message };
  }
}
