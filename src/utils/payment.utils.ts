import paypal, { Link, PayPalError } from "paypal-rest-sdk";
import {
  DepositRequest,
  ExecutionData,
  Transaction,
  WithdrawRequest,
  WithdrawTransaction,
} from "src/types/paypal.types";

export class PayPalUtils {
  private api: any;

  constructor() {
    this.api = paypal;
  }

  createPayment(request: DepositRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.payment.create(request, (error: PayPalError, payment: any) => {
        if (error) {
          reject(error);
        }
        resolve(payment);
      });
    });
  }

  executePayment(data: ExecutionData): Promise<any> {
    const { payer_id, paymentId } = data;
    return new Promise((resolve, reject) => {
      this.api.payment.execute(
        paymentId,
        { payer_id },
        (error: PayPalError, payment: any) => {
          if (error) {
            reject(error);
          }
          resolve(payment);
        }
      );
    });
  }

  createDepositRequest(transactions: Transaction[]): DepositRequest {
    return new DepositRequest(transactions);
  }

  createWithdrawRequest(transactions: WithdrawTransaction[]): WithdrawRequest {
    return new WithdrawRequest(transactions);
  }

  getApprovalUrl(links: Link[]): string | undefined {
    return links.find((link: Link) => link.rel === "approval_url")?.href;
  }
}
