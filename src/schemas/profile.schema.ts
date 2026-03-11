import * as z from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  email: z.string().email("Email tidak valid"),
});

export type EditProfileFormValues = z.infer<typeof profileSchema>;
