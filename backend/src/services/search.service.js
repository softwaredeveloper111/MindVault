import itemModel from "../models/item.model.js";
import { generateEmbedding } from "./ai.service.js";

export const semanticSearch = async (userId, query) => {

  // Step 1 — Query ka embedding banao
  const queryEmbedding = await generateEmbedding(query);

  // Agar embedding nahi bani toh search nahi hoga
  if (!queryEmbedding || queryEmbedding.length === 0) {
    return [];
  }

  // Step 2 — MongoDB Atlas Vector Search
  const results = await itemModel.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",       // Atlas mein banaya hua index naam
        path: "embedding",           // Item model ka embedding field
        queryVector: queryEmbedding, // Query ka vector
        numCandidates: 100,          // 100 mein se check karo
        limit: 10,                   // Top 10 return karo
        filter: {
          userId: userId             // Sirf apne items dhundho
        }
      }
    },
    {
      $project: {
        embedding: 0,                // Embedding result mein mat bhejo
        extractedText: 0,            // ExtractedText bhi nahi chahiye
        score: {
          $meta: "vectorSearchScore" // Similarity score add karo
        }
      }
    }
  ]);

  return results;
};


