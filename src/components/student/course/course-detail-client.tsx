"use client";

import { CourseHero } from "./course-hero";
import { CourseCurriculum } from "./course-curriculum";
import { CourseReviewList } from "./course-review-list";
import { Course } from "./types";

interface Props {
  course: Course;
  totalLessons: number;
}

export function CourseDetailClient({ course, totalLessons }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <CourseHero course={course} totalLessons={totalLessons} />

      <CourseCurriculum chapters={course.chapters} />

      <CourseReviewList reviews={course.course_reviews as any} />
    </div>
  );
}
