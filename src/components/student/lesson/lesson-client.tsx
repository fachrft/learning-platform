"use client";

import { Course } from "../course/types";
import { LessonContent } from "./lesson-content";
import { LessonSidebar } from "./lesson-sidebar";
import { ArrowLeft, Menu, Lock } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

interface ComputedStatus {
  [lessonId: string]: {
    isLocked: boolean;
    isCompleted: boolean;
  };
}

interface Props {
  course: Course;
  currentLesson: any;
  nextLesson: any | null;
  prevLesson: any | null;
  computedStatus: ComputedStatus;
  isCurrentLocked: boolean;
  isCurrentCompleted: boolean;
}

export function LessonClient({
  course,
  currentLesson,
  nextLesson,
  prevLesson,
  computedStatus,
  isCurrentLocked,
  isCurrentCompleted,
}: Props) {
  return (
    <div className="flex w-full h-dvh overflow-hidden bg-background ">
      {/* Kiri: Konten Utama */}
      <div className="flex-1 flex flex-col w-full h-full overflow-hidden">
        {/* Header konten */}
        <div className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-border bg-card shrink-0 gap-4">
          <div className="flex items-center gap-2 lg:gap-4 overflow-hidden">
            <Link
              href={`/course/${course.slug}`}
              className="p-2 shrink-0 hover:bg-muted rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
            <h1 className="font-semibold text-sm lg:text-base text-foreground truncate">
              {currentLesson.title}
            </h1>
          </div>

          <div className="shrink-0 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 hover:bg-muted rounded-full transition-colors">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85vw] sm:w-[350px] p-0 flex flex-col border-l border-border bg-card"
              >
                <SheetTitle className="sr-only">Kurikulum</SheetTitle>
                <div className="flex-1 overflow-hidden">
                  <LessonSidebar
                    course={course}
                    currentLessonId={currentLesson.id}
                    computedStatus={computedStatus}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Area Belajar */}
        <div className="flex-1 overflow-y-auto relative bg-background scrollbar-hide">
          {isCurrentLocked ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-muted/20">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">Materi Terkunci</h2>
              <p className="text-muted-foreground max-w-md">
                Lo harus nyelesain materi sebelumnya dulu bro buat ngebuka
                bagian ini. Semangat!
              </p>
            </div>
          ) : (
            <LessonContent
              key={currentLesson.id}
              courseSlug={course.slug as string}
              lesson={currentLesson}
              nextLesson={nextLesson}
              prevLesson={prevLesson}
              isCompleted={isCurrentCompleted}
            />
          )}
        </div>
      </div>

      {/* Kanan: Sidebar (Hanya Desktop) */}
      <div className="hidden lg:block w-80 shrink-0 border-l border-border bg-card h-full overflow-y-auto">
        <LessonSidebar
          course={course}
          currentLessonId={currentLesson.id}
          computedStatus={computedStatus}
        />
      </div>
    </div>
  );
}
