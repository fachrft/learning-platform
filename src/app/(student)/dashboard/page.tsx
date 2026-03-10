import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardClient } from "@/components/student/dashboard/dashboard-client";

export const metadata = {
  title: "Dashboard | Lumina",
  description: "Explore and learn from the best courses.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return <DashboardClient user={session.user} />;
}
