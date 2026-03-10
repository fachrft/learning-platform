"use client";

import { use } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { useEditLesson } from "@/hooks/lessons/use-edit-lesson";
import { useLesson } from "@/hooks/lessons/use-lesson";
import { LessonTypeSelection } from "@/components/admin/lessons/lesson-type-selection";
import { LessonBasicInfo } from "@/components/admin/lessons/lesson-basic-info";
import { LessonContentForm } from "@/components/admin/lessons/lesson-content-form";
import { useQuizzesByLesson } from "@/hooks/lessons/use-quizzes-by-lesson";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Quiz } from "@/types/course";

interface EditLessonPageProps {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
}

export default function EditLessonPage({ params }: EditLessonPageProps) {
  const { slug, lessonSlug } = use(params);
  const { lesson, isLoading: isFetching, error } = useLesson(lessonSlug);
  const { quizzes } = useQuizzesByLesson(lesson?.id || "");

  const { form, isPending, selectedType, onSubmit } = useEditLesson({
    courseSlug: slug,
    lessonId: lesson?.id || "",
    initialData: lesson || null,
    initialQuizzes: (quizzes as Quiz[]) || [],
  });

  if (isFetching) {
    return <LoadingSpinner />;
  }

  if (error || !lesson) {
    return notFound();
  }

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
              <h1 className="text-lg font-semibold">Edit Pelajaran</h1>
              <p className="text-xs text-muted-foreground">
                Perbarui materi pembelajaran Anda
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
              {isPending ? "Menyimpan..." : "Perbarui Materi"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
