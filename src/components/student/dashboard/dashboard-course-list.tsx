"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CourseCard } from "./course-card";
import { Course } from "@/types/course";

type FilterType = "all" | "free" | "premium";

interface DashboardCourseListProps {
  courses: Course[];
}

export function DashboardCourseList({ courses }: DashboardCourseListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "free" && course.isFree) ||
        (activeFilter === "premium" && !course.isFree);

      return matchesSearch && matchesFilter;
    });
  }, [courses, searchQuery, activeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end gap-6">
        <div className="space-y-1 w-full md:w-48 shrink-0">
          <h2 className="text-xl font-bold text-foreground">Semua Kursus</h2>
          <p className="text-sm text-muted-foreground">
            {filteredCourses.length !== courses.length
              ? `Menampilkan ${filteredCourses.length} dari ${courses.length}`
              : `${courses.length} kursus tersedia`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          {/* Search Input */}
          <div className="relative group w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary z-10" />
            <Input
              placeholder="Cari kursus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-card border-border/60 hover:border-primary/30 focus-visible:ring-primary/20 transition-all shadow-xs w-full"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex bg-muted/40 p-1 rounded-xl border border-border/40 h-11 w-full sm:w-auto shrink-0">
            {[
              { label: "Semua", value: "all" },
              { label: "Gratis", value: "free" },
              { label: "Premium", value: "premium" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value as FilterType)}
                className={cn(
                  "flex-1 sm:flex-none flex items-center justify-center px-4 sm:px-6 h-full rounded-lg text-xs font-bold transition-all duration-300",
                  activeFilter === filter.value
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border-2 border-dashed border-border bg-muted/20 text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground/30" />
          </div>
          <div className="space-y-1 max-w-xs mx-auto">
            <p className="text-base font-bold text-foreground">
              Kursus tidak ditemukan
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Kami tidak menemukan kursus dengan kata kunci atau filter yang
              kamu pilih.
            </p>
          </div>
          {searchQuery || activeFilter !== "all" ? (
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="text-primary font-bold text-sm hover:underline underline-offset-4"
            >
              Reset Filter & Pencarian
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
