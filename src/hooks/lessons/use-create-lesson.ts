"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { LessonInput, lessonSchema } from "@/schemas/course.schema";
import { createLessonAction } from "@/actions/lessons";

interface UseCreateLessonProps {
  courseSlug: string;
  chapterSlug: string;
}

export function useCreateLesson({
  courseSlug,
  chapterSlug,
}: UseCreateLessonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LessonInput>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "text",
      content: "",
      videoUrl: "",
      sortOrder: 0,
      quizzes: [],
    },
  });

  const selectedType = form.watch("type");

  const onSubmit = (data: LessonInput) => {
    const toastId = toast.loading("Menyimpan materi...");
    startTransition(async () => {
      try {
        const result = await createLessonAction(data, chapterSlug);
        if (result?.success) {
          toast.success("Materi berhasil dibuat!", { id: toastId });
          queryClient.invalidateQueries({
            queryKey: ["admin_course_chapters", courseSlug],
          });
          router.refresh();
          router.push(`/admin/courses/${courseSlug}`);
        } else {
          toast.error(result?.error || "Gagal membuat materi.", {
            id: toastId,
          });
        }
      } catch {
        toast.error("Terjadi kesalahan sistem.", { id: toastId });
      }
    });
  };

  return {
    form,
    isPending,
    selectedType,
    onSubmit,
  };
}
