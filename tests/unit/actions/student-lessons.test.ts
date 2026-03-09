import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getLessonPageDataAction,
  markLessonCompleteAction,
  submitQuizAction,
} from "@/actions/lessons/student";

// ============================================================
// Mocks
// ============================================================

// Mock DB
vi.mock("@/db", () => {
  return {
    db: {
      query: {
        Courses: {
          findFirst: vi.fn(),
        },
        Lessons: {
          findFirst: vi.fn(),
        },
        Quizzes: {
          findMany: vi.fn(),
        },
        UserProgress: {
          findMany: vi.fn(),
          findFirst: vi.fn(),
        },
      },
      insert: vi.fn(),
      update: vi.fn(),
    },
  };
});

// Mock Next Auth
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

import { db } from "@/db";
import { getServerSession } from "next-auth";

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

describe("Student Lessons Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getLessonPageDataAction", () => {
    it("gagal jika user belum login", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const result = await getLessonPageDataAction("course-1", "lesson-1");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Unauthorized");
    });

    it("gagal jika kursus tidak ditemukan", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-123" },
      } as any);
      vi.mocked(db.query.Courses.findFirst).mockResolvedValue(undefined as any);

      const result = await getLessonPageDataAction("course-1", "lesson-1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Course tidak ditemukan");
    });

    it("gagal jika course berbayar tetapi user free", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-123", subscription: "free" },
      } as any);
      vi.mocked(db.query.Courses.findFirst).mockResolvedValue({
        isFree: false,
        status: "published",
        chapters: [],
      } as any);

      const result = await getLessonPageDataAction("course-1", "lesson-1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("PremiumRequired");
    });

    it("berhasil mendapatkan data pelajaran", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-123", subscription: "premium" },
      } as any);
      vi.mocked(db.query.Courses.findFirst).mockResolvedValue({
        id: "c-1",
        isFree: false,
        status: "published",
        chapters: [
          {
            slug: "ch-1",
            lessons: [
              { id: "l-1", slug: "lesson-1" },
              { id: "l-2", slug: "lesson-2" },
            ],
          },
        ],
      } as any);
      vi.mocked(db.query.Lessons.findFirst).mockResolvedValue({
        id: "l-1",
        slug: "lesson-1",
      } as any);
      vi.mocked(db.query.UserProgress.findMany).mockResolvedValue([] as any);

      const result = await getLessonPageDataAction("course-1", "lesson-1");

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("course");
      expect(result.data?.currentLesson?.id).toBe("l-1");
      expect(result.data?.nextLesson?.slug).toBe("lesson-2");
      expect(result.data?.prevLesson).toBeNull();
    });
  });

  describe("markLessonCompleteAction", () => {
    it("gagal jika user belum login", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const result = await markLessonCompleteAction("lesson-1");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Unauthorized");
    });

    it("update progress jika sudah ada", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-1" },
      } as any);
      vi.mocked(db.query.UserProgress.findFirst).mockResolvedValue({
        id: "prog-1",
      } as any);
      const { updateSetWhereMock } = setupDrizzleChaining();

      const result = await markLessonCompleteAction("lesson-1");

      expect(result.success).toBe(true);
      expect(db.update).toHaveBeenCalled();
      expect(updateSetWhereMock).toHaveBeenCalled();
    });

    it("insert progress jika belum ada", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-1" },
      } as any);
      vi.mocked(db.query.UserProgress.findFirst).mockResolvedValue(
        undefined as any,
      );
      const { insertValuesMock } = setupDrizzleChaining();

      const result = await markLessonCompleteAction("lesson-1");

      expect(result.success).toBe(true);
      expect(db.insert).toHaveBeenCalled();
      expect(insertValuesMock).toHaveBeenCalled();
    });
  });

  describe("submitQuizAction", () => {
    it("gagal jika kuis tidak ada", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-1" },
      } as any);
      vi.mocked(db.query.Quizzes.findMany).mockResolvedValue([] as any);

      const result = await submitQuizAction("lesson-1", { "q-1": "A" });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Kuis tidak ditemukan or kosong");
    });

    it("kalkulasi skor kuis yang benar", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: "user-1" },
      } as any);
      vi.mocked(db.query.Quizzes.findMany).mockResolvedValue([
        { id: "q-1", correctAnswer: "A", points: 10 },
        { id: "q-2", correctAnswer: "B", points: 10 },
      ] as any);
      vi.mocked(db.query.UserProgress.findFirst).mockResolvedValue({
        id: "prog-1",
      } as any);
      const { insertValuesMock } = setupDrizzleChaining();

      // Semuanya benar
      const result = await submitQuizAction("lesson-1", {
        "q-1": "A",
        "q-2": "B",
      });

      expect(result.success).toBe(true);
      expect(result.score).toBe(20);
      expect(result.totalPoints).toBe(20);
      expect(result.passed).toBe(true);

      expect(db.insert).toHaveBeenCalled(); // Insert ke QuizAttempts
    });
  });
});
