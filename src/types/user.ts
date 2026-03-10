export type UserRole = "student" | "admin";
export type UserSubscription = "free" | "premium";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  subscription: UserSubscription;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Student {
  id: string;
  name: string | null;
  email: string;
  subscription: UserSubscription;
  createdAt: Date | null;
  subscriptionEnd: Date | null;
  enrolledCourses: number;
}
