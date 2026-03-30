# 🗺️ CommunityAtlas — Backend API

Node.js + Express + MongoDB backend for the CommunityAtlas digital community map platform.

---

## 📁 Project Structure

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

## ⚙️ Setup Instructions

### 1. Install dependencies

```bash
cd communityatlas-backend
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

### 🔐 Auth Routes

| Method | Endpoint         | Auth Required | Description              |
|--------|-----------------|---------------|--------------------------|
| POST   | /auth/register  | No            | Create a new account     |
| POST   | /auth/login     | No            | Login and get JWT token  |
| GET    | /auth/me        | Yes           | Get current user profile |
| PUT    | /auth/me        | Yes           | Update profile           |

**Register example:**
```json
POST /api/auth/register
{
  "name": "Amina Uwase",
  "email": "amina@example.com",
  "password": "secure123",
  "role": "service_provider",
  "phone": "+250 788 123 456"
}
```

**Login response:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": { "id": "...", "name": "Amina Uwase", "role": "service_provider" }
}
```

> Save the `token` and send it in all protected requests:
> `Authorization: Bearer <token>`

---

### 📋 Service Routes

| Method | Endpoint                  | Auth Required         | Description                     |
|--------|--------------------------|----------------------|----------------------------------|
| GET    | /services                | No                   | Get all approved services        |
| GET    | /services/:id            | No                   | Get one service                  |
| POST   | /services                | service_provider     | Submit a new service             |
| GET    | /services/my/listings    | service_provider     | Get your own listings            |
| PUT    | /services/:id            | service_provider     | Update your listing              |
| DELETE | /services/:id            | service_provider     | Delete your listing              |

**Filter services (query params):**
```
GET /api/services?category=Health
GET /api/services?search=dental
GET /api/services?category=Education&sector=Gasabo
```

**Submit a service:**
```json
POST /api/services
Authorization: Bearer <token>
{
  "name": "Kigali Dental Clinic",
  "category": "Health",
  "description": "Affordable dental care for all community members.",
  "address": "Kimihurura, Gasabo",
  "sector": "Kimihurura",
  "phone": "+250 788 200 001",
  "latitude": -1.9432,
  "longitude": 30.0951
}
```

---

### 🛡️ Admin Routes (Admin only)

| Method | Endpoint                         | Description                     |
|--------|----------------------------------|----------------------------------|
| GET    | /admin/services                  | Get all services (any status)   |
| PUT    | /admin/services/:id/approve      | Approve a service               |
| PUT    | /admin/services/:id/reject       | Reject a service                |
| DELETE | /admin/services/:id              | Permanently delete a service    |
| GET    | /admin/users                     | Get all users                   |
| PUT    | /admin/users/:id/role            | Change a user's role            |
| PUT    | /admin/users/:id/deactivate      | Deactivate a user               |

**Approve a service:**
```json
PUT /api/admin/services/64abc123/approve
Authorization: Bearer <admin_token>
{
  "note": "Verified and relevant to the community."
}
```

---

## 🔗 Connecting to the React Frontend

In your React app, set the base URL:
```js
const API_URL = "http://localhost:5000/api";
```

Example — fetch approved services:
```js
const res = await fetch(`${API_URL}/services?category=Health`);
const data = await res.json();
console.log(data.data); // array of services
```

Example — login and save token:
```js
const res = await fetch(`${API_URL}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const data = await res.json();
localStorage.setItem("token", data.token);
```

---

## 👥 User Roles

| Role               | Can Do                                              |
|--------------------|-----------------------------------------------------|
| `community_member` | Browse and search approved services (no login needed) |
| `service_provider` | Submit, edit, delete their own listings             |
| `admin`            | Moderate all listings, manage users                 |

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Auth**: JWT (JSON Web Tokens) + bcryptjs
- **CORS**: configured for React frontend
