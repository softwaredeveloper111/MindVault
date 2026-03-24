import  "dotenv/config";
import app from "./src/app.js";
import connectToDB from "./src/config/db.js";
import  "./src/config/redis.js";


import "./src/queues/workers/embedding.worker.js";
import "./src/queues/workers/tagging.wroker.js";


const PORT = process.env.PORT || 7000
connectToDB()









app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});