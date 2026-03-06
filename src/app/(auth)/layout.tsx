import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full gap-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-all group"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              Kembali
            </Link>
          </Button>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">{children}</div>
      </div>
    </div>
  );
}
