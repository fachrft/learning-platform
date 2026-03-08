"use server";

import { db } from "@/db";
import { Lessons, Chapters, Quizzes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LessonInput, lessonSchema } from "@/schemas/course.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function getLessonBySlug(slug: string) {
  try {
    const lesson = await db.query.Lessons.findFirst({
      where: eq(Lessons.slug, slug),
      with: {
        quizzes: true,
      },
    });
    if (!lesson) throw new Error("Materi tidak ditemukan");
    return { success: true, lesson };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal mengambil materi";
    return { success: false, error: message };
  }
}

export async function createLessonAction(
  data: LessonInput,
  slugChapter: string,
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Anda harus login sebagai admin untuk membuat materi.");
    }

    const parsed = lessonSchema.safeParse(data);
    if (!parsed.success) {
      const firstMessage =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Data tidak valid.";
      throw new Error(firstMessage);
    }

    const { title, description, type, content, videoUrl, sortOrder, quizzes } =
      parsed.data;

    const chapter = await db.query.Chapters.findFirst({
      where: eq(Chapters.slug, slugChapter),
    });
    if (!chapter) throw new Error("Bab tidak ditemukan.");

    const slug = `${slugify(title)}-${crypto.randomUUID().slice(0, 6)}`;

    await db.transaction(async (tx) => {
      const lessonId = crypto.randomUUID();

      await tx.insert(Lessons).values({
        id: lessonId,
        chapterId: chapter.id,
        title,
        description,
        type,
        content: type === "text" ? (content ?? null) : null,
        videoUrl: type === "video" ? (videoUrl ?? null) : null,
        slug,
        sortOrder: Number(sortOrder) || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (type === "quiz" && quizzes && quizzes.length > 0) {
        const quizValues = quizzes.map((q, index) => ({
          id: crypto.randomUUID(),
          lessonId: lessonId,
          question: q.question,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          points: Number(q.points) || 10,
          sortOrder: Number(q.sortOrder) || index,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        await tx.insert(Quizzes).values(quizValues);
      }
    });

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal membuat materi";
    return { success: false, error: message };
  }
}

export async function getLessonsByChapter(chapterId: string) {
  try {
    const lessons = await db.query.Lessons.findMany({
      where: eq(Lessons.chapterId, chapterId),
    });
    return { success: true, lessons };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal mengambil materi";
    return { success: false, error: message };
  }
}


export async function updateLessonAction(id: string, data: LessonInput) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Anda harus login sebagai admin untuk mengedit materi.");
    }

    const parsed = lessonSchema.safeParse(data);
    if (!parsed.success) {
      const firstMessage =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Data tidak valid.";
      throw new Error(firstMessage);
    }

    const { title, description, type, content, videoUrl, sortOrder, quizzes } =
      parsed.data;

    let newSlug: string | undefined;
    const existing = await db.query.Lessons.findFirst({
      where: eq(Lessons.id, id),
    });

    if (existing?.title !== title) {
      newSlug = `${slugify(title)}-${id.slice(0, 6)}`;
    }

    await db.transaction(async (tx) => {
      const updateData: any = {
        title,
        description,
        type,
        content: type === "text" ? (content ?? null) : null,
        videoUrl: type === "video" ? (videoUrl ?? null) : null,
        sortOrder: Number(sortOrder) || 0,
        updatedAt: new Date(),
      };

      if (newSlug) {
        updateData.slug = newSlug;
      }

      await tx.update(Lessons).set(updateData).where(eq(Lessons.id, id));

      // Handle Quizzes: Delete existing ones and re-insert new ones for simplicity in editing
      if (type === "quiz") {
        await tx.delete(Quizzes).where(eq(Quizzes.lessonId, id));

        if (quizzes && quizzes.length > 0) {
          const quizValues = quizzes.map((q, index) => ({
            id: crypto.randomUUID(),
            lessonId: id,
            question: q.question,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            points: Number(q.points) || 10,
            sortOrder: Number(q.sortOrder) || index,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));

          await tx.insert(Quizzes).values(quizValues);
        }
      } else {
        await tx.delete(Quizzes).where(eq(Quizzes.lessonId, id));
      }
    });

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal mengupdate materi";
    return { success: false, error: message };
  }
}

export async function deleteLessonAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Anda harus login sebagai admin untuk menghapus materi.");
    }

    await db.delete(Lessons).where(eq(Lessons.id, id));

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal menghapus materi";
    return { success: false, error: message };
  }
}

export async function getQuizzesByLesson(lessonId: string) {
  try {
    const quizzes = await db.query.Quizzes.findMany({
      where: eq(Quizzes.lessonId, lessonId),
    });
    return { success: true, quizzes };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal mengambil kuis";
    return { success: false, error: message };
  }
}