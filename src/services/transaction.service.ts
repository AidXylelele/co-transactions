import { Redis } from "ioredis";
import { RedisUtil } from "src/utils/redis.utils";
import { redisChannels } from "src/consts/redis.const";
import { TransactionUtil } from "src/utils/transaction.utils";
import { ChannelsCollection } from "src/types/redis.types";
import { DepositRequest, WithdrawRequest } from "src/types/paypal.types";

export class TransactionService {
  private channels: ChannelsCollection;
  private util: TransactionUtil;
  private redis: RedisUtil;

  constructor(sub: Redis, pub: Redis, pool: Redis) {
    this.channels = redisChannels.response;
    this.util = new TransactionUtil();
    this.redis = new RedisUtil(sub, pub, pool);
  }

  async createDeposit(message: string) {
    const { email, transactions } = this.redis.parse(message);
    const request = this.util.createRequest(DepositRequest, transactions);
    const payment = await this.util.createPayment(request);
    const href = this.util.getApprovalUrl(payment);
    const response = { data: { href } };
    this.redis.publish(this.channels.deposit.approve, response);
    await this.redis.inject(email, { pending: [payment] });
  }

  async executeDeposit(message: string) {
    const executionData = this.redis.parse(message);
    await this.util.executePayment(executionData);
  }

  async createWithdraw(message: string) {
    const { email, transactions } = this.redis.parse(message);
    const request = this.util.createRequest(WithdrawRequest, transactions);
    const payout = await this.util.createPayout(request);
    await this.redis.inject(email, { pending: [payout] });
  }

  async checkTransactions(cb: (arg: string) => Promise<void>) {
    const records = await this.redis.getAll();
    for (const email in records) {
      const account = records[email];
      const sortedTransactions = this.util.sortByStates(account.pending);
      const { resolved, rejected, pending } = sortedTransactions;
      await this.redis.update(email, { pending });
      await this.redis.inject(email, { resolved, rejected });
      await cb(email);
    }
  }
}
