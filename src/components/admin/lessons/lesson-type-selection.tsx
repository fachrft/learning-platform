"use client";

import { FileText, Video, HelpCircle } from "lucide-react";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { LessonInput } from "@/schemas/course.schema";

const LESSON_TYPES = [
  {
    value: "text",
    label: "Teks / Artikel",
    description: "Materi berbasis tulisan dengan format rich text",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/30",
  },
  {
    value: "video",
    label: "Video",
    description: "Materi berupa link video (YouTube, Vimeo, dll.)",
    icon: Video,
    color: "text-red-500",
    bg: "bg-red-500/10 border-red-500/30",
  },
  {
    value: "quiz",
    label: "Kuis",
    description: "Materi berbentuk soal pilihan ganda",
    icon: HelpCircle,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10 border-yellow-500/30",
  },
] as const;

interface LessonTypeSelectionProps {
  form: UseFormReturn<LessonInput>;
}

export function LessonTypeSelection({ form }: LessonTypeSelectionProps) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        1. Pilih Tipe Materi
      </h2>
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {LESSON_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = field.value === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => field.onChange(type.value)}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all",
                      isSelected
                        ? type.bg + " border-current"
                        : "border-border hover:border-muted-foreground/40 bg-card",
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg mt-0.5",
                        isSelected ? "bg-current/10" : "bg-muted",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          isSelected ? type.color : "text-muted-foreground",
                        )}
                      />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "font-semibold text-sm",
                          isSelected ? type.color : "",
                        )}
                      >
                        {type.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  );
}
