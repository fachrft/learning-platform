import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CourseDetailClient } from "@/components/student/course/course-detail-client";
import { getCourseDetailAction } from "@/actions/courses/student";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  const res = await getCourseDetailAction(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  const course = res.data;
  const totalLessons = course.chapters.reduce(
    (acc: number, ch: any) => acc + ch.lessons.length,
    0,
  );

  return <CourseDetailClient course={course} totalLessons={totalLessons} />;
}
