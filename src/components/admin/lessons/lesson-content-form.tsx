"use client";

import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { LessonInput } from "@/schemas/course.schema";
import { LessonQuizForm } from "./lesson-quiz-form";

// Lazy load TipTap editor
const RichTextEditor = dynamic(
  () =>
    import("@/components/ui/rich-text-editor").then(
      (mod) => mod.RichTextEditor,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 border rounded-lg bg-muted/30 animate-pulse" />
    ),
  },
);

const TYPE_LABELS: Record<string, string> = {
  text: "Teks / Artikel",
  video: "Video",
  quiz: "Kuis",
};

interface LessonContentFormProps {
  form: UseFormReturn<LessonInput>;
  selectedType: string;
}

export function LessonContentForm({
  form,
  selectedType,
}: LessonContentFormProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          3. Konten Materi
        </h2>
        <Badge variant="outline" className="text-xs capitalize">
          {TYPE_LABELS[selectedType] || selectedType}
        </Badge>
      </div>

      <div className="bg-card border rounded-xl p-5">
        {selectedType === "text" && (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Isi Materi</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Tulis materi kursus di sini. Gunakan toolbar untuk memformat teks..."
                  />
                </FormControl>
                <FormDescription>
                  Gunakan toolbar di atas untuk format teks (bold, italic,
                  heading, list, dll).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedType === "video" && (
          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link Video</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Masukkan URL video dari YouTube, Vimeo, atau platform lainnya.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedType === "quiz" && <LessonQuizForm form={form} />}
      </div>
    </section>
  );
}
