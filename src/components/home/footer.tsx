import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/40 py-10 mt-auto">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 group cursor-pointer">
            <Logo className="w-12 h-12 group-hover:scale-110 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-lg tracking-tight">
                Lumina LMS
              </span>
              <span className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Solusi Edukasi Pintar
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Syarat & Ketentuan
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Kebijakan Privasi
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Pusat Bantuan
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Kontak
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
