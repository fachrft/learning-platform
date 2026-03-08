"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ChapterInput, chapterSchema } from "@/schemas/course.schema";
import { createChaptersAction } from "@/actions/chapters";

export function useCreateChapterForm(onSuccess: () => void, courseId: string) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChapterInput>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      courseId: courseId,
      title: "",
      description: "",
      sortOrder: 0,
    },
  });

  const onSubmit = (data: ChapterInput) => {
    const toastId = toast.loading("Menyimpan chapter");
    startTransition(async () => {
      try {
        const result = await createChaptersAction(data);
        if (result?.success) {
          toast.success("Chapter berhasil dibuat!",  { id: toastId });
          form.reset();
          onSuccess();
        } else {
          toast.error(result?.error || "Gagal membuat bab",  { id: toastId });
        }
      } catch (error) {
        toast.error("Terjadi kesalahan.");
      }
    });
  };

  return {
    form,
    onSubmit,
    isPending,
  };
}
