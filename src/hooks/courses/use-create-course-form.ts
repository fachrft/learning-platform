"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";

import { CourseInput } from "@/schemas/course.schema";
import { createCourseAction } from "@/actions/courses";
import { useCourseFormBase } from "./use-course-form-base";

export function useCreateCourseForm(onSuccess: () => void) {
  const [isPending, startTransition] = useTransition();
  const base = useCourseFormBase();

  const onSubmit = async (values: CourseInput) => {
    const toastId = toast.loading("Menyimpan kursus...");
    startTransition(async () => {
      try {
        const result = await createCourseAction(values);

        if (result?.success) {
          toast.success("Kursus berhasil dibuat!", { id: toastId });
          base.form.reset();
          onSuccess();
        } else {
          toast.error(result?.error || "Gagal membuat kursus.", {
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
