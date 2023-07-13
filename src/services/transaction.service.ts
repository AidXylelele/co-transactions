import { RedisUtil } from "src/utils/redis.utils";
import { channels } from "src/consts/channels.const";
import { Channels } from "src/types/redis.types";
import { PayPalUtils } from "src/utils/payment.utils";

export class TransactionService {
  private channels: Channels;
  private redis: RedisUtil;
  private paypal: PayPalUtils;

  constructor(client: any) {
    this.channels = channels;
    this.redis = new RedisUtil(client);
    this.paypal = new PayPalUtils();
  }

  async createDeposit(message: string) {
    const { email, transactions } = this.redis.parse(message);
    const request = this.paypal.createDepositRequest(transactions);
    const payment = await this.paypal.createPayment(request);
    const href = this.paypal.getApprovalUrl(payment);
    const response = { data: { href } };
    this.redis.publish(this.channels.deposit.approve, response);
    await this.redis.update(email, { pending: transactions });
  }
}
