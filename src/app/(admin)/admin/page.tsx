"use client";

import { useAdminDashboard } from "@/hooks/dashboard/use-admin-dashboard";
import { DashboardHeader } from "@/components/admin/dashboard/dashboard-header";
import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats";
import { DashboardLists } from "@/components/admin/dashboard/dashboard-lists";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full">
        <DashboardHeader />
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full w-full text-center py-20">
        <DashboardHeader />
        <p className="text-destructive">
          Gagal memuat data: {error?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <DashboardHeader />

      <div className="flex-1 space-y-6 p-4 md:p-8 overflow-auto">
        <DashboardStats
          totalStudents={data?.totalStudents || 0}
          totalCourses={data?.totalCourses || 0}
          totalPremium={data?.totalPremium || 0}
          totalRevenue={data?.totalRevenue || 0}
        />

        <DashboardLists
          recentStudents={data?.recentStudents || []}
          recentTransactions={data?.recentTransactions || []}
        />
      </div>
    </div>
  );
}
