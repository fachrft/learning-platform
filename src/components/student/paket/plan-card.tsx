import { Check, Crown, X, Zap } from "lucide-react";
import { Plan, PlanId } from "./types";

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: (id: PlanId) => void;
}

export function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
  const isFree = plan.id === "free";

  return (
    <button
      onClick={() => onSelect(plan.id)}
      className={`relative flex flex-col text-left rounded-2xl p-6 gap-5 border-2 transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
        isSelected
          ? plan.isPrimary
            ? "border-primary shadow-xl shadow-primary/10 scale-[1.02]"
            : "border-primary shadow-lg scale-[1.01]"
          : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
      }`}
    >
      {/* Selected checkmark */}
      {isSelected && (
        <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
          <Check className="w-3 h-3 text-primary-foreground" />
        </span>
      )}

      {/* Badge (e.g. "HEMAT 33%") */}
      {plan.badge && (
        <span
          className={`absolute top-4 ${
            isSelected ? "right-11" : "right-4"
          } flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}
        >
          {plan.badge}
        </span>
      )}

      {/* Icon + Name */}
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isSelected ? "bg-primary/15" : isFree ? "bg-muted" : "bg-primary/10"
          }`}
        >
          {isFree ? (
            <Zap
              className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
            />
          ) : (
            <Crown
              className={`w-5 h-5 ${isSelected ? "text-primary" : "text-primary/60"}`}
            />
          )}
        </div>
        <div>
          <p
            className={`text-base font-black leading-tight ${
              isSelected ? "text-primary" : "text-foreground"
            }`}
          >
            {plan.label}
          </p>
          <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
            {plan.sublabel}
          </p>
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-2xl font-black text-foreground">{plan.price}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{plan.priceNote}</p>
      </div>

      {/* Feature list */}
      <ul className="space-y-2.5 flex-1">
        {plan.features.map((f) => (
          <li key={f.label} className="flex items-center gap-2">
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                f.included
                  ? isSelected
                    ? "bg-primary/15"
                    : "bg-emerald-100 dark:bg-emerald-900/40"
                  : "bg-muted"
              }`}
            >
              {f.included ? (
                <Check
                  className={`w-2.5 h-2.5 ${
                    isSelected
                      ? "text-primary"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                />
              ) : (
                <X className="w-2.5 h-2.5 text-muted-foreground/40" />
              )}
            </span>
            <span
              className={`text-xs leading-snug ${
                f.included
                  ? "text-foreground"
                  : "text-muted-foreground/50 line-through decoration-muted-foreground/20"
              }`}
            >
              {f.label}
            </span>
          </li>
        ))}
      </ul>
    </button>
  );
}
