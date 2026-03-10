"use client";

import { Star, User } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CourseReview } from "@/types/course";

interface CourseReviewListProps {
  reviews: CourseReview[];
}

export function CourseReviewList({ reviews }: CourseReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center border-t border-border">
        <h2 className="text-xl font-bold mb-2">Ulasan Murid</h2>
        <p className="text-muted-foreground">
          Belum ada ulasan untuk kursus ini.
        </p>
      </div>
    );
  }

  const averageRating = (
    reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 border-t border-border space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Ulasan Murid</h2>
          <p className="text-muted-foreground text-sm">
            Apa kata mereka yang sudah belajar di kursus ini.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-primary/5 px-6 py-4 rounded-2xl border border-primary/10">
          <div className="text-4xl font-bold text-primary">{averageRating}</div>
          <div className="flex flex-col">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(Number(averageRating))
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              Dari {reviews.length} ulasan
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-card border rounded-2xl p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    {review.user?.name || "Anonim"}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {review.createdAt
                      ? format(new Date(review.createdAt), "dd MMMM yyyy", {
                          locale: id,
                        })
                      : "-"}
                  </div>
                </div>
              </div>

              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= review.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            {review.comment && (
              <p className="text-sm text-foreground/80 leading-relaxed italic">
                &quot;{review.comment}&quot;
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
