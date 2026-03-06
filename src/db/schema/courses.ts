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
import { Users } from "./users";

export const courseStatusEnum = pgEnum("status", ["draft", "published"]);
export const lessonTypeEnum = pgEnum("type", ["video", "text", "quiz"]);

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
