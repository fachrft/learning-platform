"use client";

import { useQuery } from "@tanstack/react-query";
import { getLessonBySlug } from "@/actions/lessons";
import { Lesson } from "@/types/course";

export function useLesson(lessonSlug: string) {
  const { data, isLoading, error, refetch } = useQuery<Lesson | null>({
    queryKey: ["lesson", lessonSlug],
    queryFn: async () => {
      const result = await getLessonBySlug(lessonSlug);
      if (!result.success) {
        throw new Error(result.error || "Gagal mengambil data materi.");
      }
      return result.lesson as Lesson;
    },
    enabled: !!lessonSlug,
  });

  return {
    lesson: data,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
