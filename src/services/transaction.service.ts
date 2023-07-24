import { Redis } from "ioredis";
import { RedisUtil } from "src/utils/redis.utils";
import { TransactionUtil } from "src/utils/transaction.utils";
import { transactionChannels } from "src/consts/redis.const";
import { DepositRequest, WithdrawRequest } from "src/types/paypal.types";

export class TransactionService extends RedisUtil {
  private util: TransactionUtil;

  constructor(sub: Redis, pub: Redis, pool: Redis) {
    super(sub, pub, pool, transactionChannels);
    this.util = new TransactionUtil();
  }

  async createDeposit(message: string) {
    const { email, transactions } = this.parse(message);
    const request = this.util.createRequest(DepositRequest, transactions);
    const payment = await this.util.createPayment(request);
    const href = this.util.getApprovalUrl(payment);
    const response = { data: { href } };
    const channel = this.channels.responses.deposit.approve;
    this.publish(channel, response);
    await this.inject(email, { pending: [payment] });
  }

  async executeDeposit(message: string) {
    const executionData = this.parse(message);
    await this.util.executePayment(executionData);
  }

  async createWithdraw(message: string) {
    const { email, transactions } = this.parse(message);
    const request = this.util.createRequest(WithdrawRequest, transactions);
    const payout = await this.util.createPayout(request);
    await this.inject(email, { pending: [payout] });
  }

  async checkTransactions(cb: (arg: string) => Promise<void>) {
    const records = await this.getAll();
    for (const email in records) {
      const account = records[email];
      const sortedTransactions = this.util.sortByStates(account.pending);
      const { resolved, rejected, pending } = sortedTransactions;
      await this.update(email, { pending });
      await this.inject(email, { resolved, rejected });
      await cb(email);
    }
  }
}
