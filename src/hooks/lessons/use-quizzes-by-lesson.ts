"use client";

import { useQuery } from "@tanstack/react-query";
import { getQuizzesByLesson } from "@/actions/lessons";

export function useQuizzesByLesson(lessonId: string) {
  const {
    data: quizzes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["lesson_quizzes", lessonId],
    queryFn: async () => {
      const result = await getQuizzesByLesson(lessonId);
      if (!result.success) {
        throw new Error(result.error || "Gagal mengambil data kuis.");
      }
      return result.quizzes || [];
    },
    enabled: !!lessonId,
  });

  return {
    quizzes: quizzes || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
