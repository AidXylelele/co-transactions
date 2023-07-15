import { TransactionStates } from "src/types/paypal.types";

export const transactionStates: TransactionStates = {
  success: ["approved", "completed", "success"],
  error: [
    "failed",
    "canceled",
    "expired",
    "blocked",
    "cancelled",
    "denied",
    "refunded",
  ],
};
