import { notFound } from "next/navigation";
import { CourseDetailClient } from "@/components/student/course/course-detail-client";
import { getCourseDetailAction } from "@/actions/courses/student";
import { Chapter } from "@/types/course";


interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;

  const res = await getCourseDetailAction(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  const course = res.data;
  const totalLessons = course.chapters.reduce(
    (acc: number, ch: Chapter) => acc + ch.lessons.length,
    0,
  );

  return <CourseDetailClient course={course} totalLessons={totalLessons} />;
}
