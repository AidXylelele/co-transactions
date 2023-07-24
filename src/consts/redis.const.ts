import { RedisCollection } from "src/types/redis.types";

export const transactionChannels: RedisCollection = {
  deposit: {
    create: ":deposit:create",
    approve: ":deposit:approve",
    execute: ":deposit:execute",
  },
  withdraw: {
    create: ":withdraw:create",
  },
};

export const balanceChannels: RedisCollection = {
  balance: {
    check: ":balance:check",
  },
};
