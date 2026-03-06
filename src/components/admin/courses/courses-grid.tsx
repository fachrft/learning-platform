import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Course } from "./types";
import { CourseCard } from "./course-card";
import { AddCourseCard } from "./add-course-card";

interface CoursesGridProps {
  courses: Course[];
  onAddCourse?: () => void;
  onViewCourse?: (course: Course) => void;
  onEditCourse?: (course: Course) => void;
  onDeleteCourse?: (course: Course) => void;
  onResetFilters?: () => void;
}

export function CoursesGrid({
  courses,
  onAddCourse,
  onViewCourse,
  onEditCourse,
  onDeleteCourse,
  onResetFilters,
}: CoursesGridProps) {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Tidak ada kursus</p>
          <p className="text-sm text-muted-foreground mt-1">
            Coba ubah filter atau kata kunci pencarian
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onResetFilters}>
          Reset Filter
        </Button>
      </div>
    );
  }

  return (
    <>
      <p className="text-xs text-muted-foreground">
        Menampilkan{" "}
        <span className="font-semibold text-foreground">{courses.length}</span>{" "}
        kursus
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onView={onViewCourse}
            onEdit={onEditCourse}
            onDelete={onDeleteCourse}
          />
        ))}
        <AddCourseCard onClick={onAddCourse} />
      </div>
    </>
  );
}
