import { RedisUtil } from "src/utils/redis.utils";
import { TransactionManager } from "src/utils/transaction.utils";
import paypal from "paypal-rest-sdk";

export class BalanceService {
  public redis: any;
  public transactionManager: TransactionManager;
  
  constructor(client: any) {
    this.redis = new RedisUtil(client);
    this.transactionManager = new TransactionManager(paypal);
  }

  async get(email: string) {
    const { balance } = await this.redis.get(email);
    return balance;
  }

  async update(email: string, transfers: any[]) {
    const updations = [];
    const user = await this.redis.get(email);
    let balance = user.balance;

    for (const transfer of transfers) {
      const { type } = this.transactionManager.extractDetails(transfer);

      if (type === "payment") {
        const { total } = transfer.transactions[0].amount;
        balance += Number(total);
      } else {
        const { value } = transfer.items[0].amount;
        balance -= Number(value);
      }
      updations.push(this.redis.update(email, { balance }));
    }

    return await Promise.all(updations);
  }
}
