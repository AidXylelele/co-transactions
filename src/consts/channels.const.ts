import { Channels } from "src/types/redis.types";

export const channels: Channels = {
  deposit: "deposit:create",
  withdraw: "withdraw:create",
  error: "transaction:error",
  success: "transaction:success",
  cancel: "transaction:cancel",
};
