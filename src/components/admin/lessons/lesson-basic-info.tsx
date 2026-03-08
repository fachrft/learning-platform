"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { LessonInput } from "@/schemas/course.schema";

interface LessonBasicInfoProps {
  form: UseFormReturn<LessonInput>;
}

export function LessonBasicInfo({ form }: LessonBasicInfoProps) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        2. Informasi Dasar
      </h2>
      <div className="space-y-4 bg-card border rounded-xl p-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Materi</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Pengenalan React Hooks"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi Singkat (Opsional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Jelaskan secara singkat isi materi ini..."
                  rows={2}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Urutan</FormLabel>
              <FormControl>
                <Input type="number" className="w-28" {...field} />
              </FormControl>
              <FormDescription>
                Penomoran urutan materi dalam bab.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}
