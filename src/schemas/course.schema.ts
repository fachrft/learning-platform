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

export const chapterSchema = z.object({
  courseId: z.string().min(1, "ID Kursus wajib diisi"),
  title: z.string().min(3, "Judul bab minimal 3 karakter"),
  description: z.string().optional(),
  sortOrder: z.coerce.number().min(0).default(0),
});

export type ChapterInput = z.infer<typeof chapterSchema>;

export const lessonSchema = z.object({
  title: z.string().min(3, "Judul materi minimal 3 karakter"),
  description: z.string().optional(),
  type: z.enum(["video", "text", "quiz"]).default("text"),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  sortOrder: z.coerce.number().min(0).default(0),
  quizzes: z
    .array(
      z.object({
        question: z.string().min(5, "Pertanyaan harus spesifik"),
        optionA: z.string().min(1, "Opsi A wajib diisi"),
        optionB: z.string().min(1, "Opsi B wajib diisi"),
        optionC: z.string().min(1, "Opsi C wajib diisi"),
        optionD: z.string().min(1, "Opsi D wajib diisi"),
        correctAnswer: z.enum(["A", "B", "C", "D"]),
        points: z.coerce.number().min(1).default(10),
        sortOrder: z.coerce.number().min(0).default(0),
      }),
    )
    .optional(),
});

export type LessonInput = z.infer<typeof lessonSchema>;

export const quizSchema = z.object({
  lessonId: z.string().min(1, "ID Materi wajib diisi"),
  question: z.string().min(5, "Pertanyaan harus spesifik"),
  optionA: z.string().min(1, "Opsi A wajib diisi"),
  optionB: z.string().min(1, "Opsi B wajib diisi"),
  optionC: z.string().min(1, "Opsi C wajib diisi"),
  optionD: z.string().min(1, "Opsi D wajib diisi"),
  correctAnswer: z.enum(["A", "B", "C", "D"]),
  points: z.coerce.number().min(1).default(10),
  sortOrder: z.coerce.number().min(0).default(0),
});

export type QuizInput = z.infer<typeof quizSchema>;
