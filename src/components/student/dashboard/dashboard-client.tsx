"use client";

import { BookOpen, Star, FileText, CheckCircle } from "lucide-react";
import { usePublishedCourses } from "@/hooks/courses/use-published-courses";
import { CourseCard } from "./course-card";
import { Course, Chapter } from "./types";
import { getAverageRating } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface DashboardClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    subscription?: "free" | "premium";
  };
}

export function DashboardClient({ user }: DashboardClientProps) {
  const { data: courses = [], isLoading, isError } = usePublishedCourses();

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-destructive font-medium">
          Gagal memuat data kursus.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  const totalLessons = courses.reduce(
    (sum: number, c: Course) =>
      sum +
      c.chapters.reduce(
        (s: number, ch: Chapter) => s + (ch.lessons?.length ?? 0),
        0,
      ),
    0,
  );

  const freeCoursesCount = courses.filter((c: Course) => c.isFree).length;

  const completedCoursesCount = courses.filter((c: Course) => {
    const tLessons = c.chapters.reduce(
      (s: number, ch: Chapter) => s + (ch.lessons?.length ?? 0),
      0,
    );
    if (tLessons === 0) return false;
    const cLessons = c.chapters.reduce(
      (acc: number, ch: any) =>
        acc +
        (ch.lessons?.filter((l: any) => l.user_progress?.[0]?.completed)
          .length ?? 0),
      0,
    );
    return cLessons === tLessons;
  }).length;

  const firstName = user.name?.split(" ")[0] ?? "Pelajar";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Hero */}
      <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Hari ini mau belajar apa?
            </p>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                user.subscription === "premium"
                  ? "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800"
                  : "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
              }`}
            >
              {user.subscription ?? "free"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Selamat Datang, <span className="text-primary">{firstName}!👋</span>
          </h1>
          <p className="text-sm text-muted-foreground pt-1">
            Ada{" "}
            <span className="font-medium text-foreground">
              {courses.length} kursus
            </span>{" "}
            sama{" "}
            <span className="font-medium text-foreground">
              {totalLessons} materi
            </span>{" "}
            yang nungguin lo. Gas mulai sekarang!
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {[
            { label: "Kursus", value: courses.length, icon: BookOpen },
            {
              label: "Selesai",
              value: completedCoursesCount,
              icon: CheckCircle,
            },
            { label: "Materi", value: totalLessons, icon: FileText },
            {
              label: "Kursus Gratis",
              value: freeCoursesCount,
              icon: Star,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 bg-muted rounded-xl px-4 py-2.5"
            >
              <Icon className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-foreground">
                  {value}
                </span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-foreground">Semua Kursus</h2>
            <p className="text-sm text-muted-foreground">
              {courses.length} kursus tersedia
            </p>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-dashed border-border text-center gap-3">
            <BookOpen className="w-10 h-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground font-medium">
              Belum ada kursus tersedia
            </p>
            <p className="text-xs text-muted-foreground/70">
              Kursus baru akan segera ditambahkan. Pantau terus ya!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courses.map((course: Course) => (
              <CourseCard
                key={course.id}
                course={course}
                subscription={user.subscription}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
