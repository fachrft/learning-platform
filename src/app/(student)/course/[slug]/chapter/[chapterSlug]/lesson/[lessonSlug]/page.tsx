import { notFound, redirect } from "next/navigation";
import { getLessonPageDataAction } from "@/actions/lessons/student";
import { LessonClient } from "@/components/student/lesson/lesson-client";
import { getLessonAccessState } from "@/lib/course-progress";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; chapterSlug: string; lessonSlug: string }>;
}) {
  const { slug, chapterSlug, lessonSlug } = await params;

  const res = await getLessonPageDataAction(slug, lessonSlug);

  if (res.error === "PremiumRequired") {
    redirect("/dashboard/paket");
  }

  if (!res.success || !res.data) {
    notFound();
  }

  const { course, userProgress, currentLesson, nextLesson, prevLesson } =
    res.data;

  // Hitung status lock berdasarkan progress
  const computedStatus = getLessonAccessState(course.chapters, userProgress);

  // Jika materi saat ini terkunci (karena belum beresin materi sebelumnya)
  const isCurrentLocked = computedStatus[currentLesson.id]?.isLocked;
  const isCurrentCompleted = computedStatus[currentLesson.id]?.isCompleted;

  // Render client component
  return (
    <LessonClient
      course={course}
      currentLesson={currentLesson}
      nextLesson={nextLesson}
      prevLesson={prevLesson}
      computedStatus={computedStatus}
      isCurrentLocked={isCurrentLocked}
      isCurrentCompleted={isCurrentCompleted}
    />
  );
}
