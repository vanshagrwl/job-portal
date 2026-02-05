#!/bin/bash
curl -X POST "https://api.vercel.com/v9/projects/job-portal-main/env" \
  -H "Authorization: Bearer Agvlf8AXaRIbPPqw3etopi90" \
  -H "Content-Type: application/json" \
  -d '{"key":"VITE_API_URL","value":"https://job-portal-backend-production-7db4.up.railway.app/api","type":"plain","target":["production"]}'
