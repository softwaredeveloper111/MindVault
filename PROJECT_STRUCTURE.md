# MindVault — Project Structure Reference

## Quick Reference: Kya file kahan hai aur kyun?

---

## backend/

### `server.js` — Entry Point
```
Kya karta hai:
- Express app start karta hai
- MongoDB connect karta hai
- BullMQ workers ko launch karta hai
- PORT pe listen karta hai

Yaad rakho: Workers ko yahan import karna MUST hai
```

### `src/config/`
```
db.js        → mongoose.connect() ka code, ek baar likhna hai
redis.js     → BullMQ ke liye Redis connection
openai.js    → new OpenAI({ apiKey }) — ek baar initialize
```

### `src/models/`
```
User.js       → name, email, password (bcrypt), settings
Item.js       → MAIN MODEL — url, type, title, tags, embedding[], status
Collection.js → name, userId, color
Highlight.js  → text, itemId, userId, pageUrl
```

### `src/controllers/`
```
Kya hota hai yahan:
- req/res handle karta hai
- Service ko call karta hai
- Response return karta hai

auth.controller.js
  - register()  → User.create + JWT return
  - login()     → bcrypt.compare + JWT return
  - getMe()     → req.user return (auth middleware ne set kiya)

item.controller.js
  - createItem()    → ItemService.create() + queue mein job add
  - getItems()      → ItemService.findByUser() with pagination
  - getItemById()   → ItemService.findById()
  - updateItem()    → ItemService.update()
  - deleteItem()    → ItemService.delete()
  - getResurfaced() → ItemService.getResurfaced()

search.controller.js
  - search()        → SearchService.semanticSearch()
  - getTags()       → Item.aggregate tags
  - getClusters()   → Item.aggregate topicCluster

graph.controller.js
  - getGraph()      → GraphService.buildGraph()
  - getRelated()    → GraphService.getRelatedItems()

collection.controller.js
  - CRUD operations
```

### `src/services/`
```
Kya hota hai yahan:
- Business logic yahan likhte hain
- Database queries yahan
- Controllers mein direct DB queries nahi

item.service.js
  - create(data)          → new Item(data).save()
  - findByUser(userId)    → Item.find({ userId }).paginate
  - getResurfaced(userId) → last 30 days nahi dekhe items

ai.service.js
  - generateEmbedding(text) → openai.embeddings.create()
                              → returns number[] (1536 values)
  - generateTags(title, description) → openai.chat.completions.create()
                                      → returns string[]
  - generateTopicCluster(tags) → GPT se broad category

scraper.service.js
  - scrapeUrl(url)   → axios.get(url) + cheerio parse
                     → returns { title, description, imageUrl, content }
  Note: YouTube URLs ke liye special handling (oEmbed API)
  Note: Twitter/X URLs ke liye special handling

search.service.js
  - semanticSearch(query, userId)
    → query ka embedding banao
    → MongoDB $vectorSearch aggregation
    → results return karo

graph.service.js
  - buildGraph(userId)
    → saare user items lo
    → common tags dhundho → edges banao
    → embedding similarity check karo → edges banao
    → { nodes: [], edges: [] } return karo
```

### `src/queues/`
```
item.queue.js
  - BullMQ Queue define karo ('item-processing')
  - addMetadataJob(itemId, url)
  - addEmbeddingJob(itemId, text)
  - addTaggingJob(itemId, text)

workers/metadata.worker.js
  - Queue listen karo
  - ScraperService.scrapeUrl() call karo
  - Item update karo (title, description, imageUrl)

workers/embedding.worker.js
  - Queue listen karo
  - AIService.generateEmbedding() call karo
  - Item update karo (embedding field)

workers/tagging.worker.js
  - Queue listen karo
  - AIService.generateTags() call karo
  - Item update karo (tags, topicCluster, status: "ready")
```

### `src/routes/`
```
auth.routes.js
  POST /register
  POST /login
  GET  /me          (authMiddleware lagao)
  POST /logout

item.routes.js
  POST   /           (authMiddleware)
  GET    /           (authMiddleware) — ?page=1&limit=20&type=article&tag=ai
  GET    /resurfaced (authMiddleware)
  GET    /:id        (authMiddleware)
  PATCH  /:id        (authMiddleware)
  DELETE /:id        (authMiddleware)
  POST   /:id/highlights (authMiddleware)

search.routes.js
  GET /        (authMiddleware) — ?q=query text
  GET /tags    (authMiddleware)
  GET /clusters (authMiddleware)

graph.routes.js
  GET /           (authMiddleware)
  GET /:itemId/related (authMiddleware)

collection.routes.js
  GET    /
  POST   /
  GET    /:id/items
  POST   /:id/items
  DELETE /:id/items/:itemId
  DELETE /:id
```

### `src/middleware/`
```
auth.middleware.js
  - req.headers.authorization se Bearer token lo
  - jwt.verify() karo
  - User DB se lo
  - req.user = user set karo
  - next() call karo

errorHandler.js
  - Express error handling middleware (4 params)
  - Mongoose errors handle karo (ValidationError, CastError)
  - JWT errors handle karo
  - Standard error response: { success: false, message: "..." }

rateLimiter.js
  - express-rate-limit use karo
  - /api/search pe zyada strict (10 req/min)
  - General: 100 req/15min
```

### `src/utils/`
```
asyncHandler.js
  - Ek wrapper function jo try/catch automatically lagata hai
  - Use: router.get('/', asyncHandler(async (req, res) => { ... }))
  - Warna har route mein try/catch likhna padega

apiResponse.js
  - success(res, data, message, statusCode)
  - error(res, message, statusCode)
  - Standard format: { success: true/false, data: {}, message: "" }

resurfacing.js
  - isEligibleForResurfacing(item) → boolean
  - Logic: lastViewedAt > 30 days ago
```

---

## frontend/

### `src/api/`
```
axios.js     → Axios instance with baseURL + JWT interceptor
              → Agar 401 aaye → logout + redirect to login

auth.api.js      → register(), login(), getMe()
item.api.js      → createItem(), getItems(), updateItem(), deleteItem()
search.api.js    → search(), getTags()
graph.api.js     → getGraph(), getRelated()
collection.api.js → getCols(), createCol(), addItem()
```

### `src/store/`
```
Zustand use karo (Redux se simple)

authStore.js
  - user state
  - login() action
  - logout() action
  - isAuthenticated computed

itemStore.js
  - items[]
  - currentItem
  - isLoading
  - fetchItems() action
  - addItem() action

searchStore.js
  - query
  - results[]
  - isSearching

collectionStore.js
  - collections[]
  - fetchCollections() action
```

### `src/components/graph/`
```
KnowledgeGraph.jsx
  - D3.js force simulation use karo
  - Nodes = items (circle)
  - Edges = related items (line)
  - Click on node → item detail open

D3 ka concept:
  - forceSimulation() → nodes ko physics se move karta hai
  - forceLink() → connected nodes ko paas rakho
  - forceManyBody() → nodes ek doosre ko push karein
  - Zoom + pan support
```

---

## extension/

### `manifest.json` (MV3)
```json
{
  "manifest_version": 3,
  "name": "MindVault Saver",
  "version": "1.0",
  "permissions": ["activeTab", "storage", "scripting"],
  "host_permissions": ["<all_urls>"],
  "action": { "default_popup": "popup.html" },
  "background": { "service_worker": "background.js" },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }]
}
```

### Files ka kaam
```
popup.html/js   → Extension click pe popup dikhao
                → Current page URL + title auto-fill
                → Save button → background.js ko message bhejo

background.js   → Service worker
                → API calls karo (fetch with JWT)
                → Token storage (chrome.storage.local)

content.js      → Page pe inject hota hai
                → Text select karo → "Save Highlight" button dikhao
                → Highlight data background ko bhejo
```

---

## Data Flow Summary

```
SAVE FLOW:
User/Extension → POST /api/items → Item save (status: processing)
                                  → Queue: metadata job
                                  → Queue: embedding job
                                  → Queue: tagging job
Workers sequentially execute    → Item update (status: ready)

SEARCH FLOW:
User types query → GET /api/search?q=text
                 → Query ka embedding banao (OpenAI)
                 → MongoDB $vectorSearch
                 → Top 10 similar items return

GRAPH FLOW:
User opens graph → GET /api/graph
                 → Saare items lo
                 → Tag similarity check karo → edges
                 → Embedding similarity > 0.8 → edges
                 → { nodes, edges } return
                 → D3.js visualize karo
```

---

## MongoDB Queries Cheatsheet

```javascript
// Paginated items
Item.find({ userId })
  .sort({ savedAt: -1 })
  .skip((page-1) * limit)
  .limit(limit)
  .select('-embedding')  // Embedding mat bhejo frontend ko (bada hai)

// Filter by type
Item.find({ userId, type: 'article' })

// Filter by tag
Item.find({ userId, tags: { $in: ['javascript'] } })

// Resurfacing
Item.find({
  userId,
  lastViewedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  status: 'ready'
}).limit(5)

// Tag aggregation
Item.aggregate([
  { $match: { userId } },
  { $unwind: '$tags' },
  { $group: { _id: '$tags', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// Vector Search (Atlas pe run karta hai)
Item.aggregate([
  {
    $vectorSearch: {
      index: 'vector_index',
      path: 'embedding',
      queryVector: embeddingArray,  // [number x 1536]
      numCandidates: 100,
      limit: 10,
      filter: { userId: userId }    // Sirf apne items
    }
  },
  {
    $project: {
      embedding: 0,                 // Result mein embedding mat bhejo
      score: { $meta: 'vectorSearchScore' }
    }
  }
])
```

---

## Common Patterns

### asyncHandler usage
```javascript
// Ye mat karo (har route mein try/catch)
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ye karo
router.get('/', asyncHandler(async (req, res) => {
  const items = await Item.find();
  res.json({ success: true, data: items });
}));
// Error automatically errorHandler middleware mein jaayega
```

### BullMQ Worker Pattern
```javascript
// workers/tagging.worker.js
import { Worker } from 'bullmq';
import { redisConnection } from '../../config/redis.js';
import { generateTags } from '../../services/ai.service.js';
import Item from '../../models/Item.js';

const worker = new Worker('item-processing', async (job) => {
  if (job.name === 'generateTags') {
    const { itemId, text } = job.data;
    const tags = await generateTags(text);
    await Item.findByIdAndUpdate(itemId, {
      tags,
      status: 'ready'
    });
  }
}, { connection: redisConnection });

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
  // Item ko failed mark karo
  Item.findByIdAndUpdate(job.data.itemId, { status: 'failed' });
});

export default worker;
```

---

*Reference file — code likhte waqt paas rakhna*
