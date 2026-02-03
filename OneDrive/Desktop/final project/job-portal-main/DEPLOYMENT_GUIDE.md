# Job Portal Deployment Guide

## Setup Summary

This project has been configured for full-stack deployment:
- **Frontend**: Deployed on Vercel (https://job-portal-orcin-eight.vercel.app)
- **Backend**: Deployed on Railway (https://job-portal-production.up.railway.app)
- **Database**: MongoDB Atlas (Cloud-hosted)

## Important: Railway Environment Variables Setup

Your backend has been deployed to Railway, but the environment variables need to be set manually on the Railway dashboard.

### ⚠️ CRITICAL NEXT STEPS:

1. **Go to Railway Dashboard**: https://railway.com/dashboard
2. **Select Project**: "job-portal-backend"
3. **Go to Settings → Variables**
4. **Add the following variables**:
   ```
   MONGODB_URI = mongodb+srv://agvansh:vansh123@jobportal.efztav4.mongodb.net/?appName=jobportal
   JWT_SECRET = your_jwt_secret_key_here_change_in_production
   PORT = 8080
   ```

5. **Redeploy** the service after adding variables (click "Redeploy" button)

### Get Your Backend URL

After deployment completes:
1. Go to Railway Dashboard
2. Select "job-portal-backend" project
3. Your backend URL will be shown at the top (something like `https://job-portal-production.up.railway.app`)

## Update Vercel with Backend URL

1. Go to https://vercel.com/dashboard
2. Select your "job-portal" project
3. Go to **Settings → Environment Variables**
4. Update/Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://[YOUR-RAILWAY-URL]/api` (replace with actual URL from Railway)
   - **Environments**: Select "Production"
5. Redeploy on Vercel

## Files Modified

- `.env` - Local development
- `.env.production` - Production/Vercel configuration
- `.env.railway` - Railway-specific configuration
- `vercel.json` - Vercel configuration
- `railway.json` - Railway configuration
- `package.json` - Updated with `start` script for production

## Testing the Deployment

### Backend Health Check
```bash
curl https://[YOUR-RAILWAY-URL]/health
```

### Frontend Health Check
Visit: https://job-portal-orcin-eight.vercel.app

## Troubleshooting

### Backend not connecting to MongoDB on Railway
- Ensure environment variables are set in Railway dashboard
- Check Railway logs: Dashboard → Logs
- Redeploy after setting variables

### Frontend getting 404 errors
- Ensure `VITE_API_URL` is set correctly in Vercel
- Verify it matches your Railway backend URL
- Redeploy Vercel after updating environment variables

### CORS Issues
- Already configured in `server/index.ts` with `origin: '*'`
- Should work across any frontend domain

## Local Development

```bash
# Install dependencies
npm install

# Run both frontend and backend locally
npm run dev:all

# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

## Production URLs

- **Frontend**: https://job-portal-orcin-eight.vercel.app
- **Backend**: https://job-portal-production.up.railway.app
- **API Base**: https://job-portal-production.up.railway.app/api

## Next Steps

1. ✅ Push to GitHub (done)
2. ⏳ Set Railway environment variables (IMPORTANT)
3. ⏳ Update Vercel environment variables
4. ⏳ Redeploy services
5. ✅ Test the application
