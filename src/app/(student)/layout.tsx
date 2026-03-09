import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { StudentNavbar } from "@/components/student/navbar";
import { StudentLayoutClient } from "./student-layout-client";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <StudentLayoutClient navbar={<StudentNavbar user={session.user} />}>
      {children}
    </StudentLayoutClient>
  );
}
