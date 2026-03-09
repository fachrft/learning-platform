import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "student" | "admin";
      email?: string | null;
      subscription: "free" | "premium";
    } & DefaultSession["user"];
  }

  interface User {
    role: "student" | "admin";
    subscription: "free" | "premium";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "student" | "admin";
    email?: string | null;
    subscription: "free" | "premium";
  }
}
