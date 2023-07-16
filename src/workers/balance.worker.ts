import { WorkerData } from "src/types/worker.types";
const { workerData } = require("worker_threads");

const updateBalance = async (workerData: WorkerData) => {
  const { transactionService, balanceService } = workerData;
  const callback = balanceService.update;
  await transactionService.check(callback);
};

updateBalance(workerData);
