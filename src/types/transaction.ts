export type SubscriptionPlan = "monthly" | "yearly";
export type SubscriptionStatus = "active" | "expired" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "expired";

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  midtransOrderId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  user?: {
    id?: string;
    name: string | null;
    email: string | null;
    image?: string | null;
  };
}

export interface Transaction {
  id: string;
  userId: string;
  orderId: string;
  plan: SubscriptionPlan;
  amount: number;
  status: PaymentStatus;
  paymentType: string | null;
  snapToken: string | null;
  paidAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  user?: {
    id?: string;
    name: string | null;
    email: string | null;
  };
}
