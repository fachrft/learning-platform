import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Chapter, Course, Lesson, CourseReview } from "@/types/course";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}
export function getAverageRating(reviews: CourseReview[]) {
  if (!reviews || reviews.length === 0) return 0;

  const sum = reviews.reduce((acc, curr) => {
    return acc + (curr?.rating ?? 0);
  }, 0);

  return sum / reviews.length;
}

export function getCourseLessonsCount(course: Course): number {
  if (!course?.chapters) return 0;
  return course.chapters.reduce(
    (acc: number, ch: Chapter) => acc + (ch.lessons?.length ?? 0),
    0,
  );
}

export function getTotalLessonsCount(courses: Course[]): number {
  if (!courses) return 0;
  return courses.reduce(
    (sum: number, course: Course) => sum + getCourseLessonsCount(course),
    0,
  );
}

export function getCompletedLessonsCount(course: Course): number {
  if (!course?.chapters) return 0;
  return course.chapters.reduce(
    (acc: number, ch: Chapter) =>
      acc +
      (ch.lessons?.filter((l: Lesson) => l.user_progress?.[0]?.completed)
        .length ?? 0),
    0,
  );
}

export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export function formatDateIndo(date: Date | string | null | undefined): string {
  if (!date) return "-";
  return format(new Date(date), "dd MMM yyyy", { locale: id });
}

export function formatTimeAgo(date: Date | string | null | undefined): string {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: id,
  });
}
