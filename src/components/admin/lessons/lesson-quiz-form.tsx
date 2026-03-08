"use client";

import { Trash2, HelpCircle } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { LessonInput } from "@/schemas/course.schema";

interface LessonQuizFormProps {
  form: UseFormReturn<LessonInput>;
}

export function LessonQuizForm({ form }: LessonQuizFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "quizzes",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="text-base font-semibold">Daftar Pertanyaan</h3>
          <p className="text-xs text-muted-foreground">
            Tambahkan soal kuis pilihan ganda di sini.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            append({
              question: "",
              optionA: "",
              optionB: "",
              optionC: "",
              optionD: "",
              correctAnswer: "A",
              points: 10,
              sortOrder: fields.length,
            });
          }}
        >
          Tambah Pertanyaan
        </Button>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="bg-muted/30 p-4 rounded-lg border space-y-4 relative group"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name={`quizzes.${index}.question`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      Pertanyaan {index + 1}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan soal kuis..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(["A", "B", "C", "D"] as const).map((opt) => (
                  <FormField
                    key={opt}
                    control={form.control}
                    name={`quizzes.${index}.option${opt}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              form.watch(`quizzes.${index}.correctAnswer`) ===
                              opt
                                ? "default"
                                : "outline"
                            }
                            className="h-6 w-6 rounded-full flex items-center justify-center p-0 cursor-pointer"
                            onClick={() =>
                              form.setValue(
                                `quizzes.${index}.correctAnswer`,
                                opt,
                              )
                            }
                          >
                            {opt}
                          </Badge>
                          <FormControl>
                            <Input
                              placeholder={`Opsi ${opt}`}
                              className="h-8 text-sm"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t mt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-muted-foreground">
                    Jawaban Benar:
                  </span>
                  <div className="flex gap-2">
                    {(["A", "B", "C", "D"] as const).map((ans) => (
                      <button
                        key={ans}
                        type="button"
                        onClick={() =>
                          form.setValue(`quizzes.${index}.correctAnswer`, ans)
                        }
                        className={cn(
                          "h-6 w-6 rounded text-[10px] font-bold border transition-all",
                          form.watch(`quizzes.${index}.correctAnswer`) === ans
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-background border-border hover:border-primary/50",
                        )}
                      >
                        {ans}
                      </button>
                    ))}
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name={`quizzes.${index}.points`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormLabel className="text-[10px] uppercase tracking-wider text-muted-foreground m-0">
                        Poin:
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="h-7 w-16 text-xs"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed rounded-xl border-muted gap-2">
            <HelpCircle className="h-8 w-8 text-muted-foreground opacity-20" />
            <p className="text-sm text-muted-foreground">
              Belum ada pertanyaan kuis.
            </p>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() =>
                append({
                  question: "",
                  optionA: "",
                  optionB: "",
                  optionC: "",
                  optionD: "",
                  correctAnswer: "A",
                  points: 10,
                  sortOrder: 0,
                })
              }
            >
              Tambah sekarang
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
