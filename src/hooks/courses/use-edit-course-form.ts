"use client";

import { useEffect, useTransition } from "react";
import toast from "react-hot-toast";

import { CourseInput } from "@/schemas/course.schema";
import { updateCourseAction } from "@/actions/courses";
import { Course } from "@/types/course";
import { useCourseFormBase } from "./use-course-form-base";

export function useEditCourseForm(
  course: Course | null,
  onSuccess: () => void,
) {
  const [isPending, startTransition] = useTransition();
  const base = useCourseFormBase();

  useEffect(() => {
    if (course) {
      base.form.reset({
        title: course.title,
        description: course.description || "",
        thumbnail: course.thumbnail || "",
        status: course.status || "draft",
        isFree: course.isFree ?? false,
        sortOrder: course.sortOrder ?? 0,
      });
    }
  }, [course, base.form]);

  const onSubmit = async (values: CourseInput) => {
    if (!course) return;
    const toastId = toast.loading("Menyimpan kursus...");
    startTransition(async () => {
      try {
        const result = await updateCourseAction(course.id, values);

        if (result?.success) {
          toast.success("Kursus berhasil diedit!", { id: toastId });
          base.form.reset();
          onSuccess();
        } else {
          toast.error(result?.error || "Gagal mengedit kursus.", {
            id: toastId,
          });
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Terjadi kesalahan sistem.",
          { id: toastId },
        );
      }
    });
  };

  return {
    ...base,
    onSubmit,
    isPending,
  };
}
