import "dotenv/config";
import { generateTags, generateEmbedding } from "./src/services/ai.service.js";



// Test 1 — generateTags
console.log("Testing generateTags...");
const { tags, topicCluster } = await generateTags(
  "How to build REST API with Node.js",
  "Learn to create a REST API using Node.js and Express step by step"
);
console.log("Tags:", tags);
console.log("TopicCluster:", topicCluster);



// Test 2 — generateEmbedding
console.log("\nTesting generateEmbedding...");
const embedding = await generateEmbedding("How to build REST API with Node.js");
console.log("Embedding length:", embedding.length);   // 1024 aana chahiye
console.log("First 5 values:", embedding.slice(0, 5)); // sample values
console.log("Embedding length:", embedding.length);