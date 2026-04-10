# Deployment — Render backend + Vercel frontend

## What is configured

1. **Backend on Render** — `render.yaml` defines a Web Service named `job-portal-backend` (URL pattern: `https://job-portal-backend.onrender.com`). Set `MONGODB_URI` and `JWT_SECRET` in the Render dashboard (see `.env.render.example`).

2. **Frontend on Vercel** — Build must receive `VITE_API_URL` pointing at your Render API base, e.g. `https://job-portal-backend.onrender.com/api`.

3. **Repository** — e.g. https://github.com/vanshagrwl/job-portal (adjust if yours differs).

---

## Critical steps

### 1. Render environment variables

1. Open [Render Dashboard](https://dashboard.render.com) → your **Web Service**.
2. **Environment** → add:
   - `MONGODB_URI` — MongoDB Atlas URI  
   - `JWT_SECRET` — strong random string  
3. Save and redeploy if needed.

### 2. Confirm backend URL

After deploy, use the URL Render shows (if you renamed the service, it will differ from `job-portal-backend.onrender.com`).

Test:

```bash
curl https://YOUR-SERVICE.onrender.com/health
```

### 3. Vercel `VITE_API_URL`

1. Vercel → project → **Settings** → **Environment Variables**.
2. `VITE_API_URL` = `https://YOUR-SERVICE.onrender.com/api` (match Render exactly).
3. Redeploy the frontend.

### 4. Smoke test

- Open your Vercel URL, sign up / log in, load jobs.

---

## Architecture

```
Local:     npm run dev:all  →  Vite :5173 + Express :5000 + MongoDB Atlas

Production:
  Browser → Vercel (static SPA)
         → API requests to Render (Express /api/*)
         → MongoDB Atlas
```

---

## Checklist

- [ ] Render service deployed and `/health` OK  
- [ ] `MONGODB_URI` and `JWT_SECRET` set on Render  
- [ ] `VITE_API_URL` on Vercel matches Render `/api` base  
- [ ] Vercel redeployed after env changes  
- [ ] Sign up / login / jobs flow tested  

---

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| MongoDB errors | `MONGODB_URI` on Render, Atlas IP allow list (`0.0.0.0/0` for cloud hosts) |
| CORS errors | `server/index.ts` `origin` list includes your Vercel hostname |
| Wrong API host | `VITE_API_URL` must include `/api` and match Render URL |
| Slow first request | Normal on Render free tier (cold start) |

**Docs:** [Render](https://render.com/docs) · [Vercel](https://vercel.com/docs)
