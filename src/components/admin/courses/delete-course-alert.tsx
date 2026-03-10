"use client";

import { useTransition } from "react";
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
import { buttonVariants } from "@/components/ui/button";
import { deleteCourseAction } from "@/actions/courses";
import { Course } from "@/types/course";

interface DeleteCourseAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
  onSuccess: () => void;
}

export function DeleteCourseAlert({
  open,
  onOpenChange,
  course,
  onSuccess,
}: DeleteCourseAlertProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!course) return;

    const toastId = toast.loading("Menghapus kursus...");
    startTransition(async () => {
      try {
        const result = await deleteCourseAction(course.id);
        if (result?.success) {
          toast.success("Kursus berhasil dihapus!", { id: toastId });
          onSuccess();
          onOpenChange(false);
        } else {
          toast.error(result?.error || "Gagal menghapus kursus.", {
            id: toastId,
          });
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Terjadi kesalahan sistem.",
          { id: toastId },
        );
      }
    });
  };

  if (!course) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Kursus?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus kursus{" "}
            <strong>{course.title}</strong>? TINDAKAN INI TIDAK DAPAT
            DIBATALKAN, dan akan menghapus semua data serta gambar terkait
            kursus ini secara permanen dari server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className={buttonVariants({ variant: "destructive" })}
            disabled={isPending}
          >
            {isPending ? "Menghapus..." : "Ya, Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
