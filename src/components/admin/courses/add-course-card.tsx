import { Plus } from "lucide-react";

interface AddCourseCardProps {
  onClick?: () => void;
}

export function AddCourseCard({ onClick }: AddCourseCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center justify-center gap-3 bg-card border-2 border-dashed border-border/60 rounded-2xl min-h-[280px] hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
    >
      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
        <Plus className="h-6 w-6 text-primary" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
          Tambah Kursus Baru
        </p>
        <p className="text-xs text-muted-foreground/70 mt-0.5">
          Klik untuk membuat kursus
        </p>
      </div>
    </button>
  );
}
