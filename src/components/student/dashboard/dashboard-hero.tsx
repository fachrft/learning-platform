import { BookOpen, CheckCircle, FileText, Star } from "lucide-react";

interface DashboardHeroProps {
  firstName: string;
  subscription: string;
  totalCourses: number;
  totalLessons: number;
  completedCourses: number;
  freeCourses: number;
}

export function DashboardHero({
  firstName,
  subscription,
  totalCourses,
  totalLessons,
  completedCourses,
  freeCourses,
}: DashboardHeroProps) {
  return (
    <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 md:p-10 relative overflow-hidden group shadow-sm">
      {/* Subtle Background Glow */}
      <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700 pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl transition-all duration-700 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest content-start">
                Hari ini mau belajar apa?
              </p>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-tighter shadow-xs ${
                  subscription === "premium"
                    ? "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                    : "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                }`}
              >
                {subscription}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Selamat Datang, <span className="text-primary">{firstName}!</span>
              <span className="ml-1 animate-pulse inline-block">👋</span>
            </h1>
            <p className="text-base text-muted-foreground pt-1 leading-relaxed">
              Ada{" "}
              <strong className="text-foreground font-semibold">
                {totalCourses}
              </strong>{" "}
              kursus sama{" "}
              <strong className="text-foreground font-semibold">
                {totalLessons}
              </strong>{" "}
              materi yang nungguin lo. Yuk, gas mulai sekarang!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 w-full md:w-auto shrink-0">
          {[
            { label: "Kursus", value: totalCourses, icon: BookOpen },
            {
              label: "Selesai",
              value: completedCourses,
              icon: CheckCircle,
            },
            { label: "Materi", value: totalLessons, icon: FileText },
            {
              label: "Gratisan",
              value: freeCourses,
              icon: Star,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 sm:gap-3.5 bg-muted/40 backdrop-blur-md rounded-2xl p-3 sm:px-4 sm:py-3.5 border border-border/30 transition-all hover:bg-muted/80 hover:border-border/50 hover:shadow-sm"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-background shadow-xs border border-border/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 sm:w-5 sm:h-5 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold text-foreground leading-none">
                  {value}
                </span>
                <span className="text-[11px] md:text-xs text-muted-foreground font-medium mt-1">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
