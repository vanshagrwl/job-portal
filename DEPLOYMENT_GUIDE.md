# Job Portal Deployment Guide

## Setup Summary

This project is configured for full-stack deployment:

- **Frontend**: Vercel (e.g. https://job-portal-orcin-eight.vercel.app or https://dreamai-job.vercel.app)
- **Backend**: [Render](https://render.com) Web Service (see `render.yaml`)
- **Database**: MongoDB Atlas

## Render (backend)

### Create the Web Service

1. In the [Render Dashboard](https://dashboard.render.com), choose **New** → **Web Service** and connect this GitHub repository (or use **New** → **Blueprint** if you use `render.yaml` from the repo root).
2. Use:
   - **Build command**: `npm install`
   - **Start command**: `npm start`
3. Set **Environment** variables (see `.env.render.example`):

   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a long random secret for signing tokens

   Render sets `PORT` automatically; the server reads `process.env.PORT`.

4. After the first deploy, note the public URL (default pattern: `https://job-portal-backend.onrender.com` if the service name is `job-portal-backend`).

### Health check

```bash
curl https://job-portal-backend.onrender.com/health
```

If you rename the Render service, replace the hostname in the URL above.

## Vercel (frontend)

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → your project → **Settings** → **Environment Variables**.
2. Set `VITE_API_URL` to your Render API base URL, including `/api`, for example:

   `https://job-portal-backend.onrender.com/api`

3. Redeploy the frontend so Vite picks up the variable at build time.

## Files Reference

- `.env` — local development (not committed if you add it to `.gitignore`)
- `.env.production` — default production `VITE_API_URL` for local builds
- `.env.render.example` — variables to copy into Render
- `render.yaml` — Render Blueprint for the API
- `vercel.json` — SPA routing on Vercel

## Troubleshooting

### Backend cannot reach MongoDB

- Confirm `MONGODB_URI` in Render → **Environment** and check **Logs** for connection errors.

### Frontend API errors or CORS

- Ensure `VITE_API_URL` matches your Render URL (with `/api`).
- CORS allowed origins are defined in `server/index.ts`; add your production frontend origin there if it is not listed.

### Render free tier cold starts

- The first request after idle may take longer while the service wakes up.

## Local development

```bash
npm install
npm run dev:all
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:5000  
