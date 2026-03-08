export type CourseStatus = "published" | "draft";

export interface Course {
  id: string;
  slug: string;
  title: string;
  description?: string;
  students: number;
  lessons: number;
  rating: number;
  isFree: boolean;
  status: CourseStatus;
  sortOrder?: number;
  thumbnail: string | null;
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

export const STATUS_FILTERS = [
  { value: "Semua", label: "Semua" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
] as const;
