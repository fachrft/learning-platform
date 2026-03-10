"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardStatsAction } from "@/actions/dashboard/admin";

export function useAdminDashboard() {
  const query = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const res = await getAdminDashboardStatsAction();
      if (!res.success) throw new Error(res.error || "Failed to fetch stats");
      return (
        res.data || {
          totalStudents: 0,
          totalPremium: 0,
          totalCourses: 0,
          totalRevenue: 0,
          recentStudents: [],
          recentTransactions: [],
        }
      );
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
