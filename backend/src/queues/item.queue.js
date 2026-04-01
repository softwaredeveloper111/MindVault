import { Queue } from "bullmq";
import { bullMQConnection } from "../config/redis.js";

const defaultJobOptions = {
  attempts: 5,             // 3 se badhakar 5 — rate limit pe zyada chances
  backoff: {
    type: "exponential",
    delay: 5000,           // 2000 se badhakar 5000 — 5s, 10s, 20s, 40s, 80s
  },
  removeOnComplete: true,
  removeOnFail: false,
};

const taggingQueue = new Queue("tagging-queue", {
  connection: bullMQConnection,
  defaultJobOptions,
});

const embeddingQueue = new Queue("embedding-queue", {
  connection: bullMQConnection,
  defaultJobOptions,
});


export const addTaggingJob = async (itemId, title, description) => {
  const job = await taggingQueue.add("generateTags", { itemId, title, description });
  console.log("Tagging job added:", job.id);
};

export const addEmbeddingJob = async (itemId, title, description) => {
  const job = await embeddingQueue.add("generateEmbedding", { itemId, title, description });
  console.log("Embedding job added:", job.id);
};

export { taggingQueue, embeddingQueue };