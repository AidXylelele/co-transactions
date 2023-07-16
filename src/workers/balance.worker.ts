const { parentPort, workerData } = require("worker_threads");

const updateBalance = async (workerData: any, parentPort: any) => {
  const { transactionService, balanceService } = workerData;
  const callback = balanceService.update;
  await transactionService.check(callback);
};
