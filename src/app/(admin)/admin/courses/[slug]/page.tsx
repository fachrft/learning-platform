"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ChaptersHeader } from "@/components/admin/chapters/chapters-header";
import { ChaptersList } from "@/components/admin/chapters/chapters-list";
import { CreateChapterDialog } from "@/components/admin/chapters/create-chapter-dialog";
import { EditChapterDialog } from "@/components/admin/chapters/edit-chapter-dialog";
import { DeleteChapterAlert } from "@/components/admin/chapters/delete-chapter-alert";
import { DeleteLessonAlert } from "@/components/admin/lessons/delete-lesson-alert";
import { useChapters } from "@/hooks/chapters/use-chapters";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface CourseManagementPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CourseManagementPage({
  params,
}: CourseManagementPageProps) {
  const { slug } = use(params);
  const { course, isLoading, error, refetch } = useChapters(slug);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [chapterToEdit, setChapterToEdit] = useState<any | null>(null);
  const [chapterToDelete, setChapterToDelete] = useState<any | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<any | null>(null);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !course) {
    return notFound();
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ChaptersHeader
        courseTitle={course.title}
        onAddChapter={() => setIsCreateOpen(true)}
      />

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/admin/courses"
            className="group flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Kembali ke Daftar Kursus
          </Link>

          <div className="space-y-4">
            <ChaptersList
              initialChapters={course.chapters}
              courseId={course.id}
              onEditChapter={(chapter: any) => setChapterToEdit(chapter)}
              onDeleteChapter={(chapter: any) => setChapterToDelete(chapter)}
              onDeleteLesson={(lesson: any) => setLessonToDelete(lesson)}
            />
          </div>
        </div>
      </div>

      <CreateChapterDialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) refetch();
        }}
        courseId={course.id}
      />

      <EditChapterDialog
        open={!!chapterToEdit}
        onOpenChange={(open) => {
          if (!open) {
            setChapterToEdit(null);
            refetch();
          }
        }}
        chapter={chapterToEdit}
      />

      <DeleteChapterAlert
        open={!!chapterToDelete}
        onOpenChange={(open) => {
          if (!open) setChapterToDelete(null);
        }}
        chapter={chapterToDelete}
        onSuccess={() => refetch()}
      />

      <DeleteLessonAlert
        open={!!lessonToDelete}
        onOpenChange={(open) => {
          if (!open) setLessonToDelete(null);
        }}
        lesson={lessonToDelete}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
