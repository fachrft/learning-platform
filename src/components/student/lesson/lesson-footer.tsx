"use client";

import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface LessonFooterProps {
  courseSlug: string;
  lesson: any;
  nextLesson: any | null;
  prevLesson: any | null;
  isCompleted: boolean;
  isQuiz: boolean;
  latestAttempt: any;
  isRetaking: boolean;
  answers: Record<string, string>;
  isSubmitting: boolean;
  onQuizSubmit: () => void;
  onMarkComplete: () => void;
}

export function LessonFooter({
  courseSlug,
  lesson,
  nextLesson,
  prevLesson,
  isCompleted,
  isQuiz,
  latestAttempt,
  isRetaking,
  answers,
  isSubmitting,
  onQuizSubmit,
  onMarkComplete,
}: LessonFooterProps) {
  const router = useRouter();

  const handleGoBack = () => {
    if (prevLesson) {
      router.push(
        `/course/${courseSlug}/chapter/${prevLesson.chapterSlug}/lesson/${prevLesson.slug}`,
      );
    }
  };

  return (
    <div className="fixed sm:sticky bottom-0 left-0 w-full border-t border-border bg-card/80 backdrop-blur-md p-4 flex items-center justify-between shrink-0 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.1)] z-10">
      <div className="flex items-center gap-2">
        {prevLesson && (
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="font-semibold rounded-xl text-xs sm:text-sm px-4 sm:px-6"
          >
            Kembali
          </Button>
        )}
        {isCompleted && (
          <span className="hidden sm:inline-flex text-[10px] font-semibold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
            ✔️ Materi Selesai
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {(!isQuiz && !isCompleted) ||
        (isQuiz && (!latestAttempt || isRetaking)) ? (
          <Button
            onClick={isQuiz ? onQuizSubmit : onMarkComplete}
            disabled={
              isSubmitting ||
              (isQuiz &&
                lesson.quizzes &&
                Object.keys(answers).length !== lesson.quizzes.length)
            }
            className="font-semibold rounded-xl text-xs sm:text-sm px-6 shadow-md shadow-primary/30"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {isQuiz ? "Kumpulkan Kuis" : "Selesai & Lanjut"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : isQuiz && latestAttempt && !latestAttempt.passed && !isRetaking ? (
          <Button
            disabled
            className="font-semibold rounded-xl text-xs sm:text-sm px-6"
          >
            Selesaikan Kuis Terlebih Dahulu
          </Button>
        ) : (
          <Button
            onClick={onMarkComplete}
            className="font-semibold rounded-xl text-xs sm:text-sm px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/30"
          >
            {nextLesson ? (
              <>
                Lanjut <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              "Kursus Selesai"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
