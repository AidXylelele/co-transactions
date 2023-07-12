import { Channels } from "src/types/redis.types";

export const channels: Channels = {
  deposit: {
    create: "deposit:create",
    approve: "deposit:approve",
    execute: "deposit:execute",
  },
  withdraw: {
    create: "withdraw:create",
  },
  balance: {
    check: "balance:check",
  },
  transaction: {
    error: "transaction:error"
  }
};
