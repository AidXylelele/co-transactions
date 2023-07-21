require("dotenv").config();
import cron from "node-cron";
const { Redis } = require("ioredis");
import { config } from "./config/redis.config";
import { BalanceService } from "./services/balance.service";
import { TransactionService } from "./services/transaction.service";
import { balanceWorkerQueue } from "./queues/balance.queue";
import { redisChannels } from "./consts/redis.const";

const channels = redisChannels.requests;

const sub = new Redis(config);
const pub = new Redis(config);
const pool = new Redis(config);

const transactionService = new TransactionService(sub, pub, pool);
const balanceService = new BalanceService(sub, pub, pool);

cron.schedule("* * * * *", () => {
  const data = { transactionService, balanceService };
  balanceWorkerQueue.push(data);
});

sub.subscribe(channels.deposit.create);
sub.subscribe(channels.deposit.approve);
sub.subscribe(channels.deposit.execute);
sub.subscribe(channels.withdraw.create);
sub.subscribe(channels.balance.check);

sub.on("message", async (channel: string, message: string) => {
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
