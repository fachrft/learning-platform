"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Zap, Loader2 } from "lucide-react";
import { Plan, PlanId } from "./types";
import { createTransactionAction } from "@/actions/payments/create-transaction";
import toast from "react-hot-toast";

declare global {
  interface Window {
    snap: any;
  }
}

interface PlanCtaProps {
  selectedPlan: Plan;
  isPremium: boolean;
  onSelectYearly: () => void;
}

export function PlanCta({
  selectedPlan,
  isPremium,
  onSelectYearly,
}: PlanCtaProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { update } = useSession();
  const isFree = selectedPlan.id === "free";
  const alreadyPremium = isPremium && !isFree;

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const res = await createTransactionAction(
        selectedPlan.id as "monthly" | "yearly",
      );

      if (!res.success || !res.token) {
        toast.error(res.error || "Gagal membuat transaksi");
        return;
      }

      if (typeof window.snap !== "undefined") {
        window.snap.pay(res.token, {
          onSuccess: async function () {
            toast.success("Pembayaran berhasil! Mengaktifkan premium...");
            await update();
            window.location.reload();
          },
          onPending: function () {
            toast.success("Menunggu pembayaran...");
          },
          onError: function () {
            toast.error("Pembayaran gagal!");
          },
          onClose: function () {
            toast.error("Kamu menutup popup belum bayar ya?");
          },
        });
      } else {
        toast.error("Gagal meload payment gateway, restart halamannya coba");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      {alreadyPremium ? (
        <button
          disabled
          className="w-full max-w-sm py-3.5 rounded-xl text-sm font-bold bg-muted text-muted-foreground cursor-default"
        >
          Kamu sudah Premium 🎉
        </button>
      ) : isFree ? (
        <button
          disabled
          className="w-full max-w-sm py-3.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground cursor-default"
        >
          Paket Aktif Kamu
        </button>
      ) : (
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full max-w-sm py-3.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-md shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          {isLoading
            ? "Memproses..."
            : `${selectedPlan.cta} — ${selectedPlan.price}`}
          {!isLoading && selectedPlan.id === "yearly" ? "/bln" : ""}
        </button>
      )}

      {!isFree && !isPremium && (
        <p className="text-xs text-muted-foreground">
          🔒 Garansi uang kembali 7 hari • Batalkan kapan saja
        </p>
      )}

      {(selectedPlan.id as PlanId) === "monthly" && (
        <p className="text-xs text-muted-foreground">
          💡 Beralih ke{" "}
          <button
            onClick={onSelectYearly}
            className="underline text-primary font-medium"
          >
            Tahunan
          </button>{" "}
          dan hemat Rp 389.000/tahun!
        </p>
      )}
    </div>
  );
}
