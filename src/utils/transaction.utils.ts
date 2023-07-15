import { Link, PayPalError } from "paypal-rest-sdk";
import { transactionStates } from "src/consts/transaction.const";
import {
  DepositRequest,
  ExecutionData,
  Transaction,
  TransactionStates,
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
  public successfulStates: string[];
  private states: TransactionStates;

  constructor(api: any) {
    super(api);
    this.states = transactionStates;
  }

  getApprovalUrl(links: Link[]): string | undefined {
    return links.find((link: Link) => link.rel === "approval_url")?.href;
  }

  async getStates(transactions: any[]) {
    const result = [];
    for (const item of transactions) {
      const { type, id } = this.extractDetails(item);
      result.push(promisify(this.api[type].get, id));
    }
    return await Promise.all(result);
  }

  manageStates(transactions: any[]) {
    const resolved = [];
    const rejected = [];
    const pending = [];

    for (const item of transactions) {
      const { state } = this.extractDetails(item);
      if (this.states.success.includes(state)) {
        resolved.push(item);
      }

      if (this.states.error.includes(state)) {
        rejected.push(state);
      }

      pending.push(item);
    }
    return { resolved, rejected, pending };
  }

  extractDetails(transaction: any) {
    const hasId = Object(transaction).hasOwnProperty("id");

    if (hasId) {
      return {
        type: "payment",
        id: transaction.id,
        state: transaction.state,
      };
    }

    return {
      type: "payout",
      id: transaction.batch_header?.payout_batch_id,
      state: transaction.batch_header.batch_status,
    };
  }
}
