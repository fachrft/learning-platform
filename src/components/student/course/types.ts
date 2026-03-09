export interface Lesson {
  id: string;
  title: string;
  type: "video" | "text" | "quiz" | null;
  slug: string | null;
  sortOrder: number | null;
}

export interface Chapter {
  id: string;
  title: string;
  description: string | null;
  slug: string | null;
  sortOrder: number | null;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  slug: string | null;
  isFree: boolean | null;
  chapters: Chapter[];
  course_enrollments?: any[];
  course_reviews?: any[];
}
