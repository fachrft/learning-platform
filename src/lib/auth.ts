import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const user = await db.query.Users.findFirst({
            where: eq(Users.email, credentials.email),
          });

          if (!user || !user.password) return null;

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            subscription: user.subscription,
          };
        } catch (error) {
          console.error("[authorize error]", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Saat pertama login — ambil data dari user object
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.subscription = user.subscription;
      }
      
      if (trigger === "update" || (!user && token.id)) {
        const freshUser = await db.query.Users.findFirst({
          where: eq(Users.id, token.id),
        });
        if (freshUser) {
          token.subscription = freshUser.subscription;
          token.role = freshUser.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.subscription = token.subscription;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
