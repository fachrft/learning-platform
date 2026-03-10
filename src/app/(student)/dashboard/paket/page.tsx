import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PaketClient } from "@/components/student/paket/paket-client";

export const metadata = {
  title: "Pilih Paket | Lumina",
  description:
    "Upgrade ke premium dan nikmati akses tak terbatas ke semua kursus.",
};

export default async function PaketPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return <PaketClient user={session.user} />;
}
