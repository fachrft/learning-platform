import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}
export function getAverageRating(reviews: any[]) {
  if (!reviews || reviews.length === 0) return 0;

  const sum = reviews.reduce((acc, curr) => {
    const val = typeof curr === "number" ? curr : (curr?.rating ?? 0);
    return acc + val;
  }, 0);

  return sum / reviews.length;
}

export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export function formatDateIndo(date: Date | string | null | undefined): string {
  if (!date) return "-";
  return format(new Date(date), "dd MMM yyyy", { locale: id });
}

export function formatTimeAgo(date: Date | string | null | undefined): string {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: id,
  });
}
