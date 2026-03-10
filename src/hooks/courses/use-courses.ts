import { useQuery } from "@tanstack/react-query";
import { getCoursesAction } from "@/actions/courses";
import { Course } from "@/types/course";

export function useCourses() {
  const {
    data: courses = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Course[]>({
    queryKey: ["admin_courses"],
    queryFn: async () => {
      const res = await getCoursesAction();
      if (!res.success || !res.data) {
        throw new Error(res.error || "Gagal memuat data kursus");
      }
      return (res.data as Course[]) ?? [];
    },
  });

  return { courses, isLoading, error: error?.message || null, refetch };
}
