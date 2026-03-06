"use client";

import { useState } from "react";
import { DUMMY_COURSES } from "@/components/admin/courses/dummy-data";
import { CoursesHeader } from "@/components/admin/courses/courses-header";
import { CoursesStats } from "@/components/admin/courses/courses-stats";
import { CoursesFilters } from "@/components/admin/courses/courses-filters";
import { CoursesGrid } from "@/components/admin/courses/courses-grid";

export default function AdminCoursesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeStatus, setActiveStatus] = useState("Semua");

  // ── Derived state ──────────────────────────────────────────────────────────
  const filteredCourses = DUMMY_COURSES.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      activeCategory === "Semua" || c.category === activeCategory;
    const matchStatus = activeStatus === "Semua" || c.status === activeStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  const totalPublished = DUMMY_COURSES.filter(
    (c) => c.status === "published",
  ).length;
  const totalStudents = DUMMY_COURSES.reduce((acc, c) => acc + c.students, 0);

  const handleResetFilters = () => {
    setSearch("");
    setActiveCategory("Semua");
    setActiveStatus("Semua");
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      <CoursesHeader />

      <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-5">
        <CoursesStats
          totalCourses={DUMMY_COURSES.length}
          totalPublished={totalPublished}
          totalStudents={totalStudents}
        />

        <CoursesFilters
          search={search}
          onSearchChange={setSearch}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <CoursesGrid
          courses={filteredCourses}
          onResetFilters={handleResetFilters}
        />
      </div>
    </div>
  );
}
