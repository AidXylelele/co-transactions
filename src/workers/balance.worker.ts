import { WorkerData } from "src/types/worker.types";
const { workerData } = require("worker_threads");

const updateBalance = async (workerData: WorkerData) => {
  const { transactionService, balanceService } = workerData;
  await transactionService.checkTransactions(balanceService.update);
};

updateBalance(workerData);
