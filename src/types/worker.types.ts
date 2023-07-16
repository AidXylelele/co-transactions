import { BalanceService } from "src/services/balance.service";
import { TransactionService } from "src/services/transaction.service";

export type WorkerData = {
    transactionService: TransactionService;
    balanceService: BalanceService;
  };
  