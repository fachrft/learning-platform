"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/schemas/auth.schema";
import { registerAction } from "@/actions/auth";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useRegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterInput) {
    startTransition(async () => {
      await toast.promise(registerAction(values), {
        loading: "Mendaftarkan akun...",
        success: "Akun berhasil dibuat!",
        error: (err: Error) => err.message ?? "Terjadi kesalahan, coba lagi.",
      });
      router.push("/login");
    });
  }

  return { form, onSubmit, isPending };
}
