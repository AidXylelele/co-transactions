import { RedisUtil } from "src/utils/redis.utils";
import { channels } from "src/consts/channels.const";
import { Channels } from "src/types/redis.types";
import { TransactionManager } from "src/utils/transaction.utils";
import transactionManager from "paypal-rest-sdk";

export class TransactionService {
  private channels: Channels;
  private redis: RedisUtil;
  private transactionManager: TransactionManager;

  constructor(client: any) {
    this.channels = channels;
    this.redis = new RedisUtil(client);
    this.transactionManager = new TransactionManager(transactionManager);
  }

  async createDeposit(message: string) {
    const { email, transactions } = this.redis.parse(message);
    const request = this.transactionManager.createDepositRequest(transactions);
    const payment = await this.transactionManager.createPayment(request);
    const href = this.transactionManager.getApprovalUrl(payment);
    const response = { data: { href } };
    this.redis.publish(this.channels.deposit.approve, response);
    await this.redis.update(email, { pendingTransactions: [payment] });
  }

  async createWithdraw(message: string) {
    const { email, transactions } = this.redis.parse(message);
    const request = this.transactionManager.createWithdrawRequest(transactions);
    const payout = await this.transactionManager.createPayout(request);
    this.redis.publish(this.channels.withdraw.create, payout);
    await this.redis.update(email, { pendingTransactions: [payout] });
  }

  async checkTransactions() {
    const users = await this.redis.getAll();
    for (const user of users) {
      const transactions = user.pendingTransactions;
      await Promise.all(
        transactions.map(this.transactionManager.processTransaction)
      );
    }
  }
}
