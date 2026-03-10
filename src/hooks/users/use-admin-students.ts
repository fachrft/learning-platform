"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminStudentsAction } from "@/actions/users/admin";

export function useAdminStudents() {
  const query = useQuery({
    queryKey: ["admin-students"],
    queryFn: async () => {
      const res = await getAdminStudentsAction();
      if (!res.success)
        throw new Error(res.error || "Failed to fetch students");
      return res.data || [];
    },
  });

  return {
    students: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
