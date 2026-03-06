import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerAction } from "@/actions/auth";

// ============================================================
// Mock semua dependency yang konek keluar (DB, bcrypt)
// ============================================================

// Mock modul DB — tidak konek ke database beneran
vi.mock("@/db", () => ({
  db: {
    query: {
      Users: {
        // Default: user tidak ditemukan (email belum terdaftar)
        findFirst: vi.fn().mockResolvedValue(null),
      },
    },
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    }),
  },
}));

// Mock bcrypt — tidak perlu hash beneran, lambat
vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password_123"),
  },
}));

// ============================================================
// Import db SETELAH mock supaya dapat versi yang sudah di-mock
// ============================================================
import { db } from "@/db";

// ============================================================
// Test cases
// ============================================================
describe("registerAction", () => {
  // Reset semua mock sebelum tiap test biar tidak saling pengaruh
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock: email belum terdaftar
    vi.mocked(db.query.Users.findFirst).mockResolvedValue(undefined);
    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    } as any);
  });

  // ---- Validasi Zod (tidak sampai DB) ----

  it("throw error jika nama terlalu pendek", async () => {
    await expect(
      registerAction({
        name: "A",
        email: "budi@email.com",
        password: "password123",
        confirmPassword: "password123",
      }),
    ).rejects.toThrow("Nama minimal 2 karakter.");
  });

  it("throw error jika email tidak valid", async () => {
    await expect(
      registerAction({
        name: "Budi",
        email: "bukan-email",
        password: "password123",
        confirmPassword: "password123",
      }),
    ).rejects.toThrow();
  });

  it("throw error jika password kurang dari 8 karakter", async () => {
    await expect(
      registerAction({
        name: "Budi",
        email: "budi@email.com",
        password: "abc",
        confirmPassword: "abc",
      }),
    ).rejects.toThrow("Kata sandi minimal 8 karakter.");
  });

  it("throw error jika confirmPassword tidak cocok", async () => {
    await expect(
      registerAction({
        name: "Budi",
        email: "budi@email.com",
        password: "password123",
        confirmPassword: "salah123",
      }),
    ).rejects.toThrow("Konfirmasi kata sandi tidak cocok.");
  });

  // ---- Logika DB ----

  it("throw error jika email sudah terdaftar", async () => {
    // Override mock: findFirst return user (email sudah ada)
    vi.mocked(db.query.Users.findFirst).mockResolvedValue({
      id: "existing-id",
      email: "budi@email.com",
      name: "Budi",
      password: "hashed",
      role: "student",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      registerAction({
        name: "Budi",
        email: "budi@email.com",
        password: "password123",
        confirmPassword: "password123",
      }),
    ).rejects.toThrow("Email ini sudah terdaftar. Silakan login.");
  });

  it("berhasil register jika data valid dan email belum terdaftar", async () => {
    // Default mock sudah return null (email belum ada)
    await expect(
      registerAction({
        name: "Budi Santoso",
        email: "budi@email.com",
        password: "password123",
        confirmPassword: "password123",
      }),
    ).resolves.toBeUndefined(); // fungsi return void (tidak throw)
  });
});
