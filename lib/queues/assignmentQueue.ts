import { Queue } from "bullmq";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const connection = { url: redisUrl };

const QUEUE_NAME = "assignment-queue";

export { QUEUE_NAME };
export { connection };

let queue: Queue | null = null;

export function getAssignmentQueue() {
  if (queue) return queue;
  queue = new Queue(QUEUE_NAME, { connection });
  return queue;
}

