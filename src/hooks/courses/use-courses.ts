import { useQuery } from "@tanstack/react-query";
import { getCoursesAction } from "@/actions/courses";
import { Course } from "@/components/admin/courses/types";

export function useCourses() {
  const {
    data: courses = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin_courses"],
    queryFn: async () => {
      const res = await getCoursesAction();
      if (!res.success || !res.data) {
        throw new Error(res.error || "Gagal memuat data kursus");
      }

      return res.data.map((c) => {
        const students = c.course_enrollments?.length || 0;
        const ratings = c.course_reviews?.map((r) => r.rating) || [];
        const avgRating =
          ratings.length > 0
            ? ratings.reduce((a: number, b: number) => a + b, 0) /
              ratings.length
            : 0;

        let totalLessons = 0;
        if (c.chapters) {
          c.chapters.forEach((ch) => {
            totalLessons += ch.lessons?.length || 0;
          });
        }

        return {
          id: c.id,
          title: c.title,
          description: c.description,
          students,
          lessons: totalLessons,
          rating: Number(avgRating.toFixed(1)),
          isFree: c.isFree ?? false,
          status: c.status as "published" | "draft",
          sortOrder: c.sortOrder ?? 0,
          thumbnail: c.thumbnail,
          updatedAt: c.updatedAt
            ? new Date(c.updatedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Baru saja",
        };
      });
    },
  });

  return { courses, isLoading, error: error?.message || null, refetch };
}
