import Queue from "better-queue";
import { Worker } from "node:worker_threads";
import { WorkerData } from "src/types/worker.types";
import { WORKER_PATH } from "src/consts/balance.const";

export const balanceWorkerQueue = new Queue(
  (workerData: WorkerData, cb: any) => {
    const worker = new Worker(WORKER_PATH, { workerData });

    worker.on("exit", () => {
      cb();
    });
  }
);
