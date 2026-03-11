"use server";

import { db } from "@/db";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  profileSchema,
  type EditProfileFormValues,
} from "@/schemas/profile.schema";

export async function updateProfileAction(
  userId: string,
  data: EditProfileFormValues,
) {
  try {
    const validatedData = profileSchema.parse(data);

    const existingUser = await db.query.Users.findFirst({
      where: eq(Users.email, validatedData.email),
    });

    if (existingUser && existingUser.id !== userId) {
      return { success: false, error: "Email sudah digunakan oleh akun lain." };
    }

    await db
      .update(Users)
      .set({
        name: validatedData.name,
        email: validatedData.email,
        updatedAt: new Date(),
      })
      .where(eq(Users.id, userId));

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Terjadi kesalahan." };
  }
}
