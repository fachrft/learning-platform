import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getCoursesAction,
  createCourseAction,
  updateCourseAction,
  deleteCourseAction,
} from "@/actions/courses";

// ============================================================
// Mocks
// ============================================================

// Mock DB
vi.mock("@/db", () => {
  return {
    db: {
      query: {
        Courses: {
          findMany: vi.fn(),
          findFirst: vi.fn(),
        },
      },
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
});

// Mock Next Auth
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

// Mock ImageKit helper
vi.mock("@/lib/imagekit", () => ({
  deleteImageKitFileByUrl: vi.fn().mockResolvedValue(undefined),
}));

// Imports after mocking
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { deleteImageKitFileByUrl } from "@/lib/imagekit";

// Setup chaining mocks for Drizzle
const setupDrizzleChaining = () => {
  const insertValuesMock = vi.fn().mockResolvedValue(undefined);
  vi.mocked(db.insert).mockReturnValue({
    values: insertValuesMock,
  } as any);

  const updateSetWhereMock = vi.fn().mockResolvedValue(undefined);
  const updateSetMock = vi.fn().mockReturnValue({
    where: updateSetWhereMock,
  });
  vi.mocked(db.update).mockReturnValue({
    set: updateSetMock,
  } as any);

  const deleteWhereMock = vi.fn().mockResolvedValue(undefined);
  vi.mocked(db.delete).mockReturnValue({
    where: deleteWhereMock,
  } as any);

  return { insertValuesMock, updateSetWhereMock, deleteWhereMock };
};

describe("Courses CRUD Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCoursesAction", () => {
    it("harus mengembalikan daftar kursus (success: true)", async () => {
      const mockData = [{ id: "1", title: "Test Course" }];
      vi.mocked(db.query.Courses.findMany).mockResolvedValue(mockData as any);

      const result = await getCoursesAction();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(db.query.Courses.findMany).toHaveBeenCalled();
    });

    it("harus mengembalikan (success: false) jika DB error", async () => {
      vi.mocked(db.query.Courses.findMany).mockRejectedValue(
        new Error("DB Down"),
      );

      const result = await getCoursesAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe("DB Down");
    });
  });

  describe("createCourseAction", () => {
    it("gagal jika user belum login", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await createCourseAction({
        title: "Test Course",
        description: "Panjang banget buat nulis",
        status: "draft",
        isFree: false,
        sortOrder: 0,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Anda harus login sebagai admin untuk membuat kursus.",
      );
    });

    it("gagal jika user bukan admin", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { email: "test@x.com", role: "student" },
      } as any);

      const result = await createCourseAction({
        title: "Test Course",
        description: "Panjang banget buat nulis",
        status: "draft",
        isFree: false,
        sortOrder: 0,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Anda harus login sebagai admin untuk membuat kursus.",
      );
    });

    it("gagal jika validasi zod gagal", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { role: "admin" },
      } as any);

      const result = await createCourseAction({
        title: "A", // Terlalu pendek
        description: "Panjang banget",
        status: "draft",
        isFree: false,
        sortOrder: 0,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Judul kursus minimal 3 karakter");
    });

    it("berhasil membuat kursus", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { role: "admin" },
      } as any);
      setupDrizzleChaining();

      const result = await createCourseAction({
        title: "Test Course",
        description: "Deskripsi minimal 10 karakter loh ini",
        status: "draft",
        isFree: false,
        sortOrder: 0,
      });

      expect(result.success).toBe(true);
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe("updateCourseAction", () => {
    it("gagal jika bukan admin", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await updateCourseAction("1", {
        title: "Test Course",
        description: "Deskripsi minimal 10 karakter loh ini",
        status: "draft",
        isFree: false,
        sortOrder: 0,
      });

      expect(result.success).toBe(false);
    });

    it("gagal jika kursus tidak ditemukan", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { role: "admin" },
      } as any);
      vi.mocked(db.query.Courses.findFirst).mockResolvedValue(undefined as any);

      const result = await updateCourseAction("1", {
        title: "Test Course",
        description: "Deskripsi minimal 10 karakter loh ini",
        status: "draft",
        isFree: false,
        sortOrder: 0,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Kursus tidak ditemukan.");
    });

    it("menghapus thumbnail lama di ImageKit jika diganti", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { role: "admin" },
      } as any);
      vi.mocked(db.query.Courses.findFirst).mockResolvedValue({
        id: "1",
        thumbnail: "old_url",
      } as any);
      setupDrizzleChaining();

      const result = await updateCourseAction("1", {
        title: "Test Course",
        description: "Deskripsi minimal 10 karakter loh ini",
        thumbnail: "new_url",
        status: "draft",
        isFree: false,
        sortOrder: 0,
      });

      expect(result.success).toBe(true);
      expect(deleteImageKitFileByUrl).toHaveBeenCalledWith("old_url");
      expect(db.update).toHaveBeenCalled();
    });
  });

  describe("deleteCourseAction", () => {
    it("gagal jika kursus tidak ditemukan", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { role: "admin" },
      } as any);
      vi.mocked(db.query.Courses.findFirst).mockResolvedValue(undefined as any);

      const result = await deleteCourseAction("1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Kursus tidak ditemukan.");
    });

    it("menghapus gambar dan data jika berhasil", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { role: "admin" },
      } as any);
      vi.mocked(db.query.Courses.findFirst).mockResolvedValue({
        id: "1",
        thumbnail: "some_url",
      } as any);
      setupDrizzleChaining();

      const result = await deleteCourseAction("1");

      expect(result.success).toBe(true);
      expect(deleteImageKitFileByUrl).toHaveBeenCalledWith("some_url");
      expect(db.delete).toHaveBeenCalled();
    });
  });
});
