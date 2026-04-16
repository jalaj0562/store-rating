# Store Ratings App (Express + PostgreSQL + Prisma + React)

A full‑stack reference implementation for the "FullStack Intern Coding Challenge - V1.1".

## Features implemented

- JWT authentication with role-based access (System Admin, Normal User, Store Owner)
- Admin:
  - Create users (normal/admin/owner) and stores
  - Dashboard stats: total users, stores, ratings
  - List/search/sort/filter users and stores
  - View user details (includes owner’s store rating if owner)
- Normal user:
  - Sign up, login, change password
  - Browse/search stores, see overall rating and user’s own rating
  - Submit/update rating (1-5)
- Store owner:
  - Login, change password
  - See list of users who rated their store + average rating

## Tech
- Backend: Node.js (Express) + Prisma ORM + PostgreSQL + Zod validation + bcrypt + JWT
- Frontend: React (Vite) + React Router + TailwindCSS
- Dev: Docker Compose setup for PostgreSQL

## Quick Start

### 1) Environment
Create a `.env` in `backend/` based on `.env.example`.
```bash
cd backend
cp .env.example .env
# If using docker-compose postgres defaults, you can keep the example values.
```

### 2) Start Postgres (docker compose)
```bash
docker compose up -d db
```

### 3) Install & Migrate (backend)
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

### 4) Seed Admin User (optional)
```bash
npm run seed
# Admin credentials default: admin@example.com / Admin@123
```

### 5) Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Set `VITE_API_URL` in `frontend/.env` to `http://localhost:4000` (or your backend origin).

---

## API Overview (brief)

- `POST /auth/signup` (normal user)
- `POST /auth/login`
- `POST /auth/change-password` (auth)
- Admin:
  - `POST /admin/users` (create user by role)
  - `POST /admin/stores`
  - `GET /admin/dashboard`
  - `GET /admin/users` (query: search, sort, role, pagination)
  - `GET /admin/stores` (query: search, sort, pagination)
  - `GET /admin/users/:id`
- User:
  - `GET /stores` (query: search, sort, pagination) — includes overallRating + myRating
  - `POST /stores/:id/ratings` (create/update)
- Owner:
  - `GET /owner/store/ratings` — list of user ratings for owner’s store + average

See inline comments in backend source for details.

## Notes
- All core validations implemented per the spec.
- Tables in the frontend are sortable; filters/search are supported via query params.
- This is a reference. You can extend UI styling, pagination UX, and tests as needed.
