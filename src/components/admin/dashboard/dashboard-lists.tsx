"use client";

import { Users, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface DashboardListsProps {
  recentStudents: any[];
  recentTransactions: any[];
}

export function DashboardLists({
  recentStudents,
  recentTransactions,
}: DashboardListsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Enrollments */}
      <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div>
            <h2 className="font-semibold text-sm">Siswa Terbaru</h2>
            <p className="text-xs text-muted-foreground">
              Pendaftaran akun terbaru
            </p>
          </div>
        </div>
        <div className="divide-y divide-border/50 flex-1">
          {recentStudents.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Belum ada siswa
            </div>
          ) : (
            recentStudents.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/40 transition-colors"
              >
                {/* Avatar */}
                <div className="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-blue-500 uppercase">
                    {(s.name || "U").charAt(0)}
                  </span>
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {s.name || "Anonim"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {s.email}
                  </p>
                </div>
                {/* Time */}
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {s.createdAt
                    ? formatDistanceToNow(new Date(s.createdAt), {
                        addSuffix: true,
                        locale: id,
                      })
                    : ""}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div>
            <h2 className="font-semibold text-sm">Transaksi Terbaru</h2>
            <p className="text-xs text-muted-foreground">
              Pembayaran paket premium
            </p>
          </div>
        </div>
        <div className="divide-y divide-border/50 flex-1">
          {recentTransactions.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Belum ada transaksi
            </div>
          ) : (
            recentTransactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/40 transition-colors"
              >
                {/* Icon */}
                <div className="h-9 w-9 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-emerald-500 uppercase">
                    Rp
                  </span>
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate hover:text-clip">
                    {t.user?.name || "Memuat"} &bull;{" "}
                    <span className="text-emerald-500 font-medium">
                      Rp {t.amount.toLocaleString("id-ID")}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {t.orderId}
                  </p>
                </div>
                {/* Time */}
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {t.paidAt || t.createdAt
                    ? formatDistanceToNow(new Date(t.paidAt || t.createdAt), {
                        addSuffix: true,
                        locale: id,
                      })
                    : ""}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
