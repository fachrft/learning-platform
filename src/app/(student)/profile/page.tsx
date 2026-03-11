import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProfileClient } from "@/components/student/profile/profile-client";

export const metadata = {
  title: "Profil Saya | Seefluencer",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    subscription?: "free" | "premium";
  };

  return (
    <ProfileClient
      user={{
        id: user.id || "",
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
      }}
    />
  );
}
