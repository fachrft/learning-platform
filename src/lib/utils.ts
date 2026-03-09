import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
