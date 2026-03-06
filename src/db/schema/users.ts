import { pgTable, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["student", "admin"]);

export const Users = pgTable("users", {
  id: varchar().primaryKey().notNull(),
  email: varchar().notNull().unique(),
  name: varchar(),
  password: varchar().notNull(),
  role: roleEnum("role").default("student").notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});
