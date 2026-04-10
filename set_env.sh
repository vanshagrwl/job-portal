#!/bin/bash
# Set VERCEL_TOKEN in your environment before running (Vercel → Settings → Tokens).
# Replace the project path if your Vercel project name differs.
curl -X POST "https://api.vercel.com/v9/projects/job-portal-main/env" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"key":"VITE_API_URL","value":"https://job-portal-backend.onrender.com/api","type":"plain","target":["production"]}'
