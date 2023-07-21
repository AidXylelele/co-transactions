import { Link } from "paypal-rest-sdk";
import { transactionStates } from "src/consts/transaction.const";
import { RequestUtil } from "./request.util";
import {
  DepositDetails,
  PaymentInstance,
  PayoutInstance,
  TransactionStates,
  WithdrawDetails,
} from "src/types/paypal.types";

export class TransactionUtil extends RequestUtil {
  public successfulStates: string[];
  private states: TransactionStates;

  constructor() {
    super();
    this.states = transactionStates;
  }

  getApprovalUrl(links: Link[]): string | undefined {
    return links.find((link: Link) => link.rel === "approval_url")?.href;
  }

  async getStates(transactions: any[]) {
    const result = [];
    for (const item of transactions) {
      const { type, id } = this.extractDetails(item);
      result.push(this.promisify(this.api[type].get, id));
    }
    return await Promise.all(result);
  }

  sortByStates(transactions: any[]) {
    const { success, error } = this.states;
    const resolved = [];
    const rejected = [];
    const pending = [];

    for (const item of transactions) {
      const { state } = this.extractDetails(item);

      if (success.includes(state)) {
        resolved.push(item);
        continue;
      }

      if (error.includes(state)) {
        rejected.push(state);
        continue;
      }

      pending.push(item);
    }

    return { resolved, rejected, pending };
  }

  extractDetails(transaction: PaymentInstance | PayoutInstance) {
    if ("id" in transaction) {
      return new DepositDetails(transaction);
    }

    if ("batch_header" in transaction) {
      return new WithdrawDetails(transaction);
    }
  }
}
