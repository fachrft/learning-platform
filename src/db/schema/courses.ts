import {
  pgTable,
  varchar,
  timestamp,
  text,
  pgEnum,
  boolean,
  integer,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { Users } from "./users";

export const courseStatusEnum = pgEnum("status_course", ["draft", "published"]);
export const lessonTypeEnum = pgEnum("type_lesson", ["video", "text", "quiz"]);

export const Courses = pgTable("courses", {
  id: varchar().primaryKey().notNull(),
  title: varchar().notNull(),
  description: text().notNull(),
  thumbnail: varchar(),
  slug: varchar().unique(),
  status: courseStatusEnum("status").default("draft"),
  isFree: boolean().default(false),
  sortOrder: integer().default(0),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

export const Chapters = pgTable("chapters", {
  id: varchar().primaryKey().notNull(),
  courseId: varchar()
    .notNull()
    .references(() => Courses.id, { onDelete: "cascade" }),
  title: varchar().notNull(),
  description: text(),
  slug: varchar(),
  sortOrder: integer().default(0),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

export const Lessons = pgTable("lessons", {
  id: varchar().primaryKey().notNull(),
  chapterId: varchar()
    .notNull()
    .references(() => Chapters.id, { onDelete: "cascade" }),
  title: varchar().notNull(),
  description: text(),
  content: text(), // For text-based lessons
  videoUrl: varchar(), // For video lessons
  type: lessonTypeEnum("type").default("video"),
  slug: varchar(),
  sortOrder: integer().default(0),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

export const CourseEnrollments = pgTable(
  "course_enrollments",
  {
    userId: varchar()
      .notNull()
      .references(() => Users.id, { onDelete: "cascade" }),
    courseId: varchar()
      .notNull()
      .references(() => Courses.id, { onDelete: "cascade" }),
    enrolledAt: timestamp().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.courseId] })],
);

export const UserProgress = pgTable(
  "user_progress",
  {
    id: varchar().primaryKey().notNull(),
    userId: varchar()
      .notNull()
      .references(() => Users.id, { onDelete: "cascade" }),
    lessonId: varchar()
      .notNull()
      .references(() => Lessons.id, { onDelete: "cascade" }),
    completed: boolean().default(false),
    completedAt: timestamp(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
  },

  (t) => [unique().on(t.userId, t.lessonId)],
);

export const CourseReviews = pgTable(
  "course_reviews",
  {
    id: varchar().primaryKey().notNull(),
    userId: varchar()
      .notNull()
      .references(() => Users.id, { onDelete: "cascade" }),
    courseId: varchar()
      .notNull()
      .references(() => Courses.id, { onDelete: "cascade" }),
    rating: integer().notNull(),
    comment: text(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
  },

  (t) => [unique().on(t.userId, t.courseId)],
);

export const coursesRelations = relations(Courses, ({ many }) => ({
  course_enrollments: many(CourseEnrollments),
  course_reviews: many(CourseReviews),
  chapters: many(Chapters),
}));

export const chaptersRelations = relations(Chapters, ({ one, many }) => ({
  course: one(Courses, {
    fields: [Chapters.courseId],
    references: [Courses.id],
  }),
  lessons: many(Lessons),
}));

export const lessonsRelations = relations(Lessons, ({ one, many }) => ({
  chapter: one(Chapters, {
    fields: [Lessons.chapterId],
    references: [Chapters.id],
  }),
  user_progress: many(UserProgress),
}));

export const courseEnrollmentsRelations = relations(
  CourseEnrollments,
  ({ one }) => ({
    course: one(Courses, {
      fields: [CourseEnrollments.courseId],
      references: [Courses.id],
    }),
    user: one(Users, {
      fields: [CourseEnrollments.userId],
      references: [Users.id],
    }),
  }),
);

export const courseReviewsRelations = relations(CourseReviews, ({ one }) => ({
  course: one(Courses, {
    fields: [CourseReviews.courseId],
    references: [Courses.id],
  }),
  user: one(Users, {
    fields: [CourseReviews.userId],
    references: [Users.id],
  }),
}));

export const userProgressRelations = relations(UserProgress, ({ one }) => ({
  lesson: one(Lessons, {
    fields: [UserProgress.lessonId],
    references: [Lessons.id],
  }),
  user: one(Users, {
    fields: [UserProgress.userId],
    references: [Users.id],
  }),
}));
