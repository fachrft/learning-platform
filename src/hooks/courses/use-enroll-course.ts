import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Course, Lesson } from "@/types/course";
import { enrollCourseAction } from "@/actions/courses/student";

interface UseEnrollCourseProps {
  course: Course;
  totalLessons: number;
  isLocked?: boolean;
}

export function useEnrollCourse({
  course,
  totalLessons,
  isLocked,
}: UseEnrollCourseProps) {
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const completedLessons = course.chapters.reduce(
    (acc: number, ch) =>
      acc +
      (ch.lessons?.filter((l: Lesson) => l.user_progress?.[0]?.completed)
        .length ?? 0),
    0,
  );

  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const handleEnrollAndStart = async () => {
    if (isLocked) {
      router.push("/dashboard/paket");
      return;
    }

    if (!course.chapters[0]?.lessons[0]) return;

    setIsEnrolling(true);
    try {
      // Background create enrollment
      await enrollCourseAction(course.id);

      let targetLessonUrl = `/course/${course.slug}/chapter/${course.chapters[0].slug}/lesson/${course.chapters[0].lessons[0].slug}`;

      let uncompletedFound = false;
      for (const chapter of course.chapters) {
        for (const lesson of chapter.lessons || []) {
          if (!lesson.user_progress?.[0]?.completed) {
            targetLessonUrl = `/course/${course.slug}/chapter/${chapter.slug}/lesson/${lesson.slug}`;
            uncompletedFound = true;
            break;
          }
        }
        if (uncompletedFound) break;
      }

      if (!uncompletedFound && progressPercentage > 0) {
        const lastChapter = course.chapters[course.chapters.length - 1];
        if (
          lastChapter &&
          lastChapter.lessons &&
          lastChapter.lessons.length > 0
        ) {
          const lastLesson =
            lastChapter.lessons[lastChapter.lessons.length - 1];
          targetLessonUrl = `/course/${course.slug}/chapter/${lastChapter.slug}/lesson/${lastLesson.slug}`;
        }
      }

      router.push(targetLessonUrl);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal memulai kursus.",
      );
    } finally {
      setIsEnrolling(false);
    }
  };

  return {
    isEnrolling,
    completedLessons,
    progressPercentage,
    handleEnrollAndStart,
  };
}
