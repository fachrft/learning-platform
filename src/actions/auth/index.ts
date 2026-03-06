"use server";

import { registerSchema, RegisterInput } from "@/schemas/auth.schema";
import { db } from "@/db";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function registerAction(data: RegisterInput): Promise<void> {
  const parsed = registerSchema.safeParse(data);

  if (!parsed.success) {
    const firstMessage =
      Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
      "Data tidak valid.";
    throw new Error(firstMessage);
  }

  const { name, email, password } = parsed.data;

  const existing = await db.query.Users.findFirst({
    where: eq(Users.email, email),
  });

  if (existing) {
    throw new Error("Email ini sudah terdaftar. Silakan login.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(Users).values({
    id: crypto.randomUUID(),
    name,
    email,
    password: hashedPassword,
  });
}
