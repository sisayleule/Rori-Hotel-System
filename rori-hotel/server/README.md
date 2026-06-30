# Rori Hotel Backend

Express API for the Rori Hotel Internship Management System.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The server runs on `http://localhost:5000` by default.

## Required Environment

Use placeholders in documentation and real values only in your local `.env` or hosting provider environment.

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rori-hotel
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:3000
CLIENT_URL_PROD=https://your-frontend.example.com
BACKEND_URL=http://localhost:5000
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-app-password
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
CLOUDINARY_UPLOAD_PRESET=your-upload-preset
SEED_DEFAULT_USERS=false
```

Set `SEED_DEFAULT_USERS=true` only for local/demo environments when you intentionally want default staff users created.

## Scripts

```bash
npm run dev
npm start
npm run lint
npm run test:smoke
```

`test:smoke` expects a running backend. Set `SMOKE_LOGIN_EMAIL` and `SMOKE_LOGIN_PASSWORD` to include a login success check.

## Health Check

```bash
curl http://localhost:5000/health
```

The endpoint returns server status and MongoDB connection state.

## Production Notes

- Store all secrets in Render or your host environment.
- Do not commit `.env`.
- Keep `JWT_SECRET` set; the server fails fast if it is missing.
- Do not enable `SEED_DEFAULT_USERS` in production.
- Certificates are downloaded through authenticated API routes, not public static links.
