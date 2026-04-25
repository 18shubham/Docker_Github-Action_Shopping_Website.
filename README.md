<p align="center">
  <h1 align="center">🛍️ ShopDock</h1>
  <p align="center">
    <strong>A modern, containerized e-commerce platform built for speed, scalability, and real-time experiences.</strong>
  </p>
  <p align="center">
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-features">Features</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-api-reference">API Reference</a> •
    <a href="#-development">Development</a>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js 20" />
  <img src="https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white" alt="Express 4" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL 15" />
  <img src="https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis 7" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker Compose" />
  <img src="https://img.shields.io/badge/Socket.io-4-010101?style=flat-square&logo=socket.io&logoColor=white" alt="Socket.io 4" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/MinIO-S3-C72E49?style=flat-square&logo=minio&logoColor=white" alt="MinIO" />
  <img src="https://img.shields.io/badge/Nginx-Alpine-009639?style=flat-square&logo=nginx&logoColor=white" alt="Nginx" />
</p>

---

## 📖 Overview

**ShopDock** is a full-stack e-commerce platform designed as a production-ready, microservices-inspired application. It brings together a React SPA frontend, a Node.js/Express REST API, PostgreSQL for persistence, Redis for caching, MinIO for S3-compatible image storage, and Nginx as a reverse proxy — all orchestrated with Docker Compose for single-command deployment.

The entire stack launches with **one command** — no manual database setup, no separate file server configuration, no runtime installation required.

---

## ✨ Features

| Category | Details |
|:---|:---|
| **🔐 Authentication** | JWT-based auth with bcrypt password hashing, role-based access control (customer / admin) |
| **📦 Product Catalog** | Full CRUD with search & category filtering, image uploads via MinIO S3 |
| **🛒 Shopping Cart** | Persistent cart management per authenticated user |
| **📋 Orders** | Complete order lifecycle — placement, status tracking, admin fulfillment |
| **👨‍💼 Admin Dashboard** | Product & order management with role-gated access |
| **📡 Real-time Updates** | Socket.io WebSocket integration for live notifications |
| **⚡ Redis Caching** | Cached product queries with 60s TTL for sub-millisecond responses |
| **🖼️ Image Storage** | MinIO S3-compatible object storage with clean `/uploads/*` URL proxying |
| **🐳 One-Command Deploy** | Fully containerized with health checks, dependency ordering, and named volumes |
| **🔒 Security** | Non-root Docker containers, input validation, CORS, multi-stage builds |

---

## 🏗️ Architecture

```
                           ┌──────────────────────┐
                           │      Client / Browser│
                           └──────────┬───────────┘
                                      │  :80
                           ┌──────────▼───────────┐
                           │    Nginx (Gateway)    │
                           │   Reverse Proxy + LB  │
                           └──┬────────┬────────┬──┘
                              │        │        │
                    /         │  /api/* │  /uploads/*
                              │        │        │
              ┌───────────────▼┐  ┌────▼──────┐  ┌──▼──────────┐
              │  Frontend SPA  │  │ Node.js   │  │   MinIO     │
              │  React + Vite  │  │ Express   │  │  S3 Storage │
              │  (nginx:alpine)│  │  API :3000│  │        :9000│
              └────────────────┘  └──┬─────┬──┘  └─────────────┘
                                     │     │
                            ┌────────▼┐  ┌─▼────────┐
                            │PostgreSQL│  │  Redis   │
                            │  :5432   │  │  :6379   │
                            └──────────┘  └──────────┘
```

### Service Summary

| Service | Image | Purpose | Port |
|:---|:---|:---|:---|
| **nginx** | `nginx:alpine` | API gateway, reverse proxy, static asset routing | `80` (exposed) |
| **frontend** | Multi-stage: `node:20-alpine` → `nginx:alpine` | React SPA built with Vite, served by Nginx | Internal |
| **api** | Multi-stage: `node:20-alpine` | Express REST API + Socket.io WebSocket server | Internal `:3000` |
| **db** | `postgres:15` | Primary data store (users, products, orders) | Internal `:5432` |
| **redis** | `redis:7-alpine` | Query caching layer | Internal `:6379` |
| **minio** | `minio/minio:latest` | S3-compatible object storage for product images | `9001` (console) |

---

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose (v2+)
- [Git](https://git-scm.com/)

### 1. Clone & Configure

```bash
git clone https://github.com/<your-username>/shopdock.git
cd shopdock
```

Create a `.env` file in the project root (or copy from the example below):

```env
# PostgreSQL
POSTGRES_USER=shopadmin
POSTGRES_PASSWORD=shoppass123
POSTGRES_DB=shopdock

# MinIO (S3-compatible image storage)
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 2. Launch

```bash
docker compose up -d --build
```

Docker Compose will:
1. Start PostgreSQL, Redis, and MinIO with health checks
2. Wait for all data services to be healthy
3. Build and start the Node.js API (auto-creates database tables on first run)
4. Build the React frontend with Vite and serve via Nginx
5. Start the Nginx gateway to tie everything together

### 3. Access

| Service | URL |
|:---|:---|
| 🌐 **Application** | [http://localhost](http://localhost) |
| 📊 **MinIO Console** | [http://localhost:9001](http://localhost:9001) |
| 💓 **API Health Check** | [http://localhost/api/health](http://localhost/api/health) |

### 4. Verify

```bash
# Check all services are running
docker compose ps

# Follow logs in real-time
docker compose logs -f

# Test the API health endpoint
curl http://localhost/api/health
# → {"status":"ok"}
```

---

## 📋 API Reference

All endpoints are accessible via `http://localhost/api/...`

### Authentication

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT |
| `GET` | `/api/auth/profile` | 🔑 | Get authenticated user profile |

### Products

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `GET` | `/api/products` | ❌ | List products (supports `?search=` and `?category=` query params) |
| `GET` | `/api/products/:id` | ❌ | Get single product |
| `POST` | `/api/products` | 🔑 Admin | Create product (multipart form with `image` file field) |
| `PUT` | `/api/products/:id` | 🔑 Admin | Update product |
| `DELETE` | `/api/products/:id` | 🔑 Admin | Delete product |

### Cart

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `GET` | `/api/cart` | 🔑 | Get authenticated user's cart |
| `POST` | `/api/cart` | 🔑 | Add item to cart |
| `PUT` | `/api/cart/:id` | 🔑 | Update cart item quantity |
| `DELETE` | `/api/cart/:id` | 🔑 | Remove item from cart |

### Orders

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `GET` | `/api/orders` | 🔑 | Get authenticated user's orders |
| `POST` | `/api/orders` | 🔑 | Place a new order from cart |
| `PUT` | `/api/orders/:id` | 🔑 Admin | Update order status |

### Admin

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `GET` | `/api/admin/*` | 🔑 Admin | Admin management endpoints |

### Utility

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `GET` | `/api/health` | ❌ | Health check (returns `{"status":"ok"}`) |

> **Auth Legend:** ❌ = Public &nbsp;|&nbsp; 🔑 = JWT Required &nbsp;|&nbsp; 🔑 Admin = JWT + `role: admin`

---

## 📁 Project Structure

```
shopdock/
├── backend/                          # Node.js Express API
│   ├── src/
│   │   ├── index.js                  # Server entry — Express + Socket.io setup
│   │   ├── models/
│   │   │   ├── db.js                 # PostgreSQL pool + schema auto-migration
│   │   │   ├── redis.js              # Redis client connection
│   │   │   └── minio.js              # MinIO client + bucket initialization
│   │   ├── middleware/
│   │   │   └── auth.js               # JWT verification + admin role guard
│   │   └── routes/
│   │       ├── auth.js               # Register, login, profile
│   │       ├── products.js           # CRUD + search + image upload
│   │       ├── cart.js               # Cart management
│   │       ├── orders.js             # Order placement + status
│   │       └── admin.js              # Admin-only operations
│   ├── Dockerfile                    # Multi-stage: build → production (non-root)
│   └── package.json
│
├── frontend/                         # React SPA (Vite)
│   ├── src/
│   │   ├── main.jsx                  # App entry point
│   │   ├── App.jsx                   # Root component + page routing
│   │   ├── App.css                   # Application styles
│   │   ├── index.css                 # Global styles
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Authentication state provider
│   │   │   └── CartContext.jsx       # Cart state provider
│   │   └── pages/
│   │       ├── Home.jsx              # Product listing + search
│   │       ├── Login.jsx             # User login form
│   │       ├── Register.jsx          # User registration form
│   │       ├── Cart.jsx              # Shopping cart view
│   │       ├── Orders.jsx            # Order history
│   │       └── Admin.jsx             # Admin dashboard
│   ├── Dockerfile                    # Multi-stage: Vite build → nginx:alpine
│   ├── nginx.conf                    # Frontend-level Nginx config
│   └── package.json
│
├── nginx/
│   └── nginx.conf                    # Gateway: routes /, /api/*, /uploads/*
│
├── docker-compose.yml                # Full stack orchestration (6 services)
├── .env                              # Environment variables (not committed)
├── .gitignore
└── README.md
```

---

## 🛠️ Development

### Local Development (without Docker)

**Backend:**
```bash
cd backend
npm install
npm run dev          # Starts with nodemon for hot reload on :3000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev          # Starts Vite dev server with HMR
```

> **Note:** For local development without Docker, you'll need PostgreSQL, Redis, and MinIO running locally or via their respective Docker images.

### Database Access

```bash
# Connect to PostgreSQL
docker compose exec db psql -U shopadmin -d shopdock

# Connect to Redis CLI
docker compose exec redis redis-cli
```

### Common Docker Commands

```bash
# Rebuild a specific service
docker compose up -d --build api

# Stop all services
docker compose down

# Stop and remove all data volumes (fresh start)
docker compose down -v

# View logs for a specific service
docker compose logs -f api
```

---

## 🗄️ Database Schema

The database schema is auto-created on first startup via `initDB()`.

```sql
-- Users with role-based access
users (id, name, email, password, role, created_at)

-- Product catalog
products (id, name, description, price, stock, category, image_url, created_at)

-- Orders linked to users
orders (id, user_id → users, total, status, created_at)

-- Order line items
order_items (id, order_id → orders, product_id → products, quantity, price)
```

**Relationships:**
- `orders.user_id` → `users.id`
- `order_items.order_id` → `orders.id`
- `order_items.product_id` → `products.id`

---

## 🔒 Security

| Layer | Implementation |
|:---|:---|
| **Password Storage** | bcrypt hashing via `bcryptjs` |
| **Authentication** | Stateless JWT tokens with configurable secret |
| **Authorization** | Role-based middleware (`customer` / `admin`) |
| **Input Validation** | `express-validator` for request sanitization |
| **File Uploads** | Multer with in-memory storage + MIME type checks |
| **Container Security** | Non-root user (`appuser`) in production images |
| **Network Isolation** | Docker bridge network — only Nginx is publicly exposed |
| **CORS** | Configured cross-origin resource sharing |

---

## ⚡ Performance

- **Redis Caching** — Product listings cached with 60-second TTL; cache invalidated on writes
- **Multi-stage Docker Builds** — Frontend ships as pure Nginx (~25MB) instead of full Node.js (~180MB)
- **Docker Layer Caching** — Dependencies installed before source copy for faster rebuilds
- **Health Checks** — All services use health checks to ensure startup ordering
- **Connection Pooling** — PostgreSQL `pg.Pool` for efficient database connections

---

## 🚢 Production Deployment

### 1. Secure Environment Variables

```bash
# Generate strong secrets
JWT_SECRET=$(openssl rand -base64 64)
POSTGRES_PASSWORD=$(openssl rand -base64 32)
MINIO_SECRET_KEY=$(openssl rand -base64 32)
```

### 2. Deploy

```bash
docker compose up -d --build
```

### 3. SSL/TLS (Recommended)

Configure SSL certificates in `nginx/nginx.conf` and update ports from `80:80` to `443:443`. Consider using [Let's Encrypt](https://letsencrypt.org/) with [Certbot](https://certbot.eff.org/) for free certificates.

### Scaling Considerations

| Component | Strategy |
|:---|:---|
| **API** | Scale horizontally with `docker compose up --scale api=N` behind Nginx |
| **Database** | PostgreSQL read replicas for read-heavy workloads |
| **Cache** | Redis Sentinel or Cluster for high availability |
| **Storage** | MinIO distributed mode for multi-node object storage |

---

## 🧰 Tech Stack

| Layer | Technology | Version |
|:---|:---|:---|
| **Frontend** | React | 19 |
| **Build Tool** | Vite | 8 |
| **HTTP Client** | Axios | 1.x |
| **Backend** | Node.js + Express | 20 / 4.x |
| **Database** | PostgreSQL | 15 |
| **Caching** | Redis | 7 (Alpine) |
| **File Storage** | MinIO | Latest |
| **Real-time** | Socket.io | 4.x |
| **Auth** | JSON Web Tokens + bcryptjs | — |
| **Validation** | express-validator | 7.x |
| **Reverse Proxy** | Nginx | Alpine |
| **Containerization** | Docker Compose | v2 |

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch — `git checkout -b feature/amazing-feature`
3. **Commit** your changes — `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch — `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ using React, Node.js, PostgreSQL, Redis, MinIO & Docker
</p>