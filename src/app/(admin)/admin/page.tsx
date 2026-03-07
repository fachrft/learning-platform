import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Users, BookOpen, CreditCard, TrendingUp, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const stats = [
  {
    label: "Total Siswa",
    value: "1,284",
    change: "+12% bulan ini",
    positive: true,
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Total Kursus",
    value: "48",
    change: "+3 kursus baru",
    positive: true,
    icon: BookOpen,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    label: "Subscriber Aktif",
    value: "392",
    change: "+8% bulan ini",
    positive: true,
    icon: CreditCard,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Pendapatan Bulan Ini",
    value: "Rp 14,2jt",
    change: "+23% dari bulan lalu",
    positive: true,
    icon: TrendingUp,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const recentStudents = [
  {
    name: "Andi Pratama",
    email: "andi@email.com",
    course: "React Fundamentals",
    date: "2 jam lalu",
  },
  {
    name: "Siti Rahma",
    email: "siti@email.com",
    course: "UI/UX Design",
    date: "5 jam lalu",
  },
  {
    name: "Budi Santoso",
    email: "budi@email.com",
    course: "Node.js Advanced",
    date: "1 hari lalu",
  },
  {
    name: "Dewi Lestari",
    email: "dewi@email.com",
    course: "React Fundamentals",
    date: "1 hari lalu",
  },
  {
    name: "Rizky Hakim",
    email: "rizky@email.com",
    course: "Python Dasar",
    date: "2 hari lalu",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <header className="flex items-center gap-3 border-b border-border/50 bg-background/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-10">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-5" />
        <div className="flex-1">
          <h1 className="text-lg font-bold">Dashboard</h1>
          <p className="text-xs text-muted-foreground">
            Selamat datang kembali, Admin.
          </p>
        </div>
        <ThemeToggle />
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
                <div className={`rounded-xl p-2 ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p
                className={`text-xs mt-1 ${stat.positive ? "text-emerald-500" : "text-destructive"}`}
              >
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Enrollments */}
        <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
            <div>
              <h2 className="font-semibold text-sm">Siswa Terbaru</h2>
              <p className="text-xs text-muted-foreground">
                Pendaftaran 7 hari terakhir
              </p>
            </div>
            <button className="text-xs text-primary hover:underline underline-offset-4">
              Lihat Semua
            </button>
          </div>
          <div className="divide-y divide-border/50">
            {recentStudents.map((s) => (
              <div
                key={s.email}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/40 transition-colors"
              >
                {/* Avatar */}
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">
                    {s.name.charAt(0)}
                  </span>
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {s.email}
                  </p>
                </div>
                {/* Course badge */}
                <span className="hidden sm:inline-flex text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                  {s.course}
                </span>
                {/* Time */}
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {s.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
