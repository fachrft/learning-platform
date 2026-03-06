"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRegisterForm } from "@/hooks/auth/use-register-form";

export default function RegisterPage() {
  const { form, onSubmit, isPending } = useRegisterForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Buat Akun Baru
        </h1>
      </div>

      {/* Form Card */}
      <div className="bg-card border border-border/50 rounded-2xl shadow-lg p-8 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Nama Lengkap */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              type="text"
              placeholder="Nama Lengkap"
              autoComplete="name"
              className={`h-10 ${errors.name ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Alamat Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="kamu@email.com"
              autoComplete="email"
              className={`h-10 ${errors.email ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Kata Sandi</Label>
            <PasswordInput
              id="password"
              placeholder="Minimal 8 karakter"
              autoComplete="new-password"
              className={`h-10 ${errors.password ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Ulangi kata sandi"
              autoComplete="new-password"
              className={`h-10 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-11 rounded-full font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all group"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mendaftarkan...
              </>
            ) : (
              <>
                Daftar Sekarang
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Footer link */}
      <p className="text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline underline-offset-4 transition-colors"
        >
          Masuk di Sini
        </Link>
      </p>
    </div>
  );
}
