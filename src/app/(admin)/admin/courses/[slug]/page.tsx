"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";

import { ChaptersHeader } from "@/components/admin/chapters/chapters-header";
import { ChaptersList } from "@/components/admin/chapters/chapters-list";
import { CreateChapterDialog } from "@/components/admin/chapters/create-chapter-dialog";
import { EditChapterDialog } from "@/components/admin/chapters/edit-chapter-dialog";
import { DeleteChapterAlert } from "@/components/admin/chapters/delete-chapter-alert";
import { DeleteLessonAlert } from "@/components/admin/lessons/delete-lesson-alert";
import { useChapters } from "@/hooks/chapters/use-chapters";

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
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground mt-4">Memuat data...</p>
      </div>
    );
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
        <div className="max-w-3xl mx-auto space-y-4">
          <ChaptersList
            initialChapters={course.chapters}
            courseId={course.id}
            onEditChapter={(chapter: any) => setChapterToEdit(chapter)}
            onDeleteChapter={(chapter: any) => setChapterToDelete(chapter)}
            onDeleteLesson={(lesson: any) => setLessonToDelete(lesson)}
          />
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
