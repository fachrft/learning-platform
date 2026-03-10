"use client";

import { useAdminSubscriptions } from "@/hooks/payments/use-admin-subscriptions";
import { SubscriptionsHeader } from "@/components/admin/subscriptions/subscriptions-header";
import { SubscriptionsStats } from "@/components/admin/subscriptions/subscriptions-stats";
import { SubscriptionsTable } from "@/components/admin/subscriptions/subscriptions-table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AdminSubscriptionPage() {
  const { transactions, stats, isLoading, isError, error } =
    useAdminSubscriptions();

  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full">
        <SubscriptionsHeader />
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full w-full text-center py-20">
        <SubscriptionsHeader />
        <p className="text-destructive">
          Gagal memuat data: {(error as any)?.message}
        </p>
      </div>
    );
  }

  const totalPaid = (transactions as any[]).filter(
    (t: any) => t.status === "paid",
  ).length;
  const totalPending = (transactions as any[]).filter(
    (t: any) => t.status === "pending",
  ).length;

  return (
    <div className="flex flex-col h-full w-full">
      <SubscriptionsHeader />

      <div className="flex-1 space-y-6 p-4 md:p-8 overflow-auto">
        <SubscriptionsStats
          totalRevenue={stats.totalRevenue}
          totalPaid={totalPaid}
          totalPending={totalPending}
        />

        <SubscriptionsTable transactions={transactions as any} />
      </div>
    </div>
  );
}
