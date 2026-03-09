"use client";

import { Course, Chapter, Lesson } from "../course/types";
import {
  PlayCircle,
  HelpCircle,
  FileText,
  CheckCircle2,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ComputedStatus {
  [lessonId: string]: {
    isLocked: boolean;
    isCompleted: boolean;
  };
}

interface Props {
  course: Course;
  currentLessonId: string;
  computedStatus: ComputedStatus;
}

const lessonTypeIcon = (type: Lesson["type"]) => {
  if (type === "video") return <PlayCircle className="w-4 h-4" />;
  if (type === "quiz") return <HelpCircle className="w-4 h-4" />;
  return <FileText className="w-4 h-4" />;
};

export function LessonSidebar({
  course,
  currentLessonId,
  computedStatus,
}: Props) {
  return (
    <div className="flex flex-col flex-1 h-full max-h-screen border-l border-border bg-card">
      <div className="p-4 pr-12 border-b border-border bg-muted/30 sticky top-0 z-10 shrink-0">
        <h2 className="font-bold text-sm tracking-tight line-clamp-2">
          {course.title}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        {course.chapters.map((chapter: Chapter, index: number) => (
          <div key={chapter.id} className="border-b border-border/50 pb-2">
            <div className="p-4 bg-muted/10 sticky top-0 z-10 backdrop-blur-sm">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                Chapter {index + 1}
              </p>
              <h3 className="text-sm font-bold text-foreground">
                {chapter.title}
              </h3>
            </div>

            <ul className="flex flex-col mt-1 px-2 space-y-0.5 w-full">
              {chapter.lessons.map((lesson: Lesson) => {
                const isCurrent = lesson.id === currentLessonId;
                const status = computedStatus[lesson.id];
                const isLocked = status?.isLocked;
                const isCompleted = status?.isCompleted;

                return (
                  <li key={lesson.id} className="w-full">
                    <Link
                      href={
                        isLocked
                          ? "#"
                          : `/course/${course.slug}/chapter/${chapter.slug}/lesson/${lesson.slug}`
                      }
                      className={cn(
                        "flex w-full items-start gap-3 p-3 rounded-lg text-sm transition-all duration-200 border border-transparent",
                        isCurrent &&
                          "bg-primary/10 text-primary border-primary/20 shadow-sm",
                        !isCurrent &&
                          !isLocked &&
                          "hover:bg-muted/80 hover:scale-[1.01]",
                        isLocked && "opacity-50 cursor-not-allowed",
                      )}
                    >
                      {/* Ikon Tipe & Status */}
                      <div className="shrink-0 pt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <div
                            className={
                              isCurrent
                                ? "text-primary"
                                : "text-muted-foreground"
                            }
                          >
                            {lessonTypeIcon(lesson.type)}
                          </div>
                        )}
                      </div>

                      {/* Judul Lesson */}
                      <span
                        className={cn(
                          "flex-1 font-medium line-clamp-2 text-left",
                          isCurrent ? "text-primary" : "text-foreground",
                          isCompleted && !isCurrent && "text-muted-foreground",
                        )}
                      >
                        {lesson.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
