require("dotenv").config();
const { Redis } = require("ioredis");
import { config } from "./config/redis.config";
import { channels } from "./consts/channels.const";
import { TransactionService } from "./services/transaction.service";

const client = new Redis(config);
const subscriber = new Redis(config);

const transactionService = new TransactionService(client);

subscriber.subscribe(channels.deposit.create);
subscriber.subscribe(channels.deposit.approve);
subscriber.subscribe(channels.deposit.execute);

subscriber.on("message", async (channel: string, message: string) => {
  if (channel === channels.deposit.create) {
    await transactionService.createDeposit(message);
  }

  if (channel === channels.deposit.execute) {
    transactionService.executeDeposit(message);
  }
});

subscriber.subscribe(channels.withdraw.create);
