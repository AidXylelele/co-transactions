import { RedisChannels } from "src/types/redis.types";

export const redisChannels: RedisChannels = {
  requests: {
    deposit: {
      create: "req:deposit:create",
      approve: "req:deposit:approve",
      execute: "req:deposit:execute",
    },
    withdraw: {
      create: "req:withdraw:create",
    },
    balance: {
      check: "req:balance:check",
    },
  },
  response: {
    deposit: {
      approve: "res:deposit:approve",
    },
    balance: {
      check: "res:balance:check",
    },
  },
};
