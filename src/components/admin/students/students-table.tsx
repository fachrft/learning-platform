"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { formatDateIndo } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Student } from "@/types/user";

interface StudentsTableProps {
  students: Student[];
}

export function StudentsTable({ students }: StudentsTableProps) {
  const [search, setSearch] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");

  const filteredStudents = students.filter((student) => {
    const matchSearch =
      (student.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      subscriptionFilter === "all" ||
      student.subscription === subscriptionFilter;
    return matchSearch && matchStatus;
  });

  const getSubscriptionBadge = (status: string) => {
    switch (status) {
      case "premium":
        return (
          <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-500 ring-1 ring-inset ring-amber-500/20">
            Premium
          </span>
        );
      case "free":
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-gray-500/10 px-2 py-1 text-xs font-medium text-gray-500 ring-1 ring-inset ring-gray-500/20">
            Free
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b">
        <div>
          <h3 className="font-semibold text-lg">Direktori Siswa</h3>
          <p className="text-sm text-muted-foreground">
            Kelola pengguna yang mendaftar di Lumina
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari nama atau email..."
              className="pl-9 h-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            value={subscriptionFilter}
            onValueChange={setSubscriptionFilter}
          >
            <SelectTrigger className="w-full sm:w-[150px] h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="free">Free</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-0">
        <div className="overflow-x-auto px-5 pb-5">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-medium">User / Siswa</TableHead>
                <TableHead className="font-medium">Langganan</TableHead>
                <TableHead className="font-medium text-xs">
                  Berakhir Pada
                </TableHead>
                <TableHead className="font-medium">Jumlah Kursus</TableHead>
                <TableHead className="font-medium text-xs">
                  Bergabung Sejak
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Pelajar tidak ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow
                    key={student.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div className="font-medium">
                        {student.name || "Siswa"}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {student.email}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {getSubscriptionBadge(student.subscription)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {student.subscription === "premium"
                        ? formatDateIndo(student.subscriptionEnd)
                        : "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {student.enrolledCourses}{" "}
                      <span className="text-muted-foreground font-normal">
                        kursus
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {formatDateIndo(student.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
