"use client";

import { Users, Crown, UserPlus } from "lucide-react";

interface StudentsStatsProps {
  totalStudents: number;
  totalPremium: number;
  newThisMonth: number;
}

export function StudentsStats({
  totalStudents,
  totalPremium,
  newThisMonth,
}: StudentsStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Total Siswa</h3>
          <div className="p-2 bg-primary/10 rounded-md">
            <Users className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{totalStudents}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total semua pengguna siswa
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
          <div className="text-2xl font-bold">{totalPremium}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Siswa dengan paket langganan aktif
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">Siswa Baru</h3>
          <div className="p-2 bg-emerald-500/10 rounded-md">
            <UserPlus className="h-4 w-4 text-emerald-500" />
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{newThisMonth}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Bergabung di bulan ini
          </p>
        </div>
      </div>
    </div>
  );
}
