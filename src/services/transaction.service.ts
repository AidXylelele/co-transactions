import { RedisUtil } from "src/utils/redis.utils";
import { channels } from "src/consts/channels.const";
import { Channels } from "src/types/redis.types";
import { PayPalUtils } from "src/utils/payment.utils";

//Refactore and make the best structure of this service;
//Split all paypal.types
//Refactor redis.utils
//It is required to make something with subscriber in index!

export class TransactionService {
  private api: any;
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
    // Important:: save the transaction in redis (Use que for the user transactions!)
  }
}
