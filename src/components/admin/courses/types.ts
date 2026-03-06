export type CourseStatus = "published" | "draft";

export interface Course {
  id: number;
  title: string;
  category: string;
  instructor: string;
  students: number;
  lessons: number;
  duration: string;
  rating: number;
  isFree: boolean;
  status: CourseStatus;
  thumbnail: string | null;
  color: string;
  updatedAt: string;
}

export const STATUS_CONFIG: Record<
  CourseStatus,
  { label: string; className: string }
> = {
  published: {
    label: "Published",
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  draft: {
    label: "Draft",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
};

export const CATEGORIES = [
  "Semua",
  "Frontend",
  "Backend",
  "Design",
  "Data Science",
  "Mobile",
  "Marketing",
] as const;

export const STATUS_FILTERS = [
  { value: "Semua", label: "Semua" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
] as const;
