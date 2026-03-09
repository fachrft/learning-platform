import {
  pgTable,
  varchar,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { Users } from "./users";

export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "monthly",
  "yearly",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "expired",
  "cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "expired",
]);


export const Subscriptions = pgTable("subscriptions", {
  id: varchar().primaryKey().notNull(),
  userId: varchar()
    .notNull()
    .unique()
    .references(() => Users.id, { onDelete: "cascade" }),

  plan: subscriptionPlanEnum("plan").notNull(),
  status: subscriptionStatusEnum("status").default("active").notNull(),
  currentPeriodStart: timestamp().notNull(),
  currentPeriodEnd: timestamp().notNull(),
  midtransOrderId: varchar(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});


export const PaymentTransactions = pgTable("payment_transactions", {
  id: varchar().primaryKey().notNull(),
  userId: varchar()
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" }), 
  orderId: varchar().notNull().unique(),
  plan: subscriptionPlanEnum("plan").notNull(),
  amount: integer().notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  paymentType: varchar(),
  snapToken: varchar(),
  paidAt: timestamp(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});



export const subscriptionsRelations = relations(Subscriptions, ({ one }) => ({
  user: one(Users, {
    fields: [Subscriptions.userId],
    references: [Users.id],
  }),
}));

export const paymentTransactionsRelations = relations(
  PaymentTransactions,
  ({ one }) => ({
    user: one(Users, {
      fields: [PaymentTransactions.userId],
      references: [Users.id],
    }),
  }),
);
