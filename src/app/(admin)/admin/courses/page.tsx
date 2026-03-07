"use client";

import { useState } from "react";
import { useCourses } from "@/hooks/courses/use-courses";
import { CoursesHeader } from "@/components/admin/courses/courses-header";
import { CoursesStats } from "@/components/admin/courses/courses-stats";
import { CoursesFilters } from "@/components/admin/courses/courses-filters";
import { CoursesGrid } from "@/components/admin/courses/courses-grid";
import { CreateCourseDialog } from "@/components/admin/courses/create-course-dialog";
import { EditCourseDialog } from "@/components/admin/courses/edit-course-dialog";
import { Course } from "@/components/admin/courses/types";
import { deleteCourseAction } from "@/actions/courses";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminCoursesPage() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("Semua");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const { courses, isLoading, refetch } = useCourses();

  const filteredCourses = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeStatus === "Semua" || c.status === activeStatus;
    return matchSearch && matchStatus;
  });

  const totalPublished = courses.filter((c) => c.status === "published").length;
  const totalStudents = courses.reduce((acc, c) => acc + c.students, 0);

  const handleResetFilters = () => {
    setSearch("");
    setActiveStatus("Semua");
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;
    const toastId = toast.loading("Menghapus kursus...");
    try {
      const result = await deleteCourseAction(courseToDelete.id);
      if (result?.success) {
        toast.success("Kursus berhasil dihapus", { id: toastId });
        refetch();
      } else {
        toast.error(result?.error || "Gagal menghapus kursus.", {
          id: toastId,
        });
      }
    } catch (err) {
      toast.error("Terjadi kesalahan.", { id: toastId });
    } finally {
      setCourseToDelete(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      <CoursesHeader onAddCourse={() => setIsCreateOpen(true)} />

      <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-5">
        <CoursesStats
          totalCourses={courses.length}
          totalPublished={totalPublished}
          totalStudents={totalStudents}
        />

        <CoursesFilters
          search={search}
          onSearchChange={setSearch}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />

        <CoursesGrid
          courses={filteredCourses}
          isLoading={isLoading}
          onResetFilters={handleResetFilters}
          onAddCourse={() => setIsCreateOpen(true)}
          onEditCourse={handleEditCourse}
          onDeleteCourse={handleDeleteClick}
        />
      </div>

      <CreateCourseDialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) refetch();
        }}
      />
      <EditCourseDialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) {
            setEditingCourse(null);
            refetch();
          }
        }}
        course={editingCourse}
      />

      <AlertDialog
        open={!!courseToDelete}
        onOpenChange={(open) => !open && setCourseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kursus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kursus &quot;
              {courseToDelete?.title}&quot;? Tindakan ini tidak dapat dibatalkan
              dan akan menghapus gambar serta data terkait kursus ini dari
              server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCourse}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
