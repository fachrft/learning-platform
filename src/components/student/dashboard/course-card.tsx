"use client";

import { BookOpen, Users, Star, CheckCircle, Clock } from "lucide-react";
import { Course } from "./types";
import { getAverageRating } from "@/lib/utils";
import Link from "next/link";

interface CourseCardProps {
  course: Course;
  subscription?: "free" | "premium";
}

export function CourseCard({ course, subscription }: CourseCardProps) {
  const totalLessons = course.chapters.reduce(
    (acc: number, ch) => acc + (ch.lessons?.length ?? 0),
    0,
  );

  const completedLessons = course.chapters.reduce(
    (acc: number, ch) =>
      acc +
      (ch.lessons?.filter((l: any) => l.user_progress?.[0]?.completed).length ??
        0),
    0,
  );

  const avgRating = getAverageRating(course.course_reviews as any).toFixed(1);
  const studentCount = course.course_enrollments?.length ?? 0;
  const totalChapters = course.chapters.length;

  const isCompleted = totalLessons > 0 && completedLessons === totalLessons;
  const inProgress = completedLessons > 0 && completedLessons < totalLessons;

  return (
    <div className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-muted-foreground/20" />
          </div>
        )}
        <span
          className={`absolute top-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
            course.isFree
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-400"
              : "bg-card/90 text-foreground border border-border/50 backdrop-blur-sm"
          }`}
        >
          {course.isFree ? "Gratis" : "Premium"}
        </span>

        {/* Status Badge */}
        {isCompleted && (
          <span className="absolute bottom-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-green-500 text-white flex items-center gap-1 shadow-md">
            <CheckCircle className="w-3 h-3" />
            Selesai
          </span>
        )}
        {!isCompleted && inProgress && (
          <span className="absolute bottom-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-500 text-white flex items-center gap-1 shadow-md">
            <Clock className="w-3 h-3" />
            Lanjut
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
            {course.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {totalChapters} bab · {totalLessons} materi
          </span>
          {studentCount > 0 && (
            <span className="flex items-center gap-1 ml-auto">
              <Users className="w-3.5 h-3.5" />
              {studentCount}
            </span>
          )}
          <span className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            {avgRating}
          </span>
        </div>

        {/* CTA */}
        <Link href={`/course/${course.slug}`}>
          <button className="w-full py-2 px-4 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            Lihat Detail
          </button>
        </Link>
      </div>
    </div>
  );
}
