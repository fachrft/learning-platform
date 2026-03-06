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
    startTransition(async () => {
      await toast.promise(
        (async () => {
          const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
          });

          if (result?.error) {
            throw new Error("Email atau kata sandi salah.");
          }

        })(),
        {
          loading: "Memproses login...",
          success: "Berhasil masuk!",
          error: (err: Error) => err.message ?? "Terjadi kesalahan.",
        },
      );
      
      router.push("/dashboard");
      router.refresh();
    });
  }

  return { form, onSubmit, isPending };
}
