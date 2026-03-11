"use client";

import { useState } from "react";
import { EditProfileModal } from "./edit-profile-modal";
import { Shield, Sparkles, Mail, ShieldCheck } from "lucide-react";

interface ProfileClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    subscription?: "free" | "premium";
  };
}

export function ProfileClient({ user }: ProfileClientProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isPremium = user.subscription === "premium";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Profil Saya
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola informasi personal dan status langganan kamu.
        </p>
      </div>

      <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 md:p-10 relative overflow-hidden shadow-sm">
        <div className="relative z-10 space-y-8">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-md">
                <span className="text-4xl font-extrabold text-primary">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-foreground">
                  {user.name || "Pengguna Tanpa Nama"}
                </h2>
                <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl text-sm transition-all flex items-center gap-2"
            >
              Edit Profil
            </button>
          </div>

          <hr className="border-border/50" />

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-background/50 border border-border/40 p-5 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Peran Akun
                </p>
                <p className="text-base font-bold text-foreground capitalize">
                  {user.role || "Pelajar"}
                </p>
              </div>
            </div>

            <div
              className={`border p-5 rounded-2xl flex items-center gap-4 ${
                isPremium
                  ? "bg-amber-500/5 border-amber-500/20"
                  : "bg-background/50 border-border/40"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  isPremium
                    ? "bg-amber-100 dark:bg-amber-900/50"
                    : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                {isPremium ? (
                  <Sparkles className="w-6 h-6 text-amber-500" />
                ) : (
                  <Shield className="w-6 h-6 text-slate-500" />
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Status Langganan
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p
                    className={`text-base font-bold capitalize leading-none ${
                      isPremium
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-foreground"
                    }`}
                  >
                    {user.subscription || "Free"}
                  </p>
                  {isPremium && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                      Aktif
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userId={user.id}
        defaultValues={{
          name: user.name || "",
          email: user.email || "",
        }}
      />
    </div>
  );
}
