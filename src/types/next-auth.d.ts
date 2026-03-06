import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "student" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    role: "student" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "student" | "admin";
  }
}
