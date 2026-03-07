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

describe("registerAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(db.query.Users.findFirst).mockResolvedValue(undefined);
    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    } as any);
  });

  it("throw error jika nama terlalu pendek", async () => {
    const result = await registerAction({
      name: "A",
      email: "budi@email.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(false);
    expect(result.error).toContain("Nama minimal 2 karakter.");
  });

  it("throw error jika email tidak valid", async () => {
    const result = await registerAction({
      name: "Budi",
      email: "bukan-email",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("throw error jika password kurang dari 8 karakter", async () => {
    const result = await registerAction({
      name: "Budi",
      email: "budi@email.com",
      password: "abc",
      confirmPassword: "abc",
    });
    expect(result.success).toBe(false);
    expect(result.error).toContain("Kata sandi minimal 8 karakter.");
  });

  it("throw error jika confirmPassword tidak cocok", async () => {
    const result = await registerAction({
      name: "Budi",
      email: "budi@email.com",
      password: "password123",
      confirmPassword: "salah123",
    });
    expect(result.success).toBe(false);
    expect(result.error).toContain("Konfirmasi kata sandi tidak cocok.");
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

    const result = await registerAction({
      name: "Budi",
      email: "budi@email.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Email ini sudah terdaftar. Silakan login.");
  });

  it("berhasil register jika data valid dan email belum terdaftar", async () => {
    // Default mock sudah return null (email belum ada)
    const result = await registerAction({
      name: "Budi Santoso",
      email: "budi@email.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(true);
  });
});
