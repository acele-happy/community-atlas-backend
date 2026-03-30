# CommunityAtlas Backend

Node.js + Express + MongoDB backend for the CommunityAtlas digital community map platform.

---

## Project Structure

```
communityatlas-backend/
├── server.js              # Entry point
├── seed.js                # Sample data script
├── .env.example           # Environment variables template
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── User.js            # User schema (member / provider / admin)
│   └── Service.js         # Service listing schema
├── controllers/
│   ├── authController.js  # Register, login, profile
│   ├── serviceController.js # CRUD for services
│   └── adminController.js # Moderation + user management
├── routes/
│   ├── auth.js
│   ├── services.js
│   └── admin.js
└── middleware/
    └── auth.js            # JWT protect + role restrict
```

---

## Setup Instructions

### 1. Install dependencies

```bash
cd community-atlas-backend
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and choose one of:

**Option A — Local MongoDB** (if MongoDB is installed on your computer):
```
MONGODB_URI=mongodb://localhost:27017/communityatlas
```

**Option B — MongoDB Atlas** (free cloud database, recommended):
1. Go to https://www.mongodb.com/cloud/atlas and create a free account
2. Create a free cluster (M0)
3. Go to Database Access → Add a user with a password
4. Go to Network Access → Add `0.0.0.0/0` (allow all IPs)
5. Click Connect → Drivers → copy the connection string
6. Paste it in `.env`:
```
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/communityatlas
```

Also set a strong JWT secret:
```
JWT_SECRET=some_long_random_string_here
```

### 3. Seed sample data (optional but recommended)

```bash
node seed.js
```

This creates:
- An admin account: `admin@communityatlas.rw` / `admin123`
- A provider account: `grace@example.com` / `provider123`
- 4 sample service listings

### 4. Start the server

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

Server runs at: **http://localhost:5000**

---

## 🔌 API Reference

### Base URL
```
http://localhost:5000/api
```
---

## User Roles

| Role               | Can Do                                              |
|--------------------|-----------------------------------------------------|
| `community_member` | Browse and search approved services (no login needed) |
| `service_provider` | Submit, edit, delete their own listings             |
| `admin`            | Moderate all listings, manage users                 |

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Auth**: JWT (JSON Web Tokens) + bcryptjs
- **CORS**: configured for React frontend
