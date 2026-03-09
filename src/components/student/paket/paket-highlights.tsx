import { MessageCircle } from "lucide-react";
import { HIGHLIGHTS } from "./types";

export function PaketHighlights() {
  return (
    <div className="mt-16 space-y-5">
      {/* Section heading */}
      <div className="text-center">
        <h2 className="text-xl font-black text-foreground">
          Kenapa harus Premium?
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Semua yang kamu butuhkan untuk belajar lebih efektif
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex items-start gap-3.5 bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Reassurance strip */}
      <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-center space-y-1.5">
        <p className="text-sm font-semibold text-foreground">
          Ada pertanyaan? Kami siap membantu.
        </p>
        <p className="text-xs text-muted-foreground">
          Hubungi kami kapan saja. Garansi uang kembali 7 hari tanpa syarat
          untuk semua paket premium.
        </p>
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-1 text-xs font-semibold text-primary hover:underline"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Chat WhatsApp sekarang
        </a>
      </div>
    </div>
  );
}
