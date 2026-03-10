"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAdminPaymentTransactionsAction,
  getAdminRevenueStatsAction,
} from "@/actions/payments/admin";

export function useAdminSubscriptions() {
  const transactionsQuery = useQuery({
    queryKey: ["admin-transactions"],
    queryFn: async () => {
      const res = await getAdminPaymentTransactionsAction();
      if (!res.success)
        throw new Error(res.error || "Failed to fetch transactions");
      return res.data || [];
    },
  });

  const statsQuery = useQuery({
    queryKey: ["admin-revenue-stats"],
    queryFn: async () => {
      const res = await getAdminRevenueStatsAction();
      if (!res.success) throw new Error(res.error || "Failed to fetch stats");
      return res.data || { totalRevenue: 0 };
    },
  });

  const isLoading = transactionsQuery.isLoading || statsQuery.isLoading;
  const isError = transactionsQuery.isError || statsQuery.isError;
  const error = transactionsQuery.error || statsQuery.error;

  return {
    transactions: transactionsQuery.data || [],
    stats: statsQuery.data || { totalRevenue: 0 },
    isLoading,
    isError,
    error,
    refetch: () => {
      transactionsQuery.refetch();
      statsQuery.refetch();
    },
  };
}
