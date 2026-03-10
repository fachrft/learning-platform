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
import { deleteChapterAction } from "@/actions/chapters";
import { Chapter } from "@/types/course";

interface DeleteChapterAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapter: Chapter | null;
  onSuccess: () => void;
}

export function DeleteChapterAlert({
  open,
  onOpenChange,
  chapter,
  onSuccess,
}: DeleteChapterAlertProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!chapter) return;

    const toastId = toast.loading("Menghapus bab...");
    startTransition(async () => {
      try {
        const result = await deleteChapterAction(chapter.id);
        if (result?.success) {
          toast.success("Bab berhasil dihapus!", { id: toastId });
          onSuccess();
          onOpenChange(false);
        } else {
          toast.error(result?.error || "Gagal menghapus bab.", { id: toastId });
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Terjadi kesalahan sistem.",
          { id: toastId },
        );
      }
    });
  };

  if (!chapter) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Bab?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus bab{" "}
            <strong>{chapter.title}</strong>? TINDAKAN INI TIDAK DAPAT
            DIBATALKAN, dan akan menghapus semua materi (lesson) di dalamnya
            secara permanen.
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
