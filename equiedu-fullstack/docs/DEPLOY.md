# Deploy: GitHub + Vercel + PostgreSQL + Redis

This monorepo is designed to be deployed as **two Vercel projects from the same GitHub repository**:

1. `equiedu-web` with Root Directory = `frontend`
2. `equiedu-api` with Root Directory = `backend`

This avoids relying on Vercel Services/monorepo backend features that may not be enabled for every account.

## 1. Push the repository to GitHub

Create a new empty GitHub repository, then from this folder:

```bash
git init
git add .
git commit -m "feat: integrate EquiEdu with secure authentication backend"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

## 2. Create PostgreSQL

Recommended: Neon Postgres.

Create a database and copy its connection string. Use the pooled connection string for a serverless deployment when your provider recommends it.

Example format:

```text
postgresql+psycopg://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

The backend uses SQLAlchemy + psycopg.

## 3. Create Redis

Create a Redis-compatible database (for example Upstash). The current Python backend expects a standard Redis URL usable by `redis-py`, such as:

```text
rediss://default:PASSWORD@HOST:PORT
```

If Redis is temporarily unavailable the application has a process-local fallback, but production rate limits are only globally consistent when Redis is configured.

## 4. Deploy backend on Vercel

Import the GitHub repository into Vercel.

Set **Root Directory** to:

```text
backend
```

The file `backend/app.py` exposes the FastAPI ASGI application for Vercel.

Add these environment variables in Vercel:

```text
ENVIRONMENT=production
DEBUG=false
DATABASE_URL=<your PostgreSQL URL>
REDIS_URL=<your Redis URL>
ACCESS_TOKEN_SECRET_KEY=<random 48+ character secret>
REFRESH_TOKEN_SECRET_KEY=<different random 48+ character secret>
PASSWORD_RESET_SECRET_KEY=<different random 48+ character secret>
ALLOWED_ORIGINS=https://YOUR-FRONTEND.vercel.app
TRUSTED_PROXY_CIDRS=127.0.0.1/32,::1/128
```

You can generate secrets locally with:

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Generate three different values.

### Run database migrations

Before using registration/login against the production database, run:

```bash
cd backend
set DATABASE_URL=<your PostgreSQL URL>       # Windows CMD
alembic upgrade head
```

PowerShell:

```powershell
$env:DATABASE_URL="<your PostgreSQL URL>"
alembic upgrade head
```

macOS/Linux:

```bash
DATABASE_URL='<your PostgreSQL URL>' alembic upgrade head
```

You can run this from your machine after `pip install -r requirements.txt`.

After deploying, verify:

```text
https://YOUR-API.vercel.app/api/v1/health
https://YOUR-API.vercel.app/api/v1/health/ready
https://YOUR-API.vercel.app/docs
```

## 5. Deploy frontend on Vercel

Import the **same GitHub repository again** as another Vercel project.

Set **Root Directory** to:

```text
frontend
```

Add:

```text
VITE_API_URL=https://YOUR-API.vercel.app
```

Deploy.

Then return to the backend project and ensure:

```text
ALLOWED_ORIGINS=https://YOUR-FRONTEND.vercel.app
```

Redeploy the backend if you changed the variable.

## 6. Authentication flow

```text
Browser (EquiEdu)
      |
      | HTTPS
      v
FastAPI Auth API
      |
      +--> PostgreSQL  users / sessions / refresh tokens / audits
      |
      +--> Redis       rate limiting
```

The frontend keeps token material in `sessionStorage`, not user passwords. Passwords are sent only to the API over HTTPS and stored as Argon2 hashes in PostgreSQL.

## Important before a public production launch

Password-reset token generation exists in the backend, but this package does **not** include an email provider. The forgot-password endpoint intentionally returns a generic response. Connect a transactional email provider before claiming end-to-end password-reset email delivery.
