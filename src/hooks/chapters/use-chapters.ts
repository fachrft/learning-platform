import { useQuery } from "@tanstack/react-query";
import { getCourseBySlug } from "@/actions/chapters";

export function fetchCourseChapters(slug: string) {
  return async () => {
    const res = await getCourseBySlug(slug);
    if (!res.success || !res.data) {
      throw new Error(res.error || "Gagal memuat data kursus/bab");
    }
    return res.data;
  };
}

export function useChapters(slug: string) {
  const {
    data: course,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin_course_chapters", slug],
    queryFn: fetchCourseChapters(slug),
    enabled: !!slug,
  });

  return { course, isLoading, error: error?.message || null, refetch };
}
