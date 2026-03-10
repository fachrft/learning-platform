export type CourseStatus = "published" | "draft";
export type LessonType = "video" | "text" | "quiz";

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean | null;
  completedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Quiz {
  id: string;
  lessonId: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D";
  points: number | null;
  sortOrder: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  lessonId: string;
  score: number;
  totalPoints: number;
  passed: boolean | null;
  answers: Record<string, string> | null;
  createdAt: Date | null;
}

export interface Lesson {
  id: string;
  chapterId?: string;
  title: string;
  description?: string | null;
  content?: string | null;
  videoUrl?: string | null;
  type: LessonType | null;
  slug: string | null;
  sortOrder: number;
  user_progress?: LessonProgress[];
  quizzes?: Quiz[];
  quiz_attempts?: QuizAttempt[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
  chapterSlug?: string | null;
}

export interface Chapter {
  id: string;
  courseId?: string;
  title: string;
  description?: string | null;
  slug: string | null;
  sortOrder: number;
  lessons: Lesson[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface CourseEnrollment {
  userId: string;
  courseId: string;
  enrolledAt: Date | null;
}

export interface CourseReview {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string | null;
  createdAt: Date | null;
  user?: {
    name: string | null;
    email?: string | null;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  slug: string | null;
  status: CourseStatus | null;
  isFree: boolean | null;
  sortOrder: number;
  students?: number;
  lessons?: number;
  rating?: number;
  chapters: Chapter[];
  course_enrollments?: CourseEnrollment[];
  course_reviews?: CourseReview[];
  createdAt: Date | null;
  updatedAt: Date | null;
}
export const STATUS_CONFIG: Record<
  CourseStatus,
  { label: string; className: string }
> = {
  published: {
    label: "Published",
    className: "bg-emerald-600 text-white border-none shadow-sm",
  },
  draft: {
    label: "Draft",
    className: "bg-amber-500 text-white border-none shadow-sm",
  },
};

export const STATUS_FILTERS = [
  { value: "Semua", label: "Semua" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
] as const;
