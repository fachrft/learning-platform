"use client";

import { usePathname } from "next/navigation";

export function StudentLayoutClient({
  children,
  navbar,
}: {
  children: React.ReactNode;
  navbar: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide navbar khusus di halaman lesson player
  const isLessonPage = pathname?.includes("/lesson/");

  if (isLessonPage) {
    return <main className="bg-background">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {navbar}
      <main className="flex-1">{children}</main>
    </div>
  );
}
