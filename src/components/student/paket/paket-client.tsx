"use client";

import { useState } from "react";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { PLANS, PlanId } from "./types";
import { PlanCard } from "./plan-card";
import { PlanCta } from "./plan-cta";
import { PaketHighlights } from "./paket-highlights";

interface PaketClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    subscription?: "free" | "premium";
  };
}

export function PaketClient({ user }: PaketClientProps) {
  const [selected, setSelected] = useState<PlanId>("yearly");
  const isPremium = user.subscription === "premium";

  const selectedPlan = PLANS.find((p) => p.id === selected)!;

  return (
    <div className="min-h-screen bg-background">
      {/* Back nav */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Kembali ke Dashboard
        </Link>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden pt-4 pb-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-[0.06] dark:opacity-[0.08]"
          style={{
            background:
              "radial-gradient(circle, hsl(243 75% 59%), transparent 70%)",
          }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Pilih paket yang cocok buat kamu
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground leading-tight tracking-tight">
            Belajar tanpa batas.
            <br />
            <span className="text-primary">Berkembang lebih cepat.</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Mulai dari gratis, atau upgrade premium untuk akses penuh ke semua
            kursus, video HD, dan sertifikat.
          </p>
        </div>
      </section>

      {/* Pricing section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selected === plan.id}
              onSelect={setSelected}
            />
          ))}
        </div>

        {/* CTA */}
        <PlanCta
          selectedPlan={selectedPlan}
          isPremium={isPremium}
          onSelectYearly={() => setSelected("yearly")}
        />

        {/* Why premium + reassurance */}
        <PaketHighlights />
      </section>
    </div>
  );
}
