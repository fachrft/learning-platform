interface StatItem {
  label: string;
  value: string | number;
  color: string;
  bg: string;
}

interface CoursesStatsProps {
  totalCourses: number;
  totalPublished: number;
  totalStudents: number;
}

export function CoursesStats({
  totalCourses,
  totalPublished,
  totalStudents,
}: CoursesStatsProps) {
  const stats: StatItem[] = [
    {
      label: "Total Kursus",
      value: totalCourses,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      label: "Published",
      value: totalPublished,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Siswa",
      value: totalStudents.toLocaleString("id-ID"),
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`${s.bg} rounded-2xl p-3 sm:p-4 text-center`}
        >
          <p className={`text-xl sm:text-2xl font-bold ${s.color}`}>
            {s.value}
          </p>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}
