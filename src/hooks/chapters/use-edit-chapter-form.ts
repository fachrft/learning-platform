"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ChapterInput, chapterSchema } from "@/schemas/course.schema";
import { updateChapterAction } from "@/actions/chapters";

export function useEditChapterForm(
  onSuccess: () => void,
  chapter: ChapterInput,
) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChapterInput>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      courseId: chapter?.courseId || "",
      title: chapter?.title || "",
      description: chapter?.description || "",
      sortOrder: chapter?.sortOrder || 0,
    },
  });

  const onSubmit = (chapterId: string) => (data: ChapterInput) => {
    const toastId = toast.loading("Menyimpan perubahan bab...");
    startTransition(async () => {
      try {
        const result = await updateChapterAction(chapterId, data);
        if (result?.success) {
          toast.success("Bab berhasil diperbarui!", { id: toastId });
          onSuccess();
        } else {
          toast.error(result?.error || "Gagal memperbarui bab.", {
            id: toastId,
          });
        }
      } catch (error) {
        toast.error("Terjadi kesalahan sistem.", { id: toastId });
      }
    });
  };

  return {
    form,
    onSubmit,
    isPending,
  };
}
