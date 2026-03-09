"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/schemas/auth.schema";
import { signIn } from "next-auth/react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useLoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    const toastId = toast.loading("Memproses login...");

    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (!result?.ok || result?.error) {
          toast.error("Email atau kata sandi salah.", { id: toastId });
          return;
        }

        toast.success("Berhasil masuk!", { id: toastId });
        router.push("/admin");
        router.refresh();
      } catch {
        toast.error("Terjadi kesalahan, coba lagi.", { id: toastId });
      }
    });
  }

  return { form, onSubmit, isPending };
}
