# Deployment Guide

This project deploys as two services:

- Backend API: `rori-hotel/server`
- Frontend SPA: `rori-hotel/client`

Use real credentials only in your hosting provider's environment-variable UI. Do not commit secrets.

## Backend: Render

Recommended settings:

- Root directory: `rori-hotel/server`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`

Required environment variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.example.mongodb.net/rori-hotel?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:3000
CLIENT_URL_PROD=https://your-frontend.example.com
BACKEND_URL=https://your-backend.example.com
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-app-password
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
CLOUDINARY_UPLOAD_PRESET=your-upload-preset
SEED_DEFAULT_USERS=false
```

Keep `SEED_DEFAULT_USERS=false` in production.

## Frontend: Vercel

Recommended settings:

- Root directory: `rori-hotel/client`
- Build command: `npm run build`
- Output directory: `dist`

Required environment variable:

```env
VITE_API_URL=https://your-backend.example.com/api
```

## Pre-Deploy Checklist

- `npm --prefix rori-hotel/server run lint`
- `npm --prefix rori-hotel/client run build`
- Backend `/health` returns `200`
- `CLIENT_URL_PROD` matches the Vercel frontend URL
- `VITE_API_URL` matches the Render backend API URL
- HR login works
- Student registration works
- File upload works
- Certificate download works through authenticated routes

## Operations

- Rotate secrets if they were ever pasted into documentation, chat, screenshots, or git.
- Enable MongoDB Atlas alerts.
- Configure regular MongoDB backups.
- Monitor Render logs and `/health`.
- Move generated certificate storage to durable object storage if certificates must survive Render disk resets.

See `docs/production-readiness.md` for the production validation, certificate storage, backup, monitoring, and rotation runbook.
