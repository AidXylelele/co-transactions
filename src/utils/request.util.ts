import paypal from "paypal-rest-sdk";
import { paypalConfig } from "src/confs/paypal.config";
import { Initializable } from "src/types/common.types";
import {
  ApprovalData,
  DepositRequest,
  PromisifiedFunction,
  WithdrawRequest,
} from "src/types/paypal.types";

export class RequestUtil {
  public api: any;

  constructor() {
    this.api = paypal.configure(paypalConfig);
  }

  promisify<T>(fn: PromisifiedFunction<T>, request: any): Promise<T> {
    return new Promise((resolve, reject) => {
      fn(request, (error: any, response: T) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  createRequest<A, B>(type: Initializable<A, B>, item: B) {
    return new type(item);
  }

  createPayment(request: DepositRequest): Promise<any> {
    const callback = this.api.payment.create;
    return this.promisify<any>(callback, request);
  }

  createPayout(request: WithdrawRequest): Promise<any> {
    const callback = this.api.payout.create;
    return this.promisify<any>(callback, request);
  }

  executePayment(input: ApprovalData) {
    const { PayerID, paymentId } = input;
    const callback = this.api.payment.execute;
    const executionData = { paymentId, payer_id: PayerID };
    return this.promisify<any>(callback, executionData);
  }
}
