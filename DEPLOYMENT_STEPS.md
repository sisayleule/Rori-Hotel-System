# Deployment Steps

## 1. Prepare Secrets

Create production values for:

- `MONGODB_URI`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_PRESET`

Do not store real values in git.

## 2. Deploy Backend

1. Create a Render Web Service.
2. Set root directory to `rori-hotel/server`.
3. Set build command to `npm install`.
4. Set start command to `npm start`.
5. Add backend environment variables from `DEPLOYMENT.md`.
6. Set health check path to `/health`.
7. Deploy and confirm `/health` returns `200`.

## 3. Deploy Frontend

1. Create a Vercel project.
2. Set root directory to `rori-hotel/client`.
3. Set build command to `npm run build`.
4. Set output directory to `dist`.
5. Add `VITE_API_URL=https://your-backend.example.com/api`.
6. Deploy.

## 4. Connect Frontend and Backend

1. Update backend `CLIENT_URL_PROD` to the final Vercel URL.
2. Update frontend `VITE_API_URL` to the final Render API URL.
3. Redeploy both services after URL changes.

## 5. Production Validation

Run this checklist after deployment:

- Backend `/health` is healthy.
- Frontend loads without console errors.
- HR can log in.
- Student can register.
- HR can approve or reject an application.
- Student and HR messaging works.
- Supervisor can submit scores only for their department.
- HR can publish results.
- Student and HR can download certificates.
- Invalid origins are rejected by CORS.

## 6. Rollback

- Use Render's previous deploy rollback for backend.
- Use Vercel's previous deployment promotion for frontend.
- If a database change caused the issue, restore from the latest MongoDB backup.
