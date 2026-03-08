import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createLessonAction,
  updateLessonAction,
  deleteLessonAction,
  getLessonBySlug,
  getQuizzesByLesson,
} from "@/actions/lessons";

// ============================================================
// Mocks
// ============================================================

// Mock DB
vi.mock("@/db", () => {
  return {
    db: {
      query: {
        Chapters: {
          findFirst: vi.fn(),
        },
        Lessons: {
          findFirst: vi.fn(),
          findMany: vi.fn(),
        },
        Quizzes: {
          findMany: vi.fn(),
        },
      },
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      transaction: vi.fn(),
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

  const deleteWhereMock = vi.fn().mockResolvedValue(undefined);
  vi.mocked(db.delete).mockReturnValue({
    where: deleteWhereMock,
  } as any);

  return { insertValuesMock, updateSetWhereMock, deleteWhereMock };
};

// Helper for transaction
const setupTransactionMock = () => {
  const txMock = {
    insert: vi
      .fn()
      .mockReturnValue({ values: vi.fn().mockResolvedValue(undefined) }),
    update: vi.fn().mockReturnValue({
      set: vi
        .fn()
        .mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
    }),
    delete: vi
      .fn()
      .mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
  };
  vi.mocked(db.transaction).mockImplementation(
    async (cb: any) => await cb(txMock),
  );
  return txMock;
};

describe("Lessons CRUD Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getLessonBySlug", () => {
    it("berhasil mengambil lesson beserta kuis", async () => {
      const mockLesson = { id: "l1", title: "Test Lesson", quizzes: [] };
      vi.mocked(db.query.Lessons.findFirst).mockResolvedValue(
        mockLesson as any,
      );

      const result = await getLessonBySlug("test-lesson");

      expect(result.success).toBe(true);
      expect(result.lesson).toEqual(mockLesson);
    });
  });

  describe("createLessonAction", () => {
    it("berhasil membuat lesson beserta kuis (transaction)", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { role: "admin" },
      } as any);
      vi.mocked(db.query.Chapters.findFirst).mockResolvedValue({
        id: "c1",
      } as any);
      const txMock = setupTransactionMock();

      const result = await createLessonAction(
        {
          title: "Test Quiz",
          type: "quiz",
          sortOrder: 0,
          quizzes: [
            {
              question: "Question 1?",
              optionA: "A",
              optionB: "B",
              optionC: "C",
              optionD: "D",
              correctAnswer: "A",
              points: 10,
              sortOrder: 0,
            },
          ],
        },
        "intro-chapter",
      );

      expect(result.success).toBe(true);
      expect(db.transaction).toHaveBeenCalled();
      expect(txMock.insert).toHaveBeenCalledTimes(2); // One for lesson, one for quizzes
    });
  });

  describe("updateLessonAction", () => {
    it("berhasil update materi dan sinkronisasi kuis", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { role: "admin" },
      } as any);
      vi.mocked(db.query.Lessons.findFirst).mockResolvedValue({
        id: "l1",
        title: "Old Title",
      } as any);
      const txMock = setupTransactionMock();

      const result = await updateLessonAction("l1", {
        title: "New Title",
        type: "quiz",
        sortOrder: 0,
        quizzes: [
          {
            question: "Updated Q?",
            optionA: "A",
            optionB: "B",
            optionC: "C",
            optionD: "D",
            correctAnswer: "B",
            points: 20,
            sortOrder: 0,
          },
        ],
      });

      expect(result.success).toBe(true);
      expect(txMock.delete).toHaveBeenCalled(); // Should delete old quizzes
      expect(txMock.insert).toHaveBeenCalled(); // Should insert new quizzes
      expect(txMock.update).toHaveBeenCalled(); // Should update lesson
    });

    it("menghapus kuis jika tipe materi berubah dari quiz ke text", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { role: "admin" },
      } as any);
      vi.mocked(db.query.Lessons.findFirst).mockResolvedValue({
        id: "l1",
        type: "quiz",
      } as any);
      const txMock = setupTransactionMock();

      const result = await updateLessonAction("l1", {
        title: "Title",
        type: "text",
        sortOrder: 0,
        content: "Some content",
      });

      expect(result.success).toBe(true);
      expect(txMock.delete).toHaveBeenCalled(); // Should clear orphans
    });
  });

  describe("deleteLessonAction", () => {
    it("berhasil menghapus lesson", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { role: "admin" },
      } as any);
      setupDrizzleChaining();

      const result = await deleteLessonAction("l1");

      expect(result.success).toBe(true);
      expect(db.delete).toHaveBeenCalled();
    });
  });

  describe("getQuizzesByLesson", () => {
    it("berhasil mengambil daftar kuis", async () => {
      const mockQuizzes = [{ id: "q1", question: "Q?" }];
      vi.mocked(db.query.Quizzes.findMany).mockResolvedValue(
        mockQuizzes as any,
      );

      const result = await getQuizzesByLesson("l1");

      expect(result.success).toBe(true);
      expect(result.quizzes).toEqual(mockQuizzes);
    });
  });
});
