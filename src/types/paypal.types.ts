export type PayPalConnection = {
  mode: string;
  client_id: string;
  client_secret: string;
};

export type DepositTransaction = {
  amount: {
    total: number;
    currency: string;
  };
};

export class DepositRequest {
  readonly intent = "sale";
  readonly transactions: DepositTransaction[];
  readonly payer = {
    payment_method: "paypal",
  };
  readonly redirect_urls: {
    return_url: "http://your-website.com/succes";
    cancel_url: "http://your-website.com/cancel";
  };

  constructor(transactions: DepositTransaction[]) {
    this.transactions = transactions;
  }
}

export type WithdrawAmount = {
  total: number;
  currency: string;
};

export class WithdrawItem {
  readonly recipient_type: "EMAIL";
  readonly amount: WithdrawAmount;
  readonly reciever: string;
  readonly note: string;
  constructor(amount: WithdrawAmount, reciever: string, note: string) {
    this.amount = amount;
    this.reciever = reciever;
    this.note = note;
  }
}

export class WithdrawRequest {
  readonly items: WithdrawItem[];
  readonly sender_batch_header: {
    sender_batch_id: string;
    email_subject: "Withdrawal from Web Wallet";
  };

  constructor(items: WithdrawItem[]) {
    this.items = items;
    this.sender_batch_header.sender_batch_id = crypto.randomUUID();
  }
}

export class DepositDetails {
  readonly type: "payment";
  readonly id: string;
  readonly state: string;
  constructor(payment: any) {
    this.id = payment.id;
    this.state = payment.state;
  }
}

export class WithdrawDetails {
  readonly type = "payout";
  readonly id: string;
  readonly state: string;
  constructor(payout: any) {
    this.id = payout.batch_header?.payout_batch_id;
    this.state = payout.batch_header.batch_status;
  }
}

export type CallbackFunction = (error: any, response: any) => void;

export type PromisifiedFunction<T> = (
  request: T,
  callback: CallbackFunction
) => Promise<any>;

export type ApprovalData = {
  PayerID: string;
  paymentId: string;
};

export type TransactionStates = {
  success: string[];
  error: string[];
};

export type PaymentInstance = any;

export type PayoutInstance = any;
