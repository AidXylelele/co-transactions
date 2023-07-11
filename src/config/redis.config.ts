import { RedisConfig } from "src/types/redis.types";


export const config: RedisConfig = {
  port: 6379,
  host: "redis",
  username: "admin", // needs Redis >= 6
  password: "1234",
  db: 0, // Defaults to 0
};
