import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CheckCircle2, ArrowUpRight } from "lucide-react";

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Investasi Terbaik untuk Karirmu
          </h2>
          <p className="text-lg text-muted-foreground">
            Pilih paket belajar yang sesuai dengan kebutuhan dan rasakan
            perubahan karir dalam 3 bulan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
            <CardHeader className="text-center pb-8 border-b border-border/50">
              <CardTitle className="text-xl font-bold mb-2">Basic</CardTitle>
              <CardDescription>Coba pengalaman belajar gratis</CardDescription>
              <div className="mt-6 flex items-baseline justify-center gap-x-2">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  Rp 0
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-4">
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-muted-foreground" />{" "}
                  Akses materi kelas gratis
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-muted-foreground" />{" "}
                  Forum diskusi publik
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-muted-foreground" />{" "}
                  Update materi berkala
                </li>
              </ul>
            </CardContent>
            <CardFooter className="mt-4 pb-8">
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl group transition-all font-semibold"
              >
                Daftar Gratis{" "}
                <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan - Highlighted */}
          <Card className="hover:shadow-2xl shadow-xl transition-all duration-500 hover:-translate-y-2 border-primary ring-2 ring-primary/20 bg-card relative overflow-hidden">
            <div className="absolute top-0 right-0 py-1 px-8 bg-primary text-primary-foreground text-xs font-bold transform rotate-45 translate-x-8 translate-y-4">
              POPULER
            </div>
            <CardHeader className="text-center pb-8 border-b border-border/50">
              <CardTitle className="text-xl font-bold mb-2 text-primary">
                Pro
              </CardTitle>
              <CardDescription>
                Akses penuh semua materi premium
              </CardDescription>
              <div className="mt-6 flex items-baseline justify-center gap-x-2">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  Rp 199rb
                </span>
                <span className="text-muted-foreground font-medium">/bln</span>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-4">
              <ul className="space-y-3 text-sm text-foreground font-medium">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Bebas akses
                  ke semua Kelas Premium
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Sertifikat
                  Kelulusan Terverifikasi
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> 5+
                  Real-world Project Portfolio
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Sesi Live
                  Mentoring Bulanan
                </li>
              </ul>
            </CardContent>
            <CardFooter className="mt-4 pb-8">
              <Button className="w-full h-12 rounded-xl group transition-all shadow-md shadow-primary/20 hover:shadow-lg font-semibold hover:-translate-y-0.5">
                Mulai Langganan{" "}
                <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </CardFooter>
          </Card>

          {/* Lifetime Plan */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
            <CardHeader className="text-center pb-8 border-b border-border/50">
              <CardTitle className="text-xl font-bold mb-2">Lifetime</CardTitle>
              <CardDescription>
                Bayar sekali, kuasai keahlian selamanya
              </CardDescription>
              <div className="mt-6 flex items-baseline justify-center gap-x-2">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  Rp 1.5jt
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-4">
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success" /> Segala
                  Manfaat Paket Pro
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success" /> Akses
                  Selamanya (Seumur Hidup)
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success" /> Unduh Materi
                  untuk Offline
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success" /> VIP 1-on-1
                  Portfolio Review
                </li>
              </ul>
            </CardContent>
            <CardFooter className="mt-4 pb-8">
              <Button
                variant="secondary"
                className="w-full h-12 rounded-xl group transition-all font-semibold"
              >
                Dapatkan Lifetime{" "}
                <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
