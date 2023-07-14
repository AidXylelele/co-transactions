import paypal, { Link, PayPalError } from "paypal-rest-sdk";
import {
  DepositRequest,
  ExecutionData,
  Transaction,
  WithdrawRequest,
  WithdrawTransaction,
} from "src/types/paypal.types";

class PaymentEntity {
  private api: any;

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
    return this.createRequest(this.api.payment.create, request);
  }

  createPayout(request: WithdrawRequest): Promise<any> {
    return this.createRequest(this.api.payout.create, request);
  }

  executePayment(data: ExecutionData): Promise<any> {
    const { payer_id, paymentId } = data;
    return this.createRequest(this.api.payment.execute, { paymentId, payer_id });
  }

  private createRequest(apiMethod: any, request: any): Promise<any> {
    return new Promise((resolve, reject) => {
      apiMethod(request, (error: PayPalError, response: any) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
  }
}

class ProcessingPayment {
  private api: any;

  constructor(api: any) {
    this.api = api;
  }

  getApprovalUrl(links: Link[]): string | undefined {
    return links.find((link: Link) => link.rel === "approval_url")?.href;
  }

  async getStatus(type: string, id: string) {
    return new Promise((resolve, reject) => {
      this.api[type].get(id, (error: PayPalError, transaction: any) => {
        if (error) reject(error);
        resolve(transaction);
      });
    });
  }

  async processTransaction(transaction: any) {
    const { type, id } = this.getTransactionDetails(transaction);
    await this.getStatus(type, id);
  }

  getTransactionDetails(transaction: any) {
    const hasId = Object(transaction).hasOwnProperty("id");

    if (hasId) {
      return {
        type: "payment",
        id: transaction.id,
      };
    }

    return {
      type: "payout",
      id: transaction.batch_header.payout_batch_id,
    };
  }
}

export class PayPalUtils {
  private entity: any;
  private processing: any;

  constructor() {
    this.entity = new PaymentEntity(paypal);
    this.processing = new ProcessingPayment(paypal);
  }
}
