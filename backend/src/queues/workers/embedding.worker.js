// import { Worker } from "bullmq";
// import {bullMQConnection} from "../../config/redis.js";
// import { generateEmbedding } from "../../services/ai.service.js";
// import itemModel from "../../models/item.model.js";

// const embeddingWorker = new Worker(
//   "item-processing",  // Same queue naam
//   async (job) => {
    
//     // Sirf apna job handle karo
//     if (job.name !== "generateEmbedding") return;

//     const { itemId, title, description } = job.data;
//     console.log(`Generating embedding for item: ${itemId}`);

//     // Title + description combine karo — better embedding
//     const text = `${title} ${description}`;
//     const embedding = await generateEmbedding(text);

//     // Embedding aur status update karo
//     await itemModel.findByIdAndUpdate(itemId, {
//       embedding,
//       status: embedding.length > 0 ? "ready" : "failed",
//     });

//     console.log(`Embedding done for item: ${itemId}, length: ${embedding.length}`);
//   },
//   { connection: bullMQConnection }
// );

// // Error handling
// embeddingWorker.on("failed", async (job, error) => {
//   console.error(`Embedding failed for item ${job.data.itemId}:`, error.message);
//   // Status failed mark karo
//   await itemModel.findByIdAndUpdate(job.data.itemId, {
//     status: "failed",
//   });
// });

// export default embeddingWorker;



















import { Worker } from "bullmq";
import { bullMQConnection } from "../../config/redis.js";
import { generateEmbedding } from "../../services/ai.service.js";
import itemModel from "../../models/item.model.js";

const embeddingWorker = new Worker(
  "embedding-queue",
  async (job) => {
    const { itemId, title, description } = job.data;
    console.log(`Generating embedding for item: ${itemId}`);

    // Fallback text agar dono empty hoon
    const safeTitle = title?.trim() || "untitled content";
    const safeDescription = description?.trim() || safeTitle;
    const text = `${safeTitle} ${safeDescription}`.trim();

    const embedding = await generateEmbedding(text);

    if (!embedding || embedding.length === 0) {
      // Retry ke liye error throw karo — BullMQ retry karega
      throw new Error(`Embedding returned empty for item ${itemId}. Will retry.`);
    }

    await itemModel.findByIdAndUpdate(itemId, {
      embedding,
      status: "ready",   // embedding success pe bhi "ready" set karo
    });

    console.log(`Embedding done for item: ${itemId}, length: ${embedding.length}`);
  },
  { connection: bullMQConnection }
);

embeddingWorker.on("failed", async (job, error) => {
  console.error(`Embedding failed for item ${job.data.itemId}:`, error.message);
  // Embedding fail hone pe status touch mat karo —
  // tagging worker "ready" set karega apni taraf se
  // Sirf log karo, status "failed" mat karo jab tak tagging bhi fail na ho
});

export default embeddingWorker;