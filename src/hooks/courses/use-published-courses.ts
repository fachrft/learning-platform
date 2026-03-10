"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublishedCoursesAction } from "@/actions/courses/student";
import { Course } from "@/types/course";

export function usePublishedCourses() {
  return useQuery<Course[]>({
    queryKey: ["published-courses"],
    queryFn: async () => {
      const result = await getPublishedCoursesAction();
      if (!result.success) {
        throw new Error(result.error);
      }
      return (result.data as Course[]) ?? [];
    },
  });
}
