"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useLoginForm } from "@/hooks/auth/use-login-form";

export default function LoginPage() {
  const { form, onSubmit, isPending } = useLoginForm();
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
          Selamat Datang Kembali
        </h1>
        <p className="text-muted-foreground text-sm">
          Masuk dan lanjutkan perjalanan belajarmu bersama Lumina.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-card border border-border/50 rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Kata Sandi</Label>
            </div>
            <PasswordInput
              id="password"
              placeholder="Masukkan kata sandi"
              autoComplete="current-password"
              className={`h-10 ${errors.password ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
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
                Memproses...
              </>
            ) : (
              <>
                Masuk ke Akun
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Footer link */}
      <p className="text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline underline-offset-4 transition-colors"
        >
          Daftar Sekarang
        </Link>
      </p>
    </div>
  );
}
