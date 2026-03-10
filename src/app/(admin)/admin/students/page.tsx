"use client";

import { useAdminStudents } from "@/hooks/users/use-admin-students";
import { StudentsHeader } from "@/components/admin/students/students-header";
import { StudentsStats } from "@/components/admin/students/students-stats";
import { StudentsTable } from "@/components/admin/students/students-table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isThisMonth } from "date-fns";

export default function AdminStudentPage() {
  const { students, isLoading, isError, error } = useAdminStudents();

  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full">
        <StudentsHeader />
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full w-full text-center py-20">
        <StudentsHeader />
        <p className="text-destructive">
          Gagal memuat data: {(error as any)?.message}
        </p>
      </div>
    );
  }

  const typedStudents = students as any[];

  const totalStudents = typedStudents.length;
  const totalPremium = typedStudents.filter(
    (s) => s.subscription === "premium",
  ).length;

  const newThisMonth = typedStudents.filter((s) => {
    if (!s.createdAt) return false;
    return isThisMonth(new Date(s.createdAt));
  }).length;

  return (
    <div className="flex flex-col h-full w-full">
      <StudentsHeader />

      <div className="flex-1 space-y-6 p-4 md:p-8 overflow-auto">
        <StudentsStats
          totalStudents={totalStudents}
          totalPremium={totalPremium}
          newThisMonth={newThisMonth}
        />

        <StudentsTable students={typedStudents} />
      </div>
    </div>
  );
}
