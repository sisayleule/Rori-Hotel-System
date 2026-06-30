# Production Readiness Runbook

## Deployment Validation

Run these checks before promoting a deployment:

```bash
npm --prefix rori-hotel/server run lint
npm --prefix rori-hotel/client run build
```

After deployment:

- Backend `/health` returns `200`
- Frontend loads from the production URL
- `VITE_API_URL` points to the backend `/api`
- `CLIENT_URL_PROD` matches the frontend URL
- HR login works
- Student registration works
- HR approval/rejection works
- Student and HR messaging works
- Supervisor scoring works only for the active department
- HR result publishing works
- Certificate download works for both student and HR

## Certificate Storage Plan

Current state:

- Certificates are generated on the backend filesystem.
- Downloads are protected by the authenticated `/api/results/:studentId/certificate` route.

Production target:

- Store generated certificates in durable object storage, preferably Cloudinary raw files or S3-compatible storage.
- Save the durable HTTPS URL or storage key in `FinalResult.certificateUrl`.
- Keep certificate downloads behind the authenticated API route.
- Do not expose public `/certificates` static serving.

Migration steps:

1. Add a storage adapter for certificate uploads.
2. Upload the generated PDF after `generateCertificate`.
3. Save the durable storage URL/key in MongoDB.
4. Update the results download route to stream from durable storage.
5. Delete local generated files after successful upload.

## MongoDB Backup Plan

- Enable MongoDB Atlas automated backups if available on the chosen plan.
- If automated backups are unavailable, schedule regular `mongodump` exports from a secure machine.
- Test restore steps before production launch.
- Enable Atlas alerts for connection spikes, storage growth, and failed connections.

## Monitoring Plan

- Use Render logs for backend runtime errors.
- Use Vercel deployment logs for frontend build/runtime issues.
- Add uptime monitoring against `/health`.
- Review `/health` after each deploy.
- Add Sentry or another error tracker before public launch if the system will serve real users.

## Secret Rotation

Rotate credentials immediately if they appear in:

- Git history
- Markdown docs
- Screenshots
- Chat messages
- Shared terminals

Rotate at minimum:

- MongoDB password
- `JWT_SECRET`
- Cloudinary API secret
- Gmail app password
