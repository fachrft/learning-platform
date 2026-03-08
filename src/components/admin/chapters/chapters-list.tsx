"use client";

import {
  GripVertical,
  Pencil,
  Trash2,
  Plus,
  Eye,
  FileText,
  Video as VideoIcon,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const getLessonTypeIcon = (type: string) => {
  switch (type) {
    case "video":
      return <VideoIcon className="h-3 w-3 mr-1" />;
    case "text":
      return <FileText className="h-3 w-3 mr-1" />;
    case "quiz":
      return <HelpCircle className="h-3 w-3 mr-1" />;
    default:
      return <FileText className="h-3 w-3 mr-1" />;
  }
};

const getLessonTypeLabel = (type: string) => {
  switch (type) {
    case "video":
      return "Video";
    case "text":
      return "Teks";
    case "quiz":
      return "Kuis";
    default:
      return type;
  }
};

export function ChaptersList({
  initialChapters = [],
  courseId,
  onEditChapter,
  onDeleteChapter,
  onDeleteLesson,
}: {
  initialChapters: any[]; // Using any[] temporarily, we can type this better later
  courseId: string;
  onEditChapter?: (chapter: any) => void;
  onDeleteChapter?: (chapter: any) => void;
  onDeleteLesson?: (lesson: any) => void;
}) {
  const params = useParams();

  // If there's no chapters, show empty state
  if (initialChapters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-border rounded-xl">
        <div className="bg-muted p-4 rounded-full mb-4">
          <GripVertical className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Tidak ada bab kursus</h3>
        <p className="text-muted-foreground text-sm max-w-[300px]">
          Mulai tambahkan kurikulum baru untuk kursus ini. Tentukan materi
          pembelajaran dengan jelas.
        </p>
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="space-y-3">
      {initialChapters.map((chapter) => (
        <AccordionItem
          key={chapter.id}
          value={chapter.id}
          className="bg-card border border-border/50 rounded-xl shadow-xs overflow-hidden px-1"
        >
          <div className="flex items-center w-full group">
            <div className="cursor-grab text-muted-foreground hover:text-foreground transition-colors p-3 pl-3">
              <GripVertical className="h-4 w-4" />
            </div>

            <AccordionTrigger className="flex-1 hover:no-underline py-4 px-2">
              <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors text-left flex-1">
                {chapter.title}
              </span>
            </AccordionTrigger>

            <div className="flex items-center gap-1 pr-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary z-10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEditChapter?.(chapter);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive z-10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDeleteChapter?.(chapter);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <AccordionContent className="px-4 pb-4 pt-1 border-t border-border/50 bg-muted/10 mx-2 mt-2">
            {chapter.lessons && chapter.lessons.length > 0 ? (
              <div className="space-y-2 mt-3 flex flex-col">
                {chapter.lessons.map((lesson: any) => (
                  <div
                    key={lesson.id}
                    className="group/lesson p-3 bg-background border rounded-lg text-sm flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <span className="font-medium">{lesson.title}</span>
                      {lesson.type === "video" && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 h-5 bg-red-500/10 text-red-600 border-red-500/20 gap-1 font-medium"
                        >
                          <VideoIcon className="h-3 w-3" />
                          Video
                        </Badge>
                      )}
                      {lesson.type === "text" && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 h-5 bg-blue-500/10 text-blue-600 border-blue-500/20 gap-1 font-medium"
                        >
                          <FileText className="h-3 w-3" />
                          Teks
                        </Badge>
                      )}
                      {lesson.type === "quiz" && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 h-5 bg-yellow-500/10 text-yellow-600 border-yellow-500/20 gap-1 font-medium"
                        >
                          <HelpCircle className="h-3 w-3" />
                          Kuis
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                      {/* TODO: Add real View link later! */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        asChild
                      >
                        <Link
                          href={`/admin/courses/${params.slug}/lessons/${lesson.slug}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        asChild
                      >
                        <Link
                          href={`/admin/courses/${params.slug}/lessons/${lesson.slug}/edit`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDeleteLesson?.(lesson)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 mt-2 self-start"
                  asChild
                >
                  <Link
                    href={`/admin/courses/${params.slug}/lessons/create?slug=${chapter.slug}`}
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Pelajaran
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-background border border-dashed rounded-lg mt-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Belum ada materi pelajaran di bab ini.
                </p>
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <Link
                    href={`/admin/courses/${params.slug}/lessons/create?slug=${chapter.slug}`}
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Pelajaran
                  </Link>
                </Button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
