"use client";

import { useState, useEffect } from "react";
import { LessonQuiz } from "./lesson-quiz";
import { LessonVideo } from "./lesson-video";
import { LessonText } from "./lesson-text";
import { LessonFooter } from "./lesson-footer";
import { useLessonComplete } from "@/hooks/lessons/use-lesson-complete";
import { Lesson } from "@/types/course";

interface Props {
  courseSlug: string;
  lesson: Lesson;
  nextLesson: Lesson | null;
  prevLesson: Lesson | null;
  isCompleted: boolean;
}

export function LessonContent({
  courseSlug,
  lesson,
  nextLesson,
  prevLesson,
  isCompleted,
}: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isRetaking, setIsRetaking] = useState(false);

  const isQuiz = lesson?.type === "quiz";
  const isVideo = lesson?.type === "video";
  const isText = lesson?.type === "text";

  const latestAttempt =
    lesson?.quiz_attempts && lesson.quiz_attempts.length > 0
      ? lesson.quiz_attempts[0]
      : null;

  useEffect(() => {
    if (latestAttempt?.answers && !isRetaking) {
      setAnswers(latestAttempt.answers);
    } else if (!isRetaking) {
      setAnswers({});
    }
  }, [lesson.id, latestAttempt, isRetaking]);

  const { isSubmitting, handleQuizSubmit, handleMarkComplete } =
    useLessonComplete({
      lessonId: lesson.id,
      courseSlug,
      nextLesson,
      isCompleted,
      setIsRetaking,
    });

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Konten Area Spesifik (Berdasarkan Tipe) */}
      <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 space-y-6 pb-24">
        {isVideo && <LessonVideo lesson={lesson} />}

        {isText && <LessonText content={lesson.content ?? ""} />}

        {isQuiz && (
          <LessonQuiz
            lesson={lesson}
            latestAttempt={latestAttempt}
            answers={answers}
            setAnswers={setAnswers}
            isRetaking={isRetaking}
            setIsRetaking={setIsRetaking}
          />
        )}

        {/* Dummy space klo konten kosong biar ga aneh */}
        {!lesson.videoUrl && !lesson.content && !isQuiz && (
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground flex items-center gap-2">
              <span>Kosong Melompong</span>
            </p>
          </div>
        )}
      </div>

      <LessonFooter
        courseSlug={courseSlug}
        lesson={lesson}
        nextLesson={nextLesson}
        prevLesson={prevLesson}
        isCompleted={isCompleted}
        isQuiz={isQuiz}
        latestAttempt={latestAttempt}
        isRetaking={isRetaking}
        answers={answers}
        isSubmitting={isSubmitting}
        onQuizSubmit={() => handleQuizSubmit(answers)}
        onMarkComplete={handleMarkComplete}
      />
    </div>
  );
}
