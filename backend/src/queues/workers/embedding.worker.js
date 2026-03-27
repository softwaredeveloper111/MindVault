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
  "embedding-queue",   // Apni dedicated queue
  async (job) => {
    const { itemId, title, description } = job.data;
    console.log(`Generating embedding for item: ${itemId}`);

    const text = `${title} ${description}`;
    const embedding = await generateEmbedding(text);

    await itemModel.findByIdAndUpdate(itemId, {
      embedding,
    });

    console.log(`Embedding done for item: ${itemId}, length: ${embedding.length}`);
  },
  { connection: bullMQConnection }
);

embeddingWorker.on("failed", async (job, error) => {
  console.error(`Embedding failed for item ${job.data.itemId}:`, error.message);
});

export default embeddingWorker;