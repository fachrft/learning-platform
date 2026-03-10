import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  markLessonCompleteAction,
  submitQuizAction,
} from "@/actions/lessons/student";
import toast from "react-hot-toast";

import { Lesson } from "@/types/course";

interface UseLessonCompleteProps {
  lessonId: string;
  courseSlug: string;
  nextLesson: Lesson | null;
  isCompleted: boolean;
  setIsRetaking: (val: boolean) => void;
}

export const useLessonComplete = ({
  lessonId,
  courseSlug,
  nextLesson,
  isCompleted,
  setIsRetaking,
}: UseLessonCompleteProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuizSubmit = async (answers: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      const res = await submitQuizAction(lessonId, answers);
      if (res.success) {
        setIsRetaking(false);
        if (res.passed) {
          toast.success(
            `Keren! Lulus! Skor kamu: ${res.score}/${res.totalPoints}`,
            { duration: 4000 },
          );
        } else {
          toast.error(
            `Belum Lulus! Skor kamu: ${res.score}/${res.totalPoints}. Coba lagi!`,
            { duration: 4000 },
          );
        }
        router.refresh();
      } else {
        toast.error(res.error || "Gagal mengumpulkan kuis.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Terjadi kesalahan sistem.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkComplete = async () => {
    if (isCompleted) {
      if (nextLesson) {
        router.push(
          `/course/${courseSlug}/chapter/${nextLesson.chapterSlug}/lesson/${nextLesson.slug}`,
        );
      } else {
        router.push(`/course/${courseSlug}/finished`);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await markLessonCompleteAction(lessonId);
      if (res.success) {
        toast.success("Materi selesai!");
        if (nextLesson) {
          router.push(
            `/course/${courseSlug}/chapter/${nextLesson.chapterSlug}/lesson/${nextLesson.slug}`,
          );
          router.refresh();
        } else {
          toast.success("Wah! Kamu udah selesaiin semua materi!");
          router.push(`/course/${courseSlug}/finished`);
        }
      } else {
        toast.error(res.error || "Gagal menyimpan state. Coba lagi.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Terjadi kesalahan sistem.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleQuizSubmit,
    handleMarkComplete,
  };
};
