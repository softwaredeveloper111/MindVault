# 🧠 MindVault — Your Personal Knowledge Base

> Save anything from the internet. AI organizes, relates, and resurfaces it for you.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Folder Structure](#folder-structure)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [How Key Features Work](#how-key-features-work)
8. [Environment Variables](#environment-variables)
9. [Day-wise Build Plan](#day-wise-build-plan)
10. [Setup & Run](#setup--run)

---

## Project Overview

MindVault ek **"Second Brain"** app hai. User internet se koi bhi cheez save karta hai — article, tweet, YouTube video, PDF, image — aur app automatically:

- AI se **tags** generate karta hai
- Similar saved items ko **cluster** karta hai (topics)
- **Semantic search** allow karta hai (matlab se dhundo, exact words se nahi)
- Purane items **resurface** karta hai ("2 months ago you saved this")
- **Knowledge graph** dikhata hai — kaise ek item doosre se related hai
- **Collections** mein manually organize karne deta hai
- Web page ke **highlights** save karne deta hai

---

## Tech Stack

| Layer | Technology | Kyun |
|---|---|---|
| Frontend | React (Vite) | MERN stack, no Next.js complexity |
| Backend | Node.js + Express | Already jaanta hai |
| Database | MongoDB Atlas | Main data storage |
| Vector Search | MongoDB Atlas Vector Search | Alag Vector DB ki zaroorat nahi |
| AI / Embeddings | OpenAI API | Tags + semantic embeddings dono |
| Graph Visualization | D3.js | Knowledge graph ke liye |
| Queue / Background Jobs | BullMQ + Redis | AI processing async karne ke liye |
| Object Storage | Cloudinary | Images aur PDFs store karne ke liye |
| Browser Extension | Vanilla JS (Chrome Extension MV3) | Save tool |
| Deployment | Railway (Backend) + Vercel (Frontend) | Free tier available |

### Why NO Python microservice?
72 hours mein do alag servers maintain karna, inter-service communication setup karna, aur debug karna bahut time waste hai. Node.js mein OpenAI SDK se saari AI functionality ho jaati hai.

### Why MongoDB Atlas Vector Search instead of Qdrant/Pinecone?
Ek hi database mein regular queries aur vector similarity search dono. Zero extra setup, no extra cost.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
│  React App (Vite)          Chrome Extension              │
│  - Dashboard               - Save button                 │
│  - Graph View (D3.js)      - Highlight capture           │
│  - Search                  - Quick save popup            │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP / REST API
┌──────────────────▼──────────────────────────────────────┐
│                   BACKEND (Node.js + Express)            │
│                                                          │
│  Routes          Controllers       Services              │
│  /auth    ──►   AuthController ──► AuthService           │
│  /items   ──►   ItemController ──► ItemService           │
│  /search  ──►   SearchController─► SearchService         │
│  /graph   ──►   GraphController ──► GraphService         │
│  /collections──►CollectionCtrl ──► CollectionService     │
│                                                          │
│  Middleware: auth, rateLimiter, errorHandler             │
└──────┬──────────────────────────────────────────────────┘
       │
       ├─── MongoDB Atlas ──► Regular collections (items, users, etc.)
       │                  ──► Vector Search Index (embeddings)
       │
       ├─── Redis (BullMQ) ──► AI Processing Queue
       │                          │
       │                    ┌─────▼──────────┐
       │                    │  Queue Workers  │
       │                    │  - generateTags │
       │                    │  - genEmbedding │
       │                    │  - fetchMeta    │
       │                    └────────────────┘
       │
       └─── OpenAI API ──► text-embedding-3-small (embeddings)
                       ──► gpt-4o-mini (tag generation)
```

### Request Flow — Jab User Kuch Save Karta Hai

```
User saves URL
     │
     ▼
POST /api/items
     │
     ▼
Item saved to MongoDB (status: "processing")
     │
     ▼
Job added to BullMQ queue
     │
     ├──► Worker: fetchMetadata (title, description, OG image scrape karo)
     │
     ├──► Worker: generateEmbedding (OpenAI se vector banao, MongoDB mein save karo)
     │
     └──► Worker: generateTags (GPT se tags banao, item update karo)
          │
          ▼
     Item status: "ready" — User ko dikh raha hai ab
```

---

## Folder Structure

```
mindvault/
│
├── backend/                        # Node.js Express Server
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js               # MongoDB connection
│   │   │   ├── redis.js            # Redis connection (BullMQ ke liye)
│   │   │   └── openai.js           # OpenAI client setup
│   │   │
│   │   ├── models/
│   │   │   ├── User.js             # User schema
│   │   │   ├── Item.js             # Saved item schema (MAIN model)
│   │   │   ├── Collection.js       # User-created collections
│   │   │   └── Highlight.js        # Web page highlights
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── item.controller.js
│   │   │   ├── search.controller.js
│   │   │   ├── graph.controller.js
│   │   │   └── collection.controller.js
│   │   │
│   │   ├── services/
│   │   │   ├── item.service.js       # Item CRUD logic
│   │   │   ├── ai.service.js         # OpenAI calls (tags + embeddings)
│   │   │   ├── scraper.service.js    # URL se metadata scrape
│   │   │   ├── search.service.js     # Semantic search logic
│   │   │   └── graph.service.js      # Knowledge graph data build karna
│   │   │
│   │   ├── queues/
│   │   │   ├── item.queue.js         # BullMQ queue definition
│   │   │   └── workers/
│   │   │       ├── metadata.worker.js   # URL scraping worker
│   │   │       ├── embedding.worker.js  # Vector embedding worker
│   │   │       └── tagging.worker.js    # AI tag generation worker
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── item.routes.js
│   │   │   ├── search.routes.js
│   │   │   ├── graph.routes.js
│   │   │   └── collection.routes.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT verify
│   │   │   ├── rateLimiter.js        # Express rate limit
│   │   │   └── errorHandler.js       # Global error handler
│   │   │
│   │   ├── utils/
│   │   │   ├── asyncHandler.js       # try/catch wrapper for async routes
│   │   │   ├── apiResponse.js        # Standard response format
│   │   │   └── resurfacing.js        # Logic for "you saved this 2 months ago"
│   │   │
│   │   └── app.js                    # Express app setup
│   │
│   ├── server.js                     # Entry point — server start + workers start
│   ├── .env                          # Environment variables (gitignore this!)
│   ├── .env.example                  # Template for env variables
│   └── package.json
│
├── frontend/                         # React App (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/               # Button, Input, Modal, etc.
│   │   │   ├── items/                # ItemCard, ItemList, ItemDetail
│   │   │   ├── graph/                # D3.js knowledge graph component
│   │   │   ├── search/               # Search bar, results
│   │   │   └── collections/          # Collection sidebar, list
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx         # Main feed
│   │   │   ├── Graph.jsx             # Full graph visualization page
│   │   │   ├── Search.jsx            # Search results page
│   │   │   ├── ItemDetail.jsx        # Single item detail
│   │   │   └── Login.jsx             # Auth page
│   │   │
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── store/                    # Zustand state management
│   │   ├── api/                      # Axios API calls
│   │   └── utils/
│   │
│   ├── index.html
│   └── package.json
│
├── extension/                        # Chrome Browser Extension
│   ├── manifest.json                 # Extension config (MV3)
│   ├── popup.html                    # Save popup UI
│   ├── popup.js                      # Popup logic
│   ├── content.js                    # Injected in pages (highlight capture)
│   ├── background.js                 # Service worker
│   └── icons/
│
└── README.md
```

---

## Database Schema

### User Model (`users` collection)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  createdAt: Date,
  settings: {
    resurfacingEnabled: Boolean,  // "2 months ago" feature on/off
    resurfacingFrequency: String  // "daily" | "weekly"
  }
}
```

### Item Model (`items` collection) — MAIN MODEL
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),       // Kis user ka hai

  // Content
  url: String,
  type: String,                        // "article" | "tweet" | "youtube" | "pdf" | "image" | "note"
  title: String,
  description: String,
  imageUrl: String,                    // OG image ya thumbnail
  content: String,                     // Extracted text (search ke liye)

  // AI Generated
  tags: [String],                      // ["machine learning", "python", "tutorial"]
  topicCluster: String,                // "Technology" ya "Science" etc.
  embedding: [Number],                 // 1536-dimension vector (OpenAI)

  // User actions
  highlights: [
    {
      text: String,
      color: String,
      position: Object
    }
  ],
  notes: String,                       // User ka personal note
  isFavorite: Boolean,

  // Collections
  collectionIds: [ObjectId],           // Kis collections mein hai

  // Meta
  status: String,                      // "processing" | "ready" | "failed"
  savedAt: Date,
  lastViewedAt: Date,                  // Resurfacing ke liye
  viewCount: Number
}
```
> **Vector Search Index** MongoDB Atlas mein `embedding` field pe banao. Yahi semantic search enable karta hai.

### Collection Model (`collections` collection)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,           // "AI Research", "Recipes", etc.
  description: String,
  color: String,          // UI mein color coding
  itemCount: Number,
  createdAt: Date
}
```

### Highlight Model (`highlights` collection)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  itemId: ObjectId,
  text: String,           // Highlighted text
  color: String,
  pageUrl: String,
  createdAt: Date
}
```

---

## API Endpoints

### Auth Routes — `/api/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | New user signup |
| POST | `/login` | Login, JWT token milega |
| GET | `/me` | Current user info (auth required) |
| POST | `/logout` | Token invalidate |

### Item Routes — `/api/items`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Naya item save karo (URL ya text) |
| GET | `/` | Apne saare items (pagination + filters) |
| GET | `/:id` | Single item detail |
| PATCH | `/:id` | Update (notes, favorite, etc.) |
| DELETE | `/:id` | Item delete |
| GET | `/resurfaced` | Items jo resurface hone chahiye |
| POST | `/:id/highlights` | Highlight add karo |

### Search Routes — `/api/search`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/?q=query` | Semantic search (vector similarity) |
| GET | `/tags` | Sabhi tags aur unka count |
| GET | `/clusters` | Topic clusters |

### Graph Routes — `/api/graph`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Poora knowledge graph data (nodes + edges) |
| GET | `/:itemId/related` | Ek item ke related items |

### Collection Routes — `/api/collections`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | User ki saari collections |
| POST | `/` | New collection banao |
| GET | `/:id/items` | Collection ke andar ke items |
| POST | `/:id/items` | Item collection mein add karo |
| DELETE | `/:id/items/:itemId` | Item collection se hatao |
| DELETE | `/:id` | Collection delete |

---

## How Key Features Work

### 1. Semantic Search — Kaise kaam karta hai?

> **Simple explanation:** Jab tum save karte ho, text ka ek "meaning vector" (numbers ki list) banta hai OpenAI se. Jab search karte ho, tera query bhi vector ban jaata hai. Phir MongoDB dono vectors compare karta hai aur similar wale dhundta hai.

**Flow:**
```
1. Item save hone pe → OpenAI text-embedding-3-small se 1536 numbers ka array banta hai
2. Yeh array MongoDB mein item ke saath store hota hai
3. User search karta hai "machine learning tutorials"
4. Query bhi vector ban jaata hai
5. MongoDB Atlas Vector Search similarity compute karta hai
6. Top 10 similar items return hote hain
```

**Ye kyun better hai normal search se?**
Normal search: "ML tutorial" dhundega, "machine learning guide" nahi milega
Semantic search: Dono milenge kyunki meaning same hai

---

### 2. AI Tagging — Kaise kaam karta hai?

```
1. Item save hote hi queue mein job add hoti hai
2. Worker item ka title + description GPT-4o-mini ko bhejta hai
3. Prompt: "Give 5 relevant tags for this content: {title} {description}. Return JSON array only."
4. GPT returns: ["javascript", "async programming", "tutorial", "nodejs", "promises"]
5. Tags item mein save ho jaate hain
```

---

### 3. Knowledge Graph — Kaise kaam karta hai?

> Graph mein har **item ek node** hai aur **related items ke beech edges** hain.

**Relatedness kaise decide hoti hai?**
- Same tags hain → edge banao
- Embedding similarity > 0.8 → edge banao (matlab semantically related hain)
- Same collection mein hain → edge banao

**D3.js frontend pe yeh data le ke force-directed graph draw karta hai**

---

### 4. BullMQ Queue — Kyun zaroorat hai?

> Jab user URL save karta hai, AI processing (scraping + embedding + tagging) mein 3-5 seconds lagte hain. Agar yeh sab synchronously karo, user ko 5 seconds wait karwana padega. BullMQ se:
> - Item turant save ho jaata hai (fast)
> - AI processing background mein hoti hai
> - User instantly dashboard pe item dekh sakta hai (processing state mein)
> - Jab processing done, item update ho jaata hai

---

### 5. Resurfacing — Kaise kaam karta hai?

```javascript
// Logic:
// Agar item 30+ days se nahi dekha
// Aur random probability check pass kare (har din ~10% items surface hote hain)
// → Resurfaced items mein dikhao

const resurfacedItems = await Item.find({
  userId: req.user._id,
  lastViewedAt: { $lt: thirtyDaysAgo },
  status: "ready"
}).limit(5).sort({ savedAt: 1 }); // Purane items pehle
```

---

## Environment Variables

```env
# backend/.env

# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindvault

# JWT
JWT_SECRET=your_super_secret_key_here_minimum_32_chars
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-...

# Redis (BullMQ ke liye)
REDIS_URL=redis://localhost:6379

# Cloudinary (PDF/Image storage)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# CORS
FRONTEND_URL=http://localhost:5173
```

---

## Day-wise Build Plan

### Day 1 — Backend (Aaj, 24 March) ✅ Target

**Priority order — iska matlab agar time kum ho to upar waale skip mat karo:**

**Phase 1: Foundation (2-3 hours)**
- [ ] Project setup: `npm init`, Express, MongoDB connect
- [ ] `User` model + Auth routes (register/login/me) with JWT
- [ ] Auth middleware
- [ ] `Item` model banana (embedding field ke saath)
- [ ] Basic error handler + asyncHandler utility

**Phase 2: Core Item Operations (2-3 hours)**
- [ ] POST `/api/items` — item save karna (without AI, direct save)
- [ ] GET `/api/items` — paginated list with filters (type, tags)
- [ ] PATCH `/api/items/:id` — update
- [ ] DELETE `/api/items/:id`
- [ ] Scraper service — URL se title/description/image scrape karna (`cheerio` + `axios`)

**Phase 3: AI Integration (3-4 hours)**
- [ ] OpenAI service — `generateEmbedding()` aur `generateTags()` functions
- [ ] Redis connect + BullMQ queue setup
- [ ] 3 workers banana: metadata, embedding, tagging
- [ ] Queue workers ko server start pe launch karna

**Phase 4: Search + Graph (2-3 hours)**
- [ ] MongoDB Atlas mein Vector Search Index banana (manual step, Atlas UI mein)
- [ ] Semantic search route implement karna
- [ ] Graph data endpoint — nodes aur edges return karna
- [ ] Resurfacing endpoint

**Phase 5: Collections (1 hour)**
- [ ] Collection CRUD
- [ ] Item ko collection mein add/remove

---

### Day 2 — Frontend + Integration (25 March)

**Morning: React Setup**
- Vite + React project, Tailwind CSS
- Axios instance setup with JWT interceptors
- Zustand store setup (auth state, items state)
- React Router setup

**Afternoon: Core Pages**
- Login/Register page
- Dashboard — item cards grid
- ItemDetail page
- Save item form

**Evening: Advanced Features**
- D3.js Knowledge Graph component
- Semantic search UI
- Collections sidebar
- Resurfacing banner

---

### Day 3 — Chrome Extension (26 March)

- `manifest.json` MV3 setup
- Popup UI — current page save karne ke liye
- Background service worker — API calls
- Content script — text highlight capture
- Extension test karna

---

### Day 4 — Deployment (27 March)

**Backend: Railway**
- Railway pe Node.js service deploy
- Redis add-on enable karo
- MongoDB Atlas already cloud mein hai
- Environment variables set karo

**Frontend: Vercel**
- `vercel --prod`
- Environment variable: `VITE_API_URL=https://your-railway-app.railway.app`

**Extension:**
- Production API URL update karo
- Chrome developer mode mein load karo

---

## Setup & Run

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Redis (local ya Railway add-on)
- OpenAI API key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# .env fill karo apne values se
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### MongoDB Atlas Vector Search Index

Atlas UI mein jaao → Your Cluster → Search Indexes → Create Index:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    }
  ]
}
```

Collection: `items`, Index name: `vector_index`

---

## Important Libraries

```bash
# Backend
npm install express mongoose dotenv bcryptjs jsonwebtoken
npm install axios cheerio            # URL scraping
npm install bullmq ioredis           # Queue system
npm install openai                   # OpenAI SDK
npm install cloudinary multer        # File uploads
npm install express-rate-limit cors helmet morgan
npm install nodemon --save-dev

# Frontend
npm install react-router-dom axios zustand
npm install d3                       # Knowledge graph
npm install tailwindcss
```

---

## Common Mistakes to Avoid

1. **Vector Search Index banana mat bhulo** — MongoDB Atlas mein manually create karna hoga, code se nahi hoga
2. **Embedding field ko normal index mat daalna** — Vector field ke liye sirf Atlas Vector Search Index use karo
3. **Workers ko server.js mein start karo** — `worker.js` files ko import karo server start pe, warna queue process nahi hogi
4. **JWT secret strong rakho** — minimum 32 random characters
5. **CORS frontend URL sahi set karo** — warna extension aur frontend API call nahi kar payenge
6. **Rate limiting zaroor lagao OpenAI calls pe** — accidental infinite loop se billings badh sakti hai

---

*Built for the 72-hour challenge — MindVault v1.0*
