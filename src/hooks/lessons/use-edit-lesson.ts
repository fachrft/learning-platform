"use client";

import { useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

import { LessonInput, lessonSchema } from "@/schemas/course.schema";
import { updateLessonAction } from "@/actions/lessons";

interface UseEditLessonProps {
  courseSlug: string;
  lessonId: string;
  initialData: any;
  initialQuizzes: any[];
}

export function useEditLesson({
  courseSlug,
  lessonId,
  initialData,
  initialQuizzes,
}: UseEditLessonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LessonInput>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: initialData?.type || "text",
      content: initialData?.content || "",
      videoUrl: initialData?.videoUrl || "",
      sortOrder: initialData?.sortOrder || 0,
      quizzes: initialQuizzes || [],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || "",
        description: initialData.description || "",
        type: initialData.type || "text",
        content: initialData.content || "",
        videoUrl: initialData.videoUrl || "",
        sortOrder: initialData.sortOrder || 0,
        quizzes: initialQuizzes || [],
      });
    }
  }, [initialData, initialQuizzes, form]);

  const selectedType = form.watch("type");

  const onSubmit = (data: z.infer<typeof lessonSchema>) => {
    const toastId = toast.loading("Memperbarui materi...");
    startTransition(async () => {
      try {
        const result = await updateLessonAction(lessonId, data);
        if (result?.success) {
          toast.success("Materi berhasil diperbarui!", { id: toastId });
          queryClient.invalidateQueries({
            queryKey: ["admin_course_chapters", courseSlug],
          });
          router.refresh();
          router.push(`/admin/courses/${courseSlug}`);
        } else {
          toast.error(result?.error || "Gagal memperbarui materi.", {
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
