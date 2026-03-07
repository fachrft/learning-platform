"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { courseSchema, CourseInput } from "@/schemas/course.schema";
import { useImageKitUpload } from "@/hooks/use-imagekit-upload";

export function useCourseFormBase() {
  const {
    uploadFile,
    isUploading,
    progress,
    error: uploadError,
  } = useImageKitUpload();

  const form = useForm<CourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail: "",
      status: "draft",
      isFree: false,
      sortOrder: 0,
    },
  });

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadFile(file);
        form.setValue("thumbnail", url);
      } catch (err) {
        toast.error("Gagal mengupload thumbnail.");
        console.error("Gagal mengupload thumbnail:", err);
      }
    }
  };

  return {
    form,
    isUploading,
    progress,
    uploadError,
    handleThumbnailChange,
  };
}
