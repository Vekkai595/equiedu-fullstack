# EquiEdu Full Stack

EquiEdu combined with the hardened Secure Auth System.

## Architecture

- **Frontend:** React + Vite (`frontend/`)
- **Authentication API:** FastAPI (`backend/`)
- **Primary database:** PostgreSQL (recommended: Neon)
- **Rate limiting:** Redis (recommended: Upstash/Redis-compatible provider)
- **ORM / migrations:** SQLAlchemy + Alembic
- **Password hashing:** Argon2
- **Authentication:** short-lived JWT access tokens + rotating/revocable refresh tokens

The EquiEdu educational content is still local-first in this version. The important change is that **accounts, passwords and sessions are no longer stored as fake users/passwords in browser localStorage**. Authentication now goes through the FastAPI backend.

## Repository layout

```text
equiedu-fullstack/
├─ frontend/   # EquiEdu React/Vite
├─ backend/    # FastAPI auth service
└─ docs/       # deployment instructions
```

## Local development

### 1. Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

For a quick local test the backend defaults to SQLite if `DATABASE_URL` is not changed. For production use PostgreSQL.

### 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
npm run dev
```

Open `http://localhost:5173`.

## Deploy

See [`docs/DEPLOY.md`](docs/DEPLOY.md) for GitHub + Vercel + PostgreSQL + Redis setup.

## What is integrated now?

- Registration → FastAPI + database
- Login → FastAPI + Argon2 verification
- `/users/me` → real authenticated user
- Access-token refresh → rotating refresh tokens
- Logout → backend session/token revocation
- Rate limiting → Redis when configured
- Session validation → database-backed

The rest of EquiEdu's educational collections remain local-first so the existing presentation/demo experience is preserved while the backend can be migrated module-by-module later.
