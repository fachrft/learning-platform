"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { useCreateLesson } from "@/hooks/lessons/use-create-lesson";
import { LessonTypeSelection } from "@/components/admin/lessons/lesson-type-selection";
import { LessonBasicInfo } from "@/components/admin/lessons/lesson-basic-info";
import { LessonContentForm } from "@/components/admin/lessons/lesson-content-form";

interface CreateLessonPageProps {
  params: Promise<{ slug: string }>;
}

export default function CreateLessonPage({ params }: CreateLessonPageProps) {
  const searchParams = useSearchParams();
  const slugChapter = searchParams.get("slug") ?? "";
  const { slug } = use(params);

  const { form, isPending, selectedType, onSubmit } = useCreateLesson({
    courseSlug: slug,
    chapterSlug: slugChapter,
  });

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/admin/courses/${slug}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Tambah Pelajaran Baru</h1>
              <p className="text-xs text-muted-foreground">
                Pilih tipe dan isi konten materi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <LessonTypeSelection form={form} />
            <LessonBasicInfo form={form} />
            <LessonContentForm form={form} selectedType={selectedType} />

            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan Materi"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
