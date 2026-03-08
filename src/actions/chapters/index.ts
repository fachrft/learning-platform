"use server";

import { db } from "@/db";
import { Courses, Chapters } from "@/db/schema";
import { eq } from "drizzle-orm";
import { chapterSchema, ChapterInput } from "@/schemas/course.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function getCourseBySlug(slug: string) {
  try {
    const chapters = await db.query.Courses.findFirst({
      where: eq(Courses.slug, slug),
      with: {
        chapters: {
          orderBy: (chapters, { asc }) => [asc(chapters.sortOrder)],
          with: {
            lessons: {
              orderBy: (lessons, { asc }) => [asc(lessons.sortOrder)],
            },
          },
        },
      },
    });

    return { success: true, data: chapters };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal mengambil data";
    return { success: false, error: message };
  }
}

export async function createChaptersAction(data: ChapterInput) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Anda harus login sebagai admin untuk membuat kursus.");
    }
    const parsed = chapterSchema.safeParse(data);

    if (!parsed.success) {
      const firstMessage =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Data tidak valid.";
      throw new Error(firstMessage);
    }

    const { courseId, title, description, sortOrder } = parsed.data;

    const slug = `${slugify(title)}-${crypto.randomUUID().slice(0, 6)}`;
    await db.insert(Chapters).values({
      id: crypto.randomUUID(),
      courseId,
      title,
      description,
      slug,
      sortOrder,
    });
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal Membuat chapter";
    return { success: false, error: message };
  }
}

export async function updateChapterAction(id: string, data: ChapterInput) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Anda harus login sebagai admin untuk mengedit bab.");
    }
    const parsed = chapterSchema.safeParse(data);

    if (!parsed.success) {
      const firstMessage =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Data tidak valid.";
      throw new Error(firstMessage);
    }

    const { courseId, title, description, sortOrder } = parsed.data;

    const existingChapter = await db.query.Chapters.findFirst({
      where: eq(Chapters.id, id),
    });

    if (!existingChapter) {
      throw new Error("Bab tidak ditemukan.");
    }

    const updateData: any = {
      title,
      description,
      sortOrder,
      updatedAt: new Date(),
    };

    if (existingChapter.title !== title) {
      updateData.slug = `${slugify(title)}-${id.slice(0, 6)}`;
    }

    await db.update(Chapters).set(updateData).where(eq(Chapters.id, id));

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal mengupdate chapter";
    return { success: false, error: message };
  }
}

export async function deleteChapterAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Anda harus login sebagai admin untuk menghapus bab.");
    }

    const existingChapter = await db.query.Chapters.findFirst({
      where: eq(Chapters.id, id),
    });

    if (!existingChapter) {
      throw new Error("Bab tidak ditemukan.");
    }

    await db.delete(Chapters).where(eq(Chapters.id, id));

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal menghapus chapter";
    return { success: false, error: message };
  }
}
