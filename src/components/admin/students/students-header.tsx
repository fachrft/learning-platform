"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

export function StudentsHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-sm px-4 sm:px-6 py-4 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-5" />
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold truncate">Siswa</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Daftar pengguna dan status langganan
          </p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
