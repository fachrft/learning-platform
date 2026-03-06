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
    const toastId = toast.loading("Mendaftarkan akun...");
    startTransition(async () => {
      try {
        await registerAction(values);
        toast.success("Akun berhasil dibuat!", { id: toastId });
        router.push("/login");
      } catch (error) {
        toast.error("Terjadi kesalahan, coba lagi.", { id: toastId });
      }
    });
  }

  return { form, onSubmit, isPending };
}
