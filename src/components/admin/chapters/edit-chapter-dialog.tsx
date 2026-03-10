"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useEditChapterForm } from "@/hooks/chapters/use-edit-chapter-form";

import { Chapter } from "@/types/course";

interface EditChapterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapter: Chapter | null;
}

export function EditChapterDialog({
  open,
  onOpenChange,
  chapter,
}: EditChapterDialogProps) {
  const { form, onSubmit, isPending } = useEditChapterForm(
    () => onOpenChange(false),
    {
      courseId: chapter?.courseId || "",
      title: chapter?.title || "",
      description: chapter?.description || undefined,
      sortOrder: chapter?.sortOrder || 0,
    },
  );

  useEffect(() => {
    if (open && chapter) {
      form.reset({
        courseId: chapter.courseId,
        title: chapter.title,
        description: chapter.description || "",
        sortOrder: chapter.sortOrder || 0,
      });
    }
  }, [open, chapter, form]);

  if (!chapter) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Bab</DialogTitle>
          <DialogDescription>
            Ubah detail bab kursus. Klik simpan saat selesai.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit(chapter.id))}
            className="space-y-4 overflow-y-auto max-h-[75vh] p-1 scrollbar-hide"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Bab</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Pengenalan Next.js"
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
                  <FormLabel>Deskripsi (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Jelaskan secara singkat materi dalam bab ini..."
                      className="resize-none"
                      rows={3}
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
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
