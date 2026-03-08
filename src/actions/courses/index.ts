"use server";

import { db } from "@/db";
import { Courses } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { CourseInput, courseSchema } from "@/schemas/course.schema";
import { slugify } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteImageKitFileByUrl } from "@/lib/imagekit";

export async function getCoursesAction() {
  try {
    const courses = await db.query.Courses.findMany({
      orderBy: [asc(Courses.createdAt)],
      with: {
        course_enrollments: true,
        course_reviews: true,
        chapters: {
          with: {
            lessons: true,
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

export async function createCourseAction(data: CourseInput) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Anda harus login sebagai admin untuk membuat kursus.");
    }
    const parsed = courseSchema.safeParse(data);

    if (!parsed.success) {
      const firstMessage =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Data tidak valid.";
      throw new Error(firstMessage);
    }

    const { title, description, thumbnail, status, isFree, sortOrder } =
      parsed.data;

    const slug = `${slugify(title)}-${crypto.randomUUID().slice(0, 6)}`;

    await db.insert(Courses).values({
      id: crypto.randomUUID(),
      title,
      slug,
      description,
      thumbnail,
      status,
      isFree,
      sortOrder,
    });

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal melakukan aksi.";
    return { success: false, error: message };
  }
}

export async function updateCourseAction(id: string, data: CourseInput) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Anda harus login sebagai admin untuk mengedit kursus.");
    }
    const parsed = courseSchema.safeParse(data);

    if (!parsed.success) {
      const firstMessage =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Data tidak valid.";
      throw new Error(firstMessage);
    }

    const { title, description, thumbnail, status, isFree, sortOrder } =
      parsed.data;

    const existingCourse = await db.query.Courses.findFirst({
      where: eq(Courses.id, id),
    });

    if (!existingCourse) {
      throw new Error("Kursus tidak ditemukan.");
    }

    if (existingCourse.thumbnail && existingCourse.thumbnail !== thumbnail) {
      await deleteImageKitFileByUrl(existingCourse.thumbnail).catch(
        console.error,
      );
    }
    const updateData: any = {
      title,
      description,
      thumbnail,
      status,
      isFree,
      sortOrder,
      updatedAt: new Date(),
    };

    if (existingCourse.title !== title) {
      updateData.slug = `${slugify(title)}-${id.slice(0, 6)}`;
    }

    await db.update(Courses).set(updateData).where(eq(Courses.id, id));

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal melakukan aksi.";
    return { success: false, error: message };
  }
}

export async function deleteCourseAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Anda harus login sebagai admin untuk menghapus kursus.");
    }

    const existingCourse = await db.query.Courses.findFirst({
      where: eq(Courses.id, id),
    });

    if (!existingCourse) {
      throw new Error("Kursus tidak ditemukan.");
    }

    if (existingCourse.thumbnail) {
      await deleteImageKitFileByUrl(existingCourse.thumbnail).catch(
        console.error,
      );
    }
    await db.delete(Courses).where(eq(Courses.id, id));

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal melakukan aksi.";
    return { success: false, error: message };
  }
}
