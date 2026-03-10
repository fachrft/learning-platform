"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Star, CheckCircle } from "lucide-react";
import { submitCourseReviewAction } from "@/actions/courses/student";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { CourseReview } from "@/types/course";

interface courseFinishedProps {
  courseSlug: string;
  courseId: string;
  courseTitle: string;
  existingReview: CourseReview | null;
}

export function CourseFinishedClient({
  courseId,
  courseTitle,
  existingReview,
}: courseFinishedProps) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Tolong isi rating bintang dulu ya!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitCourseReviewAction(courseId, rating, comment);
      if (res.success) {
        toast.success("Terima kasih atas ulasan kamu!");
        router.push("/dashboard"); // ke dashboard khusus course
      } else {
        toast.error(res.error || "Gagal mengirim ulasan.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Terjadi kesalahan sistem.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto p-4 md:p-8 space-y-8 flex flex-col justify-center min-h-[80vh]">
      <div className="text-center space-y-4">
        <div className="mx-auto w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Selamat! Lulus!</h1>
        <p className="text-muted-foreground">
          Kamu telah menyelesaikan materi kursus{" "}
          <span className="font-semibold text-foreground">{courseTitle}</span>.
          Semoga ilmu yang didapatkan bermanfaat!
        </p>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Beri Ulasan Kursus</h2>
          <p className="text-sm text-muted-foreground">
            Bantu murid lain dengan memberikan pengalaman kamu mengenai materi
            ini.
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-10 h-10 transition-colors ${
                  star <= rating
                    ? "fill-yellow-400 text-yellow-500"
                    : "text-muted-foreground/30 fill-transparent"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Beri Komentar (Opsional)
          </label>
          <Textarea
            placeholder="Ketik komentar pengalaman kamu belajar kursus ini..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="rounded-xl min-h-[120px] resize-none focus-visible:ring-primary/50"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1 rounded-xl font-semibold"
            onClick={() => router.push("/dashboard/courses")}
            disabled={isSubmitting}
          >
            Lewati & Ke Dashboard
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="flex-1 rounded-xl shadow-md shadow-primary/30 font-semibold"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Kirim Ulasan
          </Button>
        </div>
      </div>
    </div>
  );
}
