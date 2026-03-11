"use client";

import { usePublishedCourses } from "@/hooks/courses/use-published-courses";
import {
  getCourseLessonsCount,
  getTotalLessonsCount,
  getCompletedLessonsCount,
} from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DashboardHero } from "./dashboard-hero";
import { DashboardCourseList } from "./dashboard-course-list";

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

  const totalLessons = getTotalLessonsCount(courses);

  const freeCoursesCount = (courses || []).filter((c) => c.isFree).length;

  const completedCoursesCount = (courses || []).filter((c) => {
    const tLessons = getCourseLessonsCount(c);
    if (tLessons === 0) return false;
    const cLessons = getCompletedLessonsCount(c);
    return cLessons === tLessons;
  }).length;

  const firstName = user.name?.split(" ")[0] ?? "Pelajar";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <DashboardHero
        firstName={firstName}
        subscription={user.subscription ?? "free"}
        totalCourses={courses.length}
        totalLessons={totalLessons}
        completedCourses={completedCoursesCount}
        freeCourses={freeCoursesCount}
      />

      <DashboardCourseList courses={courses} />
    </div>
  );
}
