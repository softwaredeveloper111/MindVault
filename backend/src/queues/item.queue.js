import { Queue } from "bullmq";
import redis from "../config/redis.js";


// Ek queue — saari jobs isi mein jayengi
const itemQueue = new Queue("item-processing", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,          // Fail hone pe 3 baar try karo
    backoff: {
      type: "exponential",
      delay: 2000,        // 2sec, 4sec, 8sec — retry delay
    },
    removeOnComplete: true, // Complete jobs queue se hata do
    removeOnFail: false,    // Failed jobs rakho — debug ke liye
  },
});


// Job 1 — Tags generate karo
export const addTaggingJob = async (itemId, title, description) => {
  await itemQueue.add("generateTags", { itemId, title, description });
};


// Job 2 — Embedding generate karo
export const addEmbeddingJob = async (itemId, title, description) => {
  await itemQueue.add("generateEmbedding", { itemId, title, description });
};

export default itemQueue;