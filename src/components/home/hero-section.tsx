import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <>
      <section className="relative overflow-hidden bg-background pt-8 pb-16">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -z-10 mask-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <Badge
              variant="secondary"
              className="px-3 py-1 text-sm font-medium text-primary bg-primary/10 border-none hover:bg-primary/20 transition-colors"
            >
              v2.0 Telah Hadir! 🚀
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground">
              Kuasai Keahlian Baru Bersama{" "}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-indigo-400 inline-block hover:scale-[1.02] transition-transform cursor-default">
                Lumina
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] leading-relaxed mx-auto sm:mx-0">
              Platform belajar masa depan yang dirancang khusus untuk
              mempercepat penguasaan keahlianmu. Bergabunglah dengan puluhan
              ribu kreator, developer, dan profesional hebat lainnya.
            </p>
            <Button
              size="icon-lg"
              className="rounded-full w-full shadow-lg shadow-primary/25 h-12 px-8 group font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
              asChild
            >
              <Link href="/register" className="flex items-center">
                Daftar Sekarang
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>

            <div className="flex items-center gap-4 pt-4 justify-center sm:justify-start text-sm text-muted-foreground">
              <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden hover:z-10 hover:scale-110 transition-transform"
                  >
                    <Image
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="avatar"
                      width={32}
                      height={32}
                    />
                  </div>
                ))}
              </div>
              <p>
                Dipercaya oleh{" "}
                <strong className="text-foreground">10.000+</strong> pelajar
              </p>
            </div>
          </div>
          <div className="flex-1 relative hidden lg:block group">
            {/* Mascot Graphic */}
            <div className="relative w-full aspect-square max-w-[500px] mx-auto transition-transform duration-700 ease-out group-hover:scale-[1.05] drop-shadow-2xl">
              <div className="absolute inset-0 bg-linear-to-tr from-primary/30 to-emerald-400/30 rounded-full blur-3xl opacity-50 dark:opacity-20 mix-blend-multiply group-hover:rotate-6 transition-all duration-700 ease-out"></div>
              <Image
                src="/assets/lumina-mascot.png"
                alt="Lumina Mascot"
                fill
                className="object-contain relative z-10 animate-[float_6s_ease-in-out_infinite]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Features Banner */}
      <section className="border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-8 py-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/50 text-center">
            <div className="flex flex-col items-center gap-2 pt-4 sm:pt-0 group cursor-default">
              <div className="p-3 bg-primary/10 rounded-full text-primary mb-2 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">300+</h3>
              <p className="text-muted-foreground font-medium">Kelas Premium</p>
            </div>
            <div className="flex flex-col items-center gap-2 pt-4 sm:pt-0 group cursor-default">
              <div className="p-3 bg-success/10 rounded-full text-success mb-2 group-hover:scale-110 group-hover:bg-success/20 transition-all duration-300">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">50.000+</h3>
              <p className="text-muted-foreground font-medium">
                Pelajar Aktif Terdaftar
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 pt-4 sm:pt-0 group cursor-default">
              <div className="p-3 bg-warning/10 rounded-full text-warning mb-2 group-hover:scale-110 group-hover:bg-warning/20 transition-all duration-300">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">98%</h3>
              <p className="text-muted-foreground font-medium">
                Tingkat Kelulusan
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
