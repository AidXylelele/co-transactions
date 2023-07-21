import { Redis } from "ioredis";
import { RedisUtil } from "src/utils/redis.utils";
import { TransactionUtil } from "src/utils/transaction.utils";

export class BalanceService {
  private redis: RedisUtil;
  private util: TransactionUtil;

  constructor(sub: Redis, pub: Redis, pool: Redis) {
    this.util = new TransactionUtil();
    this.redis = new RedisUtil(sub, pub, pool);
  }

  async get(email: string) {
    const user = await this.redis.get(email);
    return user.balance;
  }

  async update(email: string) {
    const user = await this.redis.get(email);
    const transactions = user.resolved;
    let balance = user.balance;

    for (const item of transactions) {
      const { type } = this.util.extractDetails(item);

      if (type === "payment") {
        const { total } = item.transactions[0].amount;
        balance += Number(total);
      }

      if (type === "payout") {
        const { value } = item.items[0].amount;
        balance += Number(value);
      }
    }

    await this.redis.update(email, { balance });
  }
}
