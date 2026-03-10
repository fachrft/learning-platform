import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCourseDetailAction } from "@/actions/courses/student";
import { CourseFinishedClient } from "@/components/student/course/course-finished-client";
import { CourseReview } from "@/types/course";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CourseFinishedPage({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const res = await getCourseDetailAction(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  const course = res.data;
  const existingReview = course.course_reviews?.find(
    (review: CourseReview) => review.userId === session.user.id,
  );

  return (
    <CourseFinishedClient
      courseSlug={slug}
      courseId={course.id}
      courseTitle={course.title}
      existingReview={existingReview || null}
    />
  );
}
