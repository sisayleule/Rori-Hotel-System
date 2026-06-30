# Rori Hotel Internship Management System

Rori Hotel IMS is a React and Express application for managing internship applications, HR review, supervisor evaluations, student messaging, journals, results, and certificates.

## Project Structure

- `rori-hotel/client` - Vite React frontend
- `rori-hotel/server` - Express and MongoDB backend API
- `.github/workflows/ci.yml` - build and syntax-check workflow

The root `package.json` is kept as a convenience runner for local development.

## Prerequisites

- Node.js 22 or newer
- MongoDB Atlas connection string, or local MongoDB for development
- Cloudinary credentials for production file uploads
- Gmail app password if email notifications are enabled

## Environment

Never commit real secrets. Use the example files as templates:

- `rori-hotel/server/.env.example`
- `rori-hotel/client/.env.example`

For local development, create `rori-hotel/server/.env` and `rori-hotel/client/.env` as needed.

## Install

```bash
npm install
npm --prefix rori-hotel/client install
npm --prefix rori-hotel/server install
```

## Run Locally

```bash
npm run dev
```

Default URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/health`

## Checks

```bash
npm run lint
npm run build
npm run test:smoke
```

`test:smoke` expects the backend to be running. Set `SMOKE_LOGIN_EMAIL` and `SMOKE_LOGIN_PASSWORD` to include a login success check.

## Deployment

- Deploy `rori-hotel/server` to Render or another Node host.
- Deploy `rori-hotel/client` to Vercel or another static frontend host.
- Set `VITE_API_URL` in the frontend environment to the backend API URL, for example `https://your-backend.example.com/api`.
- Set all backend secrets in the host environment, not in git.

See `DEPLOYMENT.md` for the deployment checklist.
