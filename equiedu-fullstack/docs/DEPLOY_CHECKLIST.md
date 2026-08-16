# Deploy checklist

- [ ] Create a new GitHub repo and push this folder
- [ ] Create PostgreSQL database (Neon recommended)
- [ ] Copy PostgreSQL connection string to backend `DATABASE_URL`
- [ ] Create Redis database (Upstash or another Redis provider)
- [ ] Copy TLS Redis URL to backend `REDIS_URL`
- [ ] Generate 3 different production token secrets
- [ ] Create Vercel backend project with Root Directory `backend`
- [ ] Set backend environment variables
- [ ] Run `alembic upgrade head` against production PostgreSQL
- [ ] Verify `/api/v1/health/ready`
- [ ] Create Vercel frontend project with Root Directory `frontend`
- [ ] Set `VITE_API_URL` to backend URL
- [ ] Set backend `ALLOWED_ORIGINS` to frontend URL
- [ ] Redeploy backend after changing CORS
- [ ] Test register → login → refresh → logout
- [ ] Do not commit `.env` or production secrets
