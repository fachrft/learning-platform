import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, BookOpen, Star, Lock, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const courses = [
  {
    title: "Master Full-Stack dengan Next.js",
    category: "Web Dev",
    rating: 4.9,
    reviews: "2.1k",
    lessons: 24,
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
    type: "subscription" as const,
    color: "from-indigo-500/20 to-violet-500/10",
  },
  {
    title: "Python untuk Machine Learning & Data Science",
    category: "Data Science",
    rating: 4.8,
    reviews: "1.4k",
    lessons: 42,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    type: "subscription" as const,
    color: "from-blue-500/20 to-cyan-500/10",
  },
  {
    title: "Panduan Desain Figma ke Code",
    category: "UI/UX Design",
    rating: 5.0,
    reviews: "3.8k",
    lessons: 18,
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
    type: "free" as const,
    color: "from-emerald-500/20 to-teal-500/10",
  },
  {
    title: "Dasar-Dasar Cloud & DevOps Modern",
    category: "Cloud",
    rating: 4.7,
    reviews: "980",
    lessons: 32,
    image:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=2070&auto=format&fit=crop",
    type: "free" as const,
    color: "from-sky-500/20 to-blue-500/10",
  },
  {
    title: "iOS Development dengan Swift",
    category: "Mobile Dev",
    rating: 4.8,
    reviews: "1.2k",
    lessons: 37,
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop",
    type: "subscription" as const,
    color: "from-pink-500/20 to-rose-500/10",
  },
  {
    title: "Cyber Security untuk Pemula",
    category: "Security",
    rating: 4.9,
    reviews: "760",
    lessons: 28,
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    type: "free" as const,
    color: "from-amber-500/20 to-orange-500/10",
  },
];

export function FeaturedCourses() {
  return (
    <section id="courses" className="py-24 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.05),transparent)]" />

      <div className="container mx-auto px-4 sm:px-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              Kelas Terpilih
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Belajar dari yang Terbaik
            </h2>
            <p className="text-muted-foreground max-w-md">
              Pilih kelas sesuai kebutuhanmu—ada yang gratis maupun premium.
              Dipandu instruktur berpengalaman.
            </p>
          </div>
          <Button
            variant="ghost"
            className="hidden md:flex group px-5 h-10 rounded-full border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all"
          >
            Lihat Semua Kelas{" "}
            <ArrowUpRight className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <Link
              href="/login"
              key={idx}
              className="group relative flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 cursor-pointer"
            >
              {/* Gradient tint overlay */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${course.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10`}
              />

              {/* Thumbnail */}
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                  <Badge className="bg-black/50 text-white border-none backdrop-blur-md text-[11px] font-medium py-0.5">
                    {course.category}
                  </Badge>
                  {course.type === "free" ? (
                    <Badge className="bg-emerald-500 text-white border-none shadow-md text-[11px] font-bold py-0.5">
                      ✦ Gratis
                    </Badge>
                  ) : (
                    <Badge className="bg-primary text-primary-foreground border-none shadow-md text-[11px] font-bold py-0.5 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Premium
                    </Badge>
                  )}
                </div>

                {/* Rating pinned to bottom of image */}
                <div className="absolute bottom-2.5 left-3 flex items-center gap-1 z-10">
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-warning text-warning" />
                    {course.rating}
                    <span className="font-normal opacity-70">
                      ({course.reviews})
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-4 gap-3 relative z-20">
                <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
                  {course.title}
                </h3>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <BookOpen className="w-3.5 h-3.5" />
                    {course.lessons} Video
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-200">
                    {course.type === "free" ? "Mulai Gratis" : "Ikuti Kelas"}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Button variant="outline" className="w-full rounded-full group">
            Lihat Semua Kelas
            <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
