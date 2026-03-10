"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  PlayCircle,
  Star,
  Users,
  Crown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/course";
import { getAverageRating } from "@/lib/utils";
import { useEnrollCourse } from "@/hooks/courses/use-enroll-course";

interface CourseHeroProps {
  course: Course;
  totalLessons: number;
  isLocked?: boolean;
}

export function CourseHero({
  course,
  totalLessons,
  isLocked,
}: CourseHeroProps) {
  const avgRating = getAverageRating(course.course_reviews || []).toFixed(1);
  const studentCount = course.course_enrollments?.length ?? 0;

  const {
    isEnrolling,
    completedLessons,
    progressPercentage,
    handleEnrollAndStart,
  } = useEnrollCourse({ course, totalLessons, isLocked });

  return (
    <div className="relative border-b border-border bg-card/50 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group mb-4"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Dashboard
        </Link>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Thumbnail */}
          <div className="w-full md:w-80 shrink-0">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-xl">
              {course.thumbnail ? (
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-primary/30" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant={course.isFree ? "secondary" : "default"}
                className="text-xs"
              >
                {course.isFree ? "Gratis" : "Premium"}
              </Badge>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              {course.title}
            </h1>

            <p className="text-muted-foreground text-sm leading-relaxed">
              {course.description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                {course.chapters.length} Chapter
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {totalLessons} Lesson
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-yellow-500" />
                {avgRating} Rating
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {studentCount} Pelajar
              </span>
            </div>

            {/* Progress Bar */}
            {!isLocked && (
              <div className="w-full max-w-sm mt-1 mb-2">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-muted-foreground">
                    Progress Belajar
                  </span>
                  <span className="text-primary">{progressPercentage}%</span>
                </div>
                <div className="h-2 w-full bg-muted/50 overflow-hidden rounded-full border border-border/50">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 font-medium">
                  {completedLessons} dari {totalLessons} materi telah
                  diselesaikan
                </p>
              </div>
            )}

            {/* CTA Tombol - Langsung Mulai Belajar */}
            {course.chapters[0]?.lessons[0] ? (
              <button
                onClick={handleEnrollAndStart}
                disabled={isEnrolling}
                className="inline-flex items-center gap-2 w-fit mt-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-md shadow-primary/30"
              >
                {isEnrolling ? (
                  <span className="animate-spin mr-1">⏳</span>
                ) : isLocked ? (
                  <Crown className="w-4 h-4" />
                ) : (
                  <PlayCircle className="w-4 h-4" />
                )}
                {isLocked
                  ? "Beralih ke Premium"
                  : progressPercentage > 0
                    ? "Lanjutkan Belajar"
                    : "Mulai Belajar"}
              </button>
            ) : (
              <p className="text-xs text-muted-foreground mt-2">
                Belum ada lesson tersedia.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
