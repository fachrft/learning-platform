import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

      {/* Abstract circles for decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 sm:px-8 relative z-10 text-center space-y-8 max-w-3xl">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
          Siap Meningkatkan Kariermu?
        </h2>
        <p className="text-primary-foreground/90 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          Jangan tunda lagi. Bergabunglah dengan Lumina hari ini dan dapatkan
          akses ke berbagai materi kelas eksklusif yang dibimbing instruktur
          kelas dunia.
        </p>
        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            variant="secondary"
            className="h-14 px-10 text-lg font-bold text-primary rounded-full hover:scale-105 transition-all shadow-2xl hover:shadow-white/20 hover:-translate-y-1"
          >
            Mulai Belajar—Gratis!
          </Button>
        </div>
      </div>
    </section>
  );
}
