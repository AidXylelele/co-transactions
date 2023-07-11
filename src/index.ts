require("dotenv").config();
const { Redis } = require("ioredis");
import { config } from "./config/redis.config";
import { channels } from "./consts/channels.const";

const client = new Redis(config);
const subscriber = new Redis(config);

subscriber.subscribe(channels.register);

subscriber.on("message", async (channel: string, message: string) => {
  if (channel === channels.create) {
  }
});

subscriber.subscribe(channels.login);

subscriber.on("message", async (channel: string, message: string) => {
  
});
