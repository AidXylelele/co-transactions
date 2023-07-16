require("dotenv").config();
import cron from "node-cron";
const { Redis } = require("ioredis");
import { config } from "./config/redis.config";
import { channels } from "./consts/channels.const";
import { BalanceService } from "./services/balance.service";
import { TransactionService } from "./services/transaction.service";
import { balanceWorkerQueue } from "./queues/balance.queue";

const client = new Redis(config);
const subscriber = new Redis(config);

const transactionService = new TransactionService(client);
const balanceService = new BalanceService(client);

cron.schedule("* * * * * ", () => {
  const data = { transactionService, balanceService };
  balanceWorkerQueue.push(data);
});

subscriber.subscribe(channels.deposit.create);
subscriber.subscribe(channels.deposit.approve);
subscriber.subscribe(channels.deposit.execute);
subscriber.subscribe(channels.withdraw.create);
subscriber.subscribe(channels.balance.check);

subscriber.on("message", async (channel: string, message: string) => {
  if (channel === channels.deposit.create) {
    await transactionService.createDeposit(message);
  }

  if (channel === channels.deposit.execute) {
    await transactionService.executeDeposit(message);
  }

  if (channel === channels.withdraw.create) {
    await transactionService.createWithdraw(message);
  }

  if (channel === channels.balance.check) {
    await balanceService.get(message);
  }
  
});
