import { RedisUtil } from "src/utils/redis.utils";
import paypal, { Link, PayPalError, Payment } from "paypal-rest-sdk";
import { PaymentUtils } from "src/utils/payment.utils";
import { channels } from "src/consts/channels.const";
import { Channels } from "src/types/redis.types";

class TransactionService extends RedisUtil {
  private api: any;
  private client: any;
  private channels: Channels;

  constructor(client: any) {
    super();
    this.api = paypal;
    this.client = client;
    this.channels = channels;
  }

  handleTransaction(error: PayPalError, data: any) {
    if (error) {
      return this.client.publish(this.channels.error, error);
    }

    if (data.links) {
      const { links } = data;
      const { href } = links.find((l: Link) => l.rel === "approval_url");
      const response = this.stringify({ data: { href } });
      return this.client.publish(this.channels.deposit, response);
    }
    const response = this.stringify(data);
    return this.client.publish(this.channels.withdraw, response);
  }

  deposit(message: string) {
    const transactions = this.parse(message);
    const request = PaymentUtils.createDeposit(transactions);
    this.api.payment.create(request, this.handleTransaction);
  }
  withdraw(message: string) {}
}
