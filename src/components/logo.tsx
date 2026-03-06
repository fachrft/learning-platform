import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 overflow-hidden",
        className,
      )}
    >
      <Image
        src="/assets/lumina-logo.png"
        alt="Lumina LMS Logo"
        width={200}
        height={200}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
