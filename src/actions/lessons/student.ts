"use server";

import { db } from "@/db";
import {
  Courses,
  Chapters,
  Lessons,
  UserProgress,
  Quizzes,
  QuizAttempts,
} from "@/db/schema";
import { eq, asc, desc, inArray, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";
import { Lesson, LessonProgress } from "@/types/course";

export async function getLessonPageDataAction(
  courseSlug: string,
  lessonSlug: string,
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    const userId = session.user.id;

    const course = await db.query.Courses.findFirst({
      where: eq(Courses.slug, courseSlug),
      with: {
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
      return { success: false, error: "Course tidak ditemukan" };
    }

    const isPremium = session.user.subscription === "premium";
    if (!course.isFree && !isPremium) {
      throw new Error("PremiumRequired");
    }

    const lessonData = await db.query.Lessons.findFirst({
      where: eq(Lessons.slug, lessonSlug),
      with: {
        quizzes: {
          orderBy: [asc(Quizzes.sortOrder)],
        },
        quiz_attempts: {
          where: eq(QuizAttempts.userId, userId),
          orderBy: [desc(QuizAttempts.createdAt)],
          limit: 1, // Kita ambil attempt terbaru
        },
      },
    });

    if (!lessonData) {
      throw new Error("Lesson tidak ditemukan");
    }

    const currentLesson: Lesson = {
      ...lessonData,
      quizzes: (lessonData.quizzes || []).map((q) => ({
        ...q,
        correctAnswer: q.correctAnswer as "A" | "B" | "C" | "D",
        points: q.points || 10,
      })),
      quiz_attempts: (lessonData.quiz_attempts || []).map((a) => ({
        ...a,
        answers: a.answers as Record<string, string> | null,
      })),
    };

    const lessonIds = course.chapters.flatMap((ch) =>
      ch.lessons.map((l) => l.id),
    );

    let userProgress: LessonProgress[] = [];
    if (lessonIds.length > 0) {
      userProgress = await db.query.UserProgress.findMany({
        where: and(
          eq(UserProgress.userId, userId),
          inArray(UserProgress.lessonId, lessonIds),
        ),
      });
    }

    let nextLesson = null;
    let prevLesson = null;
    const allLessonsFlat = course.chapters.flatMap((ch) =>
      ch.lessons.map((l) => ({ ...l, chapterSlug: ch.slug })),
    );

    for (let i = 0; i < allLessonsFlat.length; i++) {
      if (allLessonsFlat[i].slug === lessonSlug) {
        if (i + 1 < allLessonsFlat.length) {
          nextLesson = allLessonsFlat[i + 1];
        }
        if (i - 1 >= 0) {
          prevLesson = allLessonsFlat[i - 1];
        }
        break;
      }
    }

    return {
      success: true,
      data: {
        course,
        userProgress,
        currentLesson,
        nextLesson,
        prevLesson,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error server",
    };
  }
}

export async function markLessonCompleteAction(lessonId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    const userId = session.user.id;

    const existing = await db.query.UserProgress.findFirst({
      where: and(
        eq(UserProgress.userId, userId),
        eq(UserProgress.lessonId, lessonId),
      ),
    });

    if (existing) {
      await db
        .update(UserProgress)
        .set({
          completed: true,
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(UserProgress.id, existing.id));
    } else {
      await db.insert(UserProgress).values({
        id: crypto.randomUUID(),
        userId,
        lessonId,
        completed: true,
        completedAt: new Date(),
      });
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error server",
    };
  }
}

export async function submitQuizAction(
  lessonId: string,
  answers: Record<string, string>,
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    const userId = session.user.id;

    // Fetch quiz questions for this lesson to validate answers
    const quizzes = await db.query.Quizzes.findMany({
      where: eq(Quizzes.lessonId, lessonId),
    });

    if (!quizzes || quizzes.length === 0) {
      throw new Error("Kuis tidak ditemukan or kosong");
    }

    let score = 0;
    let totalPoints = 0;

    quizzes.forEach((quiz) => {
      const qPoints = quiz.points || 10;
      totalPoints += qPoints;

      if (answers[quiz.id] && answers[quiz.id] === quiz.correctAnswer) {
        score += qPoints;
      }
    });

    // Misalnya passing grade 70% atau bisa diatur
    const passingPercentage = 0.7; // 70%
    const passed =
      totalPoints > 0 ? score / totalPoints >= passingPercentage : true;

    // Save quiz attempt
    await db.insert(QuizAttempts).values({
      id: crypto.randomUUID(),
      userId,
      lessonId,
      score,
      totalPoints,
      passed,
      answers,
    });

    if (passed) {
      await markLessonCompleteAction(lessonId);
    }

    return { success: true, passed, score, totalPoints };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error server",
    };
  }
}
