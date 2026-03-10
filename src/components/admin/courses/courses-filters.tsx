"use client";

import { Search } from "lucide-react";
import { STATUS_FILTERS } from "@/types/course";
import { Input } from "@/components/ui/input";

interface CoursesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeStatus: string;
  onStatusChange: (value: string) => void;
}

export function CoursesFilters({
  search,
  onSearchChange,
  activeStatus,
  onStatusChange,
}: CoursesFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Search + Status Row */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari kursus"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-border/60 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.value}
              onClick={() => onStatusChange(s.value)}
              className={`text-xs px-3 py-2 rounded-xl font-medium transition-all ${
                activeStatus === s.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
