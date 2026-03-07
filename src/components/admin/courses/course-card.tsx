"use client";

import Image from "next/image";
import {
  BookOpen,
  Clock,
  Eye,
  Lock,
  Pencil,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { Course, STATUS_CONFIG } from "./types";

interface CourseCardProps {
  course: Course;
  onView?: (course: Course) => void;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

export function CourseCard({
  course,
  onView,
  onEdit,
  onDelete,
}: CourseCardProps) {
  const status = STATUS_CONFIG[course.status];

  return (
    <div className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      {/* ── Thumbnail ── */}
      <div className="relative aspect-video w-full bg-muted overflow-hidden">
        {course.thumbnail ? (
          <>
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
          </>
        ) : (
          /* Fallback gradient */
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20" />
        )}

        {/* Status badge — top right */}
        <span
          className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${status.className}`}
        >
          {status.label}
        </span>

        {/* Free / Premium badge — bottom left */}
        {course.isFree ? (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-sm">
            ✦ Gratis
          </span>
        ) : (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground shadow-sm">
            <Lock className="h-2.5 w-2.5" />
            Premium
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="p-4">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {course.students.toLocaleString("id-ID")}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {course.lessons} lessons
          </span>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-4 pb-4 flex items-center justify-between gap-2 border-t border-border/40 pt-3">
        {/* Rating */}
        <div className="flex items-center gap-1">
          {course.rating > 0 ? (
            <>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold">{course.rating}</span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground italic">
              Belum ada rating
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onView?.(course)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Lihat kursus"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onEdit?.(course)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Edit kursus"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete?.(course)}
            className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
            title="Hapus kursus"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Updated at — below footer */}
      <p className="px-4 pb-3 text-[11px] text-muted-foreground -mt-1">
        Diupdate {course.updatedAt}
      </p>
    </div>
  );
}
