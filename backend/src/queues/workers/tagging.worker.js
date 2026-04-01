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
  "tagging-queue",
  async (job) => {
    const { itemId, title, description } = job.data;
    console.log(`Generating tags for item: ${itemId}`);

    // Fallback text agar dono empty hoon
    const safeTitle = title?.trim() || "untitled content";
    const safeDescription = description?.trim() || safeTitle;

    const { tags, topicCluster } = await generateTags(safeTitle, safeDescription);

    // Tags array kabhi bhi empty nahi rehna chahiye
    const finalTags = tags?.length > 0 ? tags : ["untagged"];
    const finalCluster = topicCluster || "Other";

    await itemModel.findByIdAndUpdate(itemId, {
      tags: finalTags,
      topicCluster: finalCluster,
      status: "ready",
    });

    console.log(`Tags done for item: ${itemId}`, finalTags);
  },
  { connection: bullMQConnection }
);

taggingWorker.on("failed", async (job, error) => {
  console.error(`Tagging failed for item ${job.data.itemId}:`, error.message);
  // Sirf tab "failed" mark karo jab saare attempts exhaust ho jayein
  if (job.attemptsMade >= job.opts.attempts) {
    await itemModel.findByIdAndUpdate(job.data.itemId, { status: "failed" });
  }
});

export default taggingWorker;