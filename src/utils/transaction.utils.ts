import { Link, PayPalError } from "paypal-rest-sdk";
import {
  DepositRequest,
  ExecutionData,
  Transaction,
  WithdrawRequest,
  WithdrawTransaction,
} from "src/types/paypal.types";

const promisify = (fn: any, request: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    fn(request, (error: PayPalError, response: any) => {
      if (error) {
        reject(error);
      }
      resolve(response);
    });
  });
};

class TransactionEntity {
  public api: any;

  constructor(api: any) {
    this.api = api;
  }

  createDepositRequest(transactions: Transaction[]): DepositRequest {
    return new DepositRequest(transactions);
  }

  createWithdrawRequest(transactions: WithdrawTransaction[]): WithdrawRequest {
    return new WithdrawRequest(transactions);
  }

  createPayment(request: DepositRequest): Promise<any> {
    const callback = this.api.payment.create;
    return promisify(callback, request);
  }

  createPayout(request: WithdrawRequest): Promise<any> {
    const callback = this.api.payout.create;
    return promisify(callback, request);
  }

  executePayment(data: ExecutionData): Promise<any> {
    const { payer_id, paymentId } = data;
    const callback = this.api.payment.execute;
    return promisify(callback, { paymentId, payer_id });
  }
}

export class TransactionManager extends TransactionEntity {
  constructor(api: any) {
    super(api);
  }

  getApprovalUrl(links: Link[]): string | undefined {
    return links.find((link: Link) => link.rel === "approval_url")?.href;
  }

  getTransactionStatus(type: string, id: string) {
    return promisify(this.api[type].get, id);
  }

  async processTransaction(transaction: any) {
    const { transactionType, transactionId } =
      this.extractTransactionDetails(transaction);
    await this.getTransactionStatus(transactionType, transactionId);
  }

  extractTransactionDetails(transaction: any) {
    const hasId = Object(transaction).hasOwnProperty("id");

    if (hasId) {
      return {
        transactionType: "payment",
        transactionId: transaction.id,
      };
    }

    return {
      transactionType: "payout",
      transactionId: transaction.batch_header?.payout_batch_id,
    };
  }
}
