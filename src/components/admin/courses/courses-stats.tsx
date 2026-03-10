"use client";

import { BookOpen, CheckCircle, Users } from "lucide-react";

interface CoursesStatsProps {
  totalCourses: number;
  totalPublished: number;
  totalStudents: number;
}

export function CoursesStats({
  totalCourses,
  totalPublished,
  totalStudents,
}: CoursesStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Total Kursus</h3>
          <div className="p-2 bg-violet-500/10 rounded-md">
            <BookOpen className="h-4 w-4 text-violet-500" />
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{totalCourses}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total semua kursus yang dibuat
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Published</h3>
          <div className="p-2 bg-emerald-500/10 rounded-md">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{totalPublished}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Kursus yang aktif dipublikasikan
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Total Siswa</h3>
          <div className="p-2 bg-blue-500/10 rounded-md">
            <Users className="h-4 w-4 text-blue-500" />
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">
            {totalStudents.toLocaleString("id-ID")}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total siswa yang terdaftar
          </p>
        </div>
      </div>
    </div>
  );
}
