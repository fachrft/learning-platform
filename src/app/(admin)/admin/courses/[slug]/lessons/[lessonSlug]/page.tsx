"use client";

import { useEffect, useRef, use } from "react";
import { ArrowLeft, FileText, Video, HelpCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import videojs from "video.js";
import "video.js/dist/video-js.css";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLesson } from "@/hooks/lessons/use-lesson";

interface ViewLessonPageProps {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
}

export default function ViewLessonPage({ params }: ViewLessonPageProps) {
  const { slug, lessonSlug } = use(params);
  const { lesson, isLoading, error } = useLesson(lessonSlug);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (lesson?.type === "video" && videoRef.current) {
      if (!playerRef.current) {
        let srcObj: any = { src: lesson.videoUrl, type: "video/mp4" };

        if (
          lesson.videoUrl &&
          (lesson.videoUrl.includes("youtube.com") ||
            lesson.videoUrl.includes("youtu.be"))
        ) {
          require("videojs-youtube");
          srcObj = { src: lesson.videoUrl, type: "video/youtube" };
        }

        playerRef.current = videojs(videoRef.current, {
          controls: true,
          fluid: true,
          responsive: true,
          sources: [srcObj],
          youtube: {
            ytControls: 0,
            iv_load_policy: 3,
          },
        });
      }
    }

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [lesson?.type, lesson?.videoUrl]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground mt-4">Memuat materi...</p>
      </div>
    );
  }

  if (error || !lesson) {
    return notFound();
  }

  const renderContent = () => {
    switch (lesson.type) {
      case "text":
        return (
          <div className="bg-card border rounded-xl p-6 md:p-10">
            {lesson.content ? (
              <div
                className="ProseMirror prose prose-sm md:prose-base dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-4 opacity-50" />
                <p>Materi teks ini belum memiliki konten.</p>
              </div>
            )}
          </div>
        );
      case "video":
        return (
          <div className="bg-card border rounded-xl p-6 md:p-10">
            {lesson.videoUrl ? (
              <div data-vjs-player>
                <video
                  ref={videoRef}
                  className="video-js vjs-big-play-centered vjs-theme-city rounded-lg overflow-hidden"
                  playsInline
                />
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Video className="h-10 w-10 mx-auto mb-4 opacity-50" />
                <p>Materi video ini belum memiliki url video.</p>
              </div>
            )}
          </div>
        );
      case "quiz":
        return (
          <div className="space-y-6">
            {(lesson as any).quizzes && (lesson as any).quizzes.length > 0 ? (
              (lesson as any).quizzes.map((q: any, index: number) => (
                <div
                  key={q.id}
                  className="bg-card border rounded-xl overflow-hidden shadow-sm"
                >
                  <div className="bg-muted/50 px-6 py-4 border-b flex items-center justify-between">
                    <span className="font-semibold text-sm">
                      Pertanyaan {index + 1}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {q.points} Poin
                    </Badge>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="font-medium text-lg leading-relaxed">
                      {q.question}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { label: "A", text: q.optionA },
                        { label: "B", text: q.optionB },
                        { label: "C", text: q.optionC },
                        { label: "D", text: q.optionD },
                      ].map((opt) => (
                        <div
                          key={opt.label}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                            q.correctAnswer === opt.label
                              ? "bg-green-500/10 border-green-500/30 ring-1 ring-green-500/20"
                              : "bg-background border-border",
                          )}
                        >
                          <Badge
                            variant={
                              q.correctAnswer === opt.label
                                ? "default"
                                : "outline"
                            }
                            className={cn(
                              "h-7 w-7 rounded-full flex items-center justify-center p-0 shrink-0",
                              q.correctAnswer === opt.label
                                ? "bg-green-600 hover:bg-green-600"
                                : "",
                            )}
                          >
                            {opt.label}
                          </Badge>
                          <span
                            className={cn(
                              "text-sm font-medium",
                              q.correctAnswer === opt.label
                                ? "text-green-700 dark:text-green-400"
                                : "text-muted-foreground",
                            )}
                          >
                            {opt.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-card border rounded-xl p-10 text-center py-20">
                <div className="p-4 rounded-full bg-yellow-500/10 inline-flex mb-4">
                  <HelpCircle className="h-12 w-12 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Belum Ada Soal</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Materi kuis ini belum memiliki daftar pertanyaan. Silakan
                  tambah soal melalui halaman edit.
                </p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const getTypeLabel = () => {
    switch (lesson.type) {
      case "video":
        return "Video";
      case "text":
        return "Teks";
      case "quiz":
        return "Kuis";
      default:
        return "Materi";
    }
  };

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild className="h-9 w-9">
              <Link href={`/admin/courses/${slug}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="secondary"
                  className="text-[10px] px-2 py-0 h-5"
                >
                  {getTypeLabel()}
                </Badge>
                {lesson.sortOrder !== undefined && (
                  <span className="text-xs text-muted-foreground font-medium">
                    Urutan: {lesson.sortOrder}
                  </span>
                )}
              </div>
              <h1 className="text-lg md:text-xl font-bold leading-tight">
                {lesson.title}
              </h1>
            </div>
          </div>

          <Button variant="default" size="sm" asChild>
            <Link href={`/admin/courses/${slug}/lessons/${lesson.slug}/edit`}>
              Edit Materi
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {lesson.description && (
          <div className="bg-muted/30 p-4 rounded-lg border text-sm text-foreground/80 leading-relaxed">
            {lesson.description}
          </div>
        )}

        {renderContent()}
      </div>
    </div>
  );
}
