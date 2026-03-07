import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(3, "Judul kursus minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi kursus minimal 10 karakter"),
  thumbnail: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  isFree: z.boolean().default(false),
  sortOrder: z.coerce.number().min(0).default(0),
});

export type CourseInput = z.infer<typeof courseSchema>;
