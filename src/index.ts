require("dotenv").config();
const { Redis } = require("ioredis");
import { config } from "./config/redis.config";
import { channels } from "./consts/channels.const";
import { TransactionService } from "./services/transaction.service";

const client = new Redis(config);
const subscriber = new Redis(config);

subscriber.subscribe(channels.deposit);

const transactionService = new TransactionService(client);

subscriber.on("message", async (channel: string, message: string) => {
  if (channel === channels.deposit) {
    transactionService.createDeposit(message);
  }
});

subscriber.subscribe(channels.withdraw);

subscriber.on("message", async (channel: string, message: string) => {
  if (channel === channels.withdraw) {
  }
});
