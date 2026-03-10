"use client";

import { Search } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatRupiah } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SubscriptionsTableProps {
  transactions: {
    id: string;
    orderId: string;
    plan: "monthly" | "yearly";
    amount: number;
    status: "pending" | "paid" | "failed" | "expired";
    createdAt: Date;
    user: {
      name: string;
      email: string;
    };
  }[];
}

export function SubscriptionsTable({ transactions }: SubscriptionsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
            Berhasil
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-500 ring-1 ring-inset ring-amber-500/20">
            Menunggu
          </span>
        );
      case "expired":
      case "failed":
        return (
          <span className="inline-flex items-center rounded-md bg-rose-500/10 px-2 py-1 text-xs font-medium text-rose-500 ring-1 ring-inset ring-rose-500/20">
            Gagal / Kedaluwarsa
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-gray-500/10 px-2 py-1 text-xs font-medium text-gray-500 ring-1 ring-inset ring-gray-500/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b">
        <div>
          <h3 className="font-semibold text-lg">Riwayat Transaksi</h3>
          <p className="text-sm text-muted-foreground">
            Daftar semua percobaan pembayaran dan transaksi sukses.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari Order ID..."
            className="h-10 w-full sm:w-[250px] rounded-md border border-input bg-transparent pl-9 pr-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="p-0">
        <div className="overflow-x-auto px-5">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-medium">Order ID</TableHead>
                <TableHead className="font-medium">User / Siswa</TableHead>
                <TableHead className="font-medium">Paket</TableHead>
                <TableHead className="font-medium">Nominal</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium text-xs">Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Belum ada transaksi sama sekali.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="whitespace-nowrap font-mono text-xs">
                      {transaction.orderId}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{transaction.user.name}</div>
                      <div className="text-muted-foreground text-xs">
                        {transaction.user.email}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {transaction.plan === "monthly" ? "Bulanan" : "Tahunan"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatRupiah(transaction.amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {format(
                        new Date(transaction.createdAt),
                        "dd MMM yyyy, HH:mm",
                        {
                          locale: id,
                        },
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
