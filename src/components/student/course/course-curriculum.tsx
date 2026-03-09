"use client";

import { PlayCircle, HelpCircle, FileText } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Lesson, Chapter } from "./types";

interface CourseCurriculumProps {
  chapters: Chapter[];
}

const lessonTypeIcon = (type: Lesson["type"]) => {
  if (type === "video")
    return <PlayCircle className="w-3.5 h-3.5 text-primary/70" />;
  if (type === "quiz")
    return <HelpCircle className="w-3.5 h-3.5 text-amber-500/70" />;
  return <FileText className="w-3.5 h-3.5 text-muted-foreground/70" />;
};

export function CourseCurriculum({ chapters }: CourseCurriculumProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-lg font-bold text-foreground mb-6">
        Kurikulum Course
      </h2>

      {chapters.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          Belum ada chapter yang tersedia.
        </div>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={[chapters[0]?.id]}
          className="space-y-3"
        >
          {chapters.map((chapter, idx) => (
            <AccordionItem
              key={chapter.id}
              value={chapter.id}
              className="border border-border rounded-xl overflow-hidden bg-card px-0"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3 text-left">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {chapter.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {chapter.lessons.length} lesson
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-5 pb-4 pt-0">
                {chapter.lessons.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-3">
                    Belum ada lesson di chapter ini.
                  </p>
                ) : (
                  <ul className="space-y-1 mt-2">
                    {chapter.lessons.map((lesson) => (
                      <li key={lesson.id}>
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                          {lessonTypeIcon(lesson.type)}
                          <span className="text-sm text-foreground flex-1">
                            {lesson.title}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
