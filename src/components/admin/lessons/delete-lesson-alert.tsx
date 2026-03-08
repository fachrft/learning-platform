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
import { deleteLessonAction } from "@/actions/lessons";

interface DeleteLessonAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: any;
  onSuccess: () => void;
}

export function DeleteLessonAlert({
  open,
  onOpenChange,
  lesson,
  onSuccess,
}: DeleteLessonAlertProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!lesson) return;

    const toastId = toast.loading("Menghapus materi...");
    startTransition(async () => {
      try {
        const result = await deleteLessonAction(lesson.id);
        if (result?.success) {
          toast.success("Materi berhasil dihapus!", { id: toastId });
          onSuccess();
          onOpenChange(false);
        } else {
          toast.error(result?.error || "Gagal menghapus materi.", {
            id: toastId,
          });
        }
      } catch (error) {
        toast.error("Terjadi kesalahan sistem.", { id: toastId });
      }
    });
  };

  if (!lesson) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Materi?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus materi{" "}
            <strong>{lesson.title}</strong>? TINDAKAN INI TIDAK DAPAT
            DIBATALKAN.
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
