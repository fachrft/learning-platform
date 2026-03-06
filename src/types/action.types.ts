export type ActionState<T = undefined> = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
  data?: T;
};
