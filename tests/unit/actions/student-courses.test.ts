import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getPublishedCoursesAction,
  getCourseDetailAction,
  submitCourseReviewAction,
  enrollCourseAction,
} from "@/actions/courses/student";

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
        CourseReviews: {
          findFirst: vi.fn(),
        },
        CourseEnrollments: {
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

// Imports after mocking
import { db } from "@/db";
import { getServerSession } from "next-auth";

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

  return { insertValuesMock, updateSetWhereMock };
};

describe("Student Courses Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPublishedCoursesAction", () => {
    it("harus mengembalikan datar kursus published (success: true)", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-123" },
      } as any);

      const mockData = [
        { id: "c1", title: "Test Course", status: "published" },
      ];
      vi.mocked(db.query.Courses.findMany).mockResolvedValue(mockData as any);

      const result = await getPublishedCoursesAction();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(db.query.Courses.findMany).toHaveBeenCalled();
    });

    it("harus mengembalikan (success: false) jika DB error", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      vi.mocked(db.query.Courses.findMany).mockRejectedValue(
        new Error("DB Down"),
      );

      const result = await getPublishedCoursesAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe("DB Down");
    });
  });

  describe("getCourseDetailAction", () => {
    it("gagal jika kursus tidak ditemukan", async () => {
      vi.mocked(db.query.Courses.findFirst).mockResolvedValue(undefined as any);

      const result = await getCourseDetailAction("slug-123");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Kursus tidak ditemukan atau masih draft.");
    });

    it("gagal jika status kursus draft", async () => {
      vi.mocked(db.query.Courses.findFirst).mockResolvedValue({
        id: "c1",
        status: "draft",
      } as any);

      const result = await getCourseDetailAction("slug-123");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Kursus tidak ditemukan atau masih draft.");
    });

    it("berhasil mendapatkan detail kursus", async () => {
      const mockCourse = { id: "c1", status: "published", title: "Course 1" };
      vi.mocked(db.query.Courses.findFirst).mockResolvedValue(
        mockCourse as any,
      );

      const result = await getCourseDetailAction("slug-123");

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCourse);
    });
  });

  describe("submitCourseReviewAction", () => {
    it("gagal jika user belum login", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await submitCourseReviewAction("c1", 5, "Good");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Silakan login terlebih dahulu.");
    });

    it("mengupdate ulasan jika review sebelumnya sudah ada", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-123" },
      } as any);

      vi.mocked(db.query.CourseReviews.findFirst).mockResolvedValue({
        id: "rev-1",
        rating: 3,
      } as any);

      const { updateSetWhereMock } = setupDrizzleChaining();

      const result = await submitCourseReviewAction("c1", 5, "Updated");

      expect(result.success).toBe(true);
      expect(db.update).toHaveBeenCalled();
      expect(updateSetWhereMock).toHaveBeenCalled();
    });

    it("membuat ulasan baru jika belum pernah mereview", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-123" },
      } as any);

      vi.mocked(db.query.CourseReviews.findFirst).mockResolvedValue(
        undefined as any,
      );

      const { insertValuesMock } = setupDrizzleChaining();

      const result = await submitCourseReviewAction("c1", 4, "Good course");

      expect(result.success).toBe(true);
      expect(db.insert).toHaveBeenCalled();
      expect(insertValuesMock).toHaveBeenCalled();
    });
  });

  describe("enrollCourseAction", () => {
    it("gagal jika user belum login", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);

      const result = await enrollCourseAction("c1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Silakan login terlebih dahulu.");
    });

    it("berhasil mendaftar jika belum ada riwayat pendaftaran", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-123" },
      } as any);

      vi.mocked(db.query.CourseEnrollments.findFirst).mockResolvedValue(
        undefined as any,
      );

      const { insertValuesMock } = setupDrizzleChaining();

      const result = await enrollCourseAction("c1");

      expect(result.success).toBe(true);
      expect(db.insert).toHaveBeenCalled();
      expect(insertValuesMock).toHaveBeenCalledWith({
        userId: "user-123",
        courseId: "c1",
      });
    });

    it("tidak mendaftar ulang jika sudah mendaftar (success = true)", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-123" },
      } as any);

      vi.mocked(db.query.CourseEnrollments.findFirst).mockResolvedValue({
        userId: "user-123",
        courseId: "c1",
      } as any);

      const { insertValuesMock } = setupDrizzleChaining();

      const result = await enrollCourseAction("c1");

      expect(result.success).toBe(true);
      expect(db.insert).not.toHaveBeenCalled();
      expect(insertValuesMock).not.toHaveBeenCalled();
    });
  });
});
