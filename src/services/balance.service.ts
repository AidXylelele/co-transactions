import { Redis } from "ioredis";
import { RedisUtil } from "src/utils/redis.utils";
import { TransactionUtil } from "src/utils/transaction.utils";
import { balanceChannels } from "src/consts/redis.const";

export class BalanceService extends RedisUtil {
  private util: TransactionUtil;

  constructor(sub: Redis, pub: Redis, pool: Redis) {
    super(sub, pub, pool, balanceChannels);
    this.util = new TransactionUtil();
  }

  async getBalance(email: string) {
    const user = await this.get(email);
    return user.balance;
  }

  async updateBalance(email: string) {
    const user = await this.get(email);
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

    await this.update(email, { balance });
  }
}
