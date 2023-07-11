import { Channels } from "src/types/redis.types";

export const channels: Channels = {
  error: "transaction:error",
  create: "transaction:create",
  cancel: "transaction:cancel",
};
