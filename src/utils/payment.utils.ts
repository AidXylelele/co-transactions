import {
  DepositRequest,
  Transaction,
  WithdrawRequest,
  WithdrawTransaction,
} from "src/types/paypal.types";

export class PaymentUtils {
  
  static createDeposit(transactions: Transaction[]): DepositRequest {
    return new DepositRequest(transactions);
  }
  static createWithdraw(transactions: WithdrawTransaction[]) {
    return new WithdrawRequest(transactions);
  }
}
