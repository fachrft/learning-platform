import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CoursesHeaderProps {
  onAddCourse?: () => void;
}

export function CoursesHeader({ onAddCourse }: CoursesHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b border-border/50 bg-background/80 backdrop-blur-sm px-4 sm:px-6 py-4 sticky top-0 z-10">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold truncate">Kelola Kursus</h1>
        <p className="text-xs text-muted-foreground hidden sm:block">
          Buat, edit, dan kelola semua kursus
        </p>
      </div>
      <Button size="sm" className="shrink-0 gap-1.5" onClick={onAddCourse}>
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Tambah Kursus</span>
        <span className="sm:hidden">Tambah</span>
      </Button>
    </header>
  );
}
