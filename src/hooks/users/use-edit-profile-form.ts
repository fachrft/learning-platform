import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { updateProfileAction } from "@/actions/users/profile";
import { useSession } from "next-auth/react";
import {
  profileSchema,
  type EditProfileFormValues,
} from "@/schemas/profile.schema";

export type { EditProfileFormValues };

export function useEditProfileForm(
  userId: string,
  defaultValues: EditProfileFormValues,
  onSuccess: () => void,
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { update } = useSession();

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  async function onSubmit(data: EditProfileFormValues) {
    setIsSubmitting(true);
    try {
      const result = await updateProfileAction(userId, data);
      if (result.success) {
        toast.success("Profil berhasil diperbarui!");
        await update(); // This tells NextAuth to refresh the JWT and Session
        onSuccess();
      } else {
        toast.error(result.error ?? "Gagal memperbarui profil.");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem, silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return { form, onSubmit, isSubmitting };
}
