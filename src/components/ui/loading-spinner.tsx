import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div
      className={`flex-1 flex items-center justify-center w-full h-full min-h-[400px] ${className || ""}`}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
