"use client";

import { Users, BookOpen, Crown, TrendingUp } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface DashboardStatsProps {
  totalStudents: number;
  totalCourses: number;
  totalPremium: number;
  totalRevenue: number;
}

export function DashboardStats({
  totalStudents,
  totalCourses,
  totalPremium,
  totalRevenue,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            Total semua pengguna siswa
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Total Kursus</h3>
          <div className="p-2 bg-violet-500/10 rounded-md">
            <BookOpen className="h-4 w-4 text-violet-500" />
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">
            {totalCourses.toLocaleString("id-ID")}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Kursus yang tersedia
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Siswa Premium</h3>
          <div className="p-2 bg-amber-500/10 rounded-md">
            <Crown className="h-4 w-4 text-amber-500" />
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">
            {totalPremium.toLocaleString("id-ID")}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Pengguna paket langganan
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Pendapatan</h3>
          <div className="p-2 bg-emerald-500/10 rounded-md">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{formatRupiah(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total semua transaksi sukses
          </p>
        </div>
      </div>
    </div>
  );
}
