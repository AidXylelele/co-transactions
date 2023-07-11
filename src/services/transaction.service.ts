import { RedisUtil } from "src/utils/redis.utils";
import paypal, { PayPalError } from "paypal-rest-sdk";
import { PaymentUtil } from "src/utils/payment.utils";
import { channels } from "src/consts/channels.const";
import { Channels } from "src/types/redis.types";

//2-Дописать и исправить код PaymentUtils(изменить названия методов, так как фактически тут просто
// создается информация о транзакции)
//3-Дописать функционал для сохранения переводов в базе данных и правильно реализовать переводы (вызов платежа и тд)
//4-Переписать на TypeScript другие два сервиса используя в co-frontend очередь для обработки sub.on
//5-Написать фронтенд часть для этого проекта

class TransactionService extends RedisUtil {
  private api: any;
  private channels: Channels;

  constructor(client: any) {
    super(client);
    this.api = paypal;
    this.client = client;
    this.channels = channels;
  }

  handleTransaction(error: PayPalError, data: any) {
    if (error) {
      const channel = this.channels.error;
      return this.publish(channel, error);
    }

    if (data.links) {
      const href = PaymentUtil.getApprovalUrl(data.links);
      const response = { data: { href } };
      const channel = this.channels.deposit;
      return this.publish(channel, response);
    }

    const channel = this.channels.withdraw;
    return this.publish(channel, data);
  }

  deposit(message: string) {
    const transactions = this.parse(message);
    const request = PaymentUtil.createDepositRequest(transactions);
    this.api.payment.create(request, this.handleTransaction);
  }

  withdraw(message: string) {}
}
