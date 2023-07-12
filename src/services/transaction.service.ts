import { RedisUtil } from "src/utils/redis.utils";
import paypal, { PayPalError } from "paypal-rest-sdk";
import { PaymentUtil } from "src/utils/payment.utils";
import { channels } from "src/consts/channels.const";
import { Channels } from "src/types/redis.types";

//Все данные запаковывать в объект в поле data!!!

// Реализовать добавление данных в запись пользователя в бд(обновление транзакций, увелечение/уменьшение счета)
// Переписать TransactionService, RedisUtil

export class TransactionService extends RedisUtil {
  private api: any;
  private channels: Channels;

  constructor(client: any) {
    super(client);
    this.api = paypal;
    this.client = client;
    this.channels = channels;
  }

  handleTransaction(error: PayPalError, data: any) {
    const { deposit, transaction, withdraw } = this.channels;

    if (error) {
      return this.publish(transaction.error, error);
    }

    if (data.links) {
      const href = PaymentUtil.getApprovalUrl(data.links);
      const response = { data: { href } };
      return this.publish(deposit.approve, response);
    }

    return this.publish(withdraw.create, data);
  }

  async createDeposit(message: string) {
    const { transactions, email } = this.parse(message);
    const request = PaymentUtil.createDepositRequest(transactions);
    this.api.payment.create(request, this.handleTransaction);
    await this.update(email, transactions);
  }

  createWithdraw(message: string) {}

  executeDeposit(message: string) {
    const { payerId, email, paymentId } = this.parse(message);
    this.api.payment.execute(paymentId, { payer_id: payerId });
  }
}
