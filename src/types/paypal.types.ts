export type PayPalConfig = {
  mode: string;
  client_id: string;
  client_secret: string;
};

export type TransactionStates = {
  success: string[];
  error: string[];
};


export type ExecutionData = {
  payer_id: string;
  paymentId: string;
};

export type Transaction = {
  amount: {
    total: number;
    currency: string;
  };
};

export class WithdrawTransaction {
  readonly recipient_type: "EMAIL";
  readonly amount: Transaction;
  readonly reciever: string;
  readonly note: string;
  constructor(amount: Transaction, reciever: string, note: string) {
    this.amount = amount;
    this.reciever = reciever;
    this.note = note;
  }
}

export class DepositRequest {
  readonly intent = "sale";

  readonly payer = {
    payment_method: "paypal",
  };

  readonly redirect_urls: {
    return_url: "http://your-website.com/succes";
    cancel_url: "http://your-website.com/cancel";
  };

  readonly transactions: Transaction[];

  constructor(transactions: Transaction[]) {
    this.transactions = transactions;
  }
}

export class WithdrawRequest {
  readonly sender_batch_header: {
    sender_batch_id: string;
    email_subject: "Withdrawal from Web Wallet";
  };

  readonly items: WithdrawTransaction[];

  constructor(items: WithdrawTransaction[]) {
    this.items = items;
    this.sender_batch_header.sender_batch_id = crypto.randomUUID();
  }
}
