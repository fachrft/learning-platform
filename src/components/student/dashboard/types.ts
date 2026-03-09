export type Lesson = {
  id: string;
  title: string;
  type: string | null;
  sortOrder: number | null;
};

export type Chapter = {
  id: string;
  title: string;
  sortOrder: number | null;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  slug: string | null;
  isFree: boolean | null;
  course_enrollments: { userId: string }[];
  course_reviews: { rating: number }[];
  chapters: Chapter[];
};
