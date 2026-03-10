import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FaqSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Pertanyaan Populer (FAQ)
          </h2>
          <p className="text-muted-foreground text-lg">
            Temukan jawaban atas beberapa pertanyaan yang paling sering
            ditanyakan pelajar kami.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem
            value="item-1"
            className="border border-border/50 rounded-lg px-6 bg-card data-[state=open]:shadow-md transition-all duration-300"
          >
            <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline hover:text-primary transition-colors py-6">
              Apakah materi bisa diakses selamanya?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-6 pt-2">
              Tergantung paket yang Anda pilih. Untuk pengguna Basic dan Pro,
              akses materi tergantung dari masa berlangganan. Khusus untuk
              pembeli paket Lifetime, semua kelas yang ada saat ini beserta
              update-nya di masa depan dapat diakses selamanya tanpa ada biaya
              berlangganan tambahan.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="border border-border/50 rounded-lg px-6 bg-card data-[state=open]:shadow-md transition-all duration-300"
          >
            <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline hover:text-primary transition-colors py-6">
              Saya masih pemula, apakah cocok untuk saya ikuti?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-6 pt-2">
              Sangat cocok! Lumina dirancang untuk menyesuaikan perjalanan
              karirmu. Kami memiliki Learning Path khusus (Jalur Belajar) yang
              dimulai dari &quot;0&quot; hingga level profesional. Tidak perlu
              pengetahuan dasar sebelumnya—panduan langkah demi langkah kami
              akan memandu Anda.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="border border-border/50 rounded-lg px-6 bg-card data-[state=open]:shadow-md transition-all duration-300"
          >
            <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline hover:text-primary transition-colors py-6">
              Apakah mendapatkan sertifikat digital?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-6 pt-2">
              Tentu saja. Setelah Anda lulus mengejakan kuis dan mengumpulkan
              portofolio proyek dari materi pembelajaran, Anda akan menerima
              Sertifikat Keahlian (Certificate of Completion) resmi dari Lumina.
              Sertifikat ini dapat dilampirkan langsung di kolom sertifikat
              platform LinkedIn Anda.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-4"
            className="border border-border/50 rounded-lg px-6 bg-card data-[state=open]:shadow-md transition-all duration-300"
          >
            <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline hover:text-primary transition-colors py-6">
              Adakah wadah komunitas untuk bertukar wawasan?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-6 pt-2">
              Ada! Seluruh pengguna terdaftar (termasuk paket gratis) punya hak
              masuk dan mengakses ruang khusus untuk berkomunitas, bertukar
              pengetahuan, membagikan portfolio, dan saling sapa dengan ribuan
              praktisi lainnya. Kami menyebut wadah diskusi ini &quot;Lumina
              Hub&quot;.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Punya pertanyaan lain? Hubungi tim support kami.
          </p>
          <Button
            variant="outline"
            className="rounded-full group transition-all duration-300 p-6"
          >
            Hubungi Support Kami{" "}
            <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
