import { Link } from "paypal-rest-sdk";
import {
  DepositRequest,
  Transaction,
  WithdrawRequest,
  WithdrawTransaction,
} from "src/types/paypal.types";

export class PaymentUtil {
  static getApprovalUrl(links: Link[]): string | undefined {
    return links.find((link: Link) => link.rel === "approval_url")?.href;
  }

  static createDepositRequest(transactions: Transaction[]): DepositRequest {
    return new DepositRequest(transactions);
  }
  
  static createWithdrawRequest(transactions: WithdrawTransaction[]) {
    return new WithdrawRequest(transactions);
  }
}
