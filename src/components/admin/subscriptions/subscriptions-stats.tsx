"use client";

import { CreditCard, ArrowUpRight, TrendingUp } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface SubscriptionsStatsProps {
  totalRevenue: number;
  totalPaid: number;
  totalPending: number;
}

export function SubscriptionsStats({
  totalRevenue,
  totalPaid,
  totalPending,
}: SubscriptionsStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">
            Total Pendapatan
          </h3>
          <div className="p-2 bg-primary/10 rounded-md">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{formatRupiah(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Dari semua transaksi berhasil
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">
            Transaksi Sukses
          </h3>
          <div className="p-2 bg-emerald-500/10 rounded-md">
            <CreditCard className="h-4 w-4 text-emerald-500" />
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{totalPaid}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total transaksi berbayar
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">
            Transaksi Pending
          </h3>
          <div className="p-2 bg-amber-500/10 rounded-md">
            <ArrowUpRight className="h-4 w-4 text-amber-500" />
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{totalPending}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Menunggu pembayaran
          </p>
        </div>
      </div>
    </div>
  );
}
