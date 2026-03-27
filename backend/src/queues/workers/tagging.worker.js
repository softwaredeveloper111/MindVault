// import { Worker } from "bullmq";
// import {bullMQConnection} from "../../config/redis.js";
// import { generateTags } from "../../services/ai.service.js";
// import itemModel from "../../models/item.model.js";

// const taggingWorker = new Worker(
//   "item-processing",  // Same queue naam
//   async (job) => {

//     // Sirf apna job handle karo
//     if (job.name !== "generateTags") return;

//     const { itemId, title, description } = job.data;
//     console.log(`Generating tags for item: ${itemId}`);

//     // console.log(`Title: ${title}, Description: ${description}`);

//     // AI se tags lo
//     const { tags, topicCluster } = await generateTags(title, description);

//     // Item update karo
//     await itemModel.findByIdAndUpdate(itemId, {
//       tags,
//       topicCluster,
//     });

//     console.log(`Tags done for item: ${itemId}`, tags);
//   },
//   { connection: bullMQConnection }
// );

// // Error handling
// taggingWorker.on("failed", async (job, error) => {
//   console.error(`Tagging failed for item ${job.data.itemId}:`, error.message);
// });

// export default taggingWorker;

























import { Worker } from "bullmq";
import { bullMQConnection } from "../../config/redis.js";
import { generateTags } from "../../services/ai.service.js";
import itemModel from "../../models/item.model.js";

const taggingWorker = new Worker(
  "tagging-queue",   // Apni dedicated queue
  async (job) => {
    const { itemId, title, description } = job.data;
    console.log(`Generating tags for item: ${itemId}`);

    const { tags, topicCluster } = await generateTags(title, description);

    await itemModel.findByIdAndUpdate(itemId, {
      tags,
      topicCluster,
      status: "ready",
    });

    console.log(`Tags done for item: ${itemId}`, tags);
  },
  { connection: bullMQConnection }
);

taggingWorker.on("failed", async (job, error) => {
  console.error(`Tagging failed for item ${job.data.itemId}:`, error.message);
  await itemModel.findByIdAndUpdate(job.data.itemId, { status: "failed" });
});

export default taggingWorker;