import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "@/schemas/auth.schema";

// =====================
// registerSchema tests
// =====================
describe("registerSchema", () => {
  it("harus valid jika semua field benar", () => {
    const result = registerSchema.safeParse({
      name: "Budi Santoso",
      email: "budi@email.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("harus error jika nama kurang dari 2 karakter", () => {
    const result = registerSchema.safeParse({
      name: "B",
      email: "budi@email.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.name).toBeDefined();
  });

  it("harus error jika email tidak valid", () => {
    const result = registerSchema.safeParse({
      name: "Budi",
      email: "bukan-email",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.email).toBeDefined();
  });

  it("harus error jika password kurang dari 8 karakter", () => {
    const result = registerSchema.safeParse({
      name: "Budi",
      email: "budi@email.com",
      password: "abc",
      confirmPassword: "abc",
    });

    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.password).toBeDefined();
  });

  it("harus error jika confirmPassword tidak cocok", () => {
    const result = registerSchema.safeParse({
      name: "Budi",
      email: "budi@email.com",
      password: "password123",
      confirmPassword: "salah123",
    });

    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.confirmPassword).toBeDefined();
  });
});

// ===================
// loginSchema tests
// ===================
describe("loginSchema", () => {
  it("harus valid jika email dan password benar", () => {
    const result = loginSchema.safeParse({
      email: "budi@email.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("harus error jika email kosong", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("harus error jika password kosong", () => {
    const result = loginSchema.safeParse({
      email: "budi@email.com",
      password: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.password).toBeDefined();
  });
});
