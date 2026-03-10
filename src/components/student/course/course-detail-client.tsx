"use client";

import { CourseHero } from "./course-hero";
import { CourseCurriculum } from "./course-curriculum";
import { CourseReviewList } from "./course-review-list";
import { Course } from "@/types/course";
import { useSession } from "next-auth/react";

interface Props {
  course: Course;
  totalLessons: number;
}

export function CourseDetailClient({ course, totalLessons }: Props) {
  const { data: session } = useSession();

  const isPremium = session?.user?.subscription === "premium";
  const isLocked = !course.isFree && !isPremium;

  return (
    <div className="min-h-screen bg-background">
      <CourseHero
        course={course}
        totalLessons={totalLessons}
        isLocked={isLocked}
      />

      <CourseCurriculum chapters={course.chapters} isLocked={isLocked} />

      <CourseReviewList reviews={course.course_reviews || []} />
    </div>
  );
}
