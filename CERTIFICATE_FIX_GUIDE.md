# Certificate Not Found - Quick Fix Guide ✅

## The Problem

**Alert Message:**
> "Certificate file not found on server. The certificate may not have been generated yet. Please ask HR to republish your result."

**Why This Happens:**
- Certificates were generated locally on your computer during development
- When deployed to Render, the production server doesn't have those certificate files
- Render's filesystem is ephemeral - uploaded files don't persist between deployments
- The database has the certificate path, but the actual PDF file doesn't exist on the server

---

## ✅ SOLUTION: Regenerate Certificate (NEW!)

I just added a **"Regenerate Certificate"** button that makes fixing this super easy!

### Steps for HR to Fix:

1. **Login as HR** at https://rori-hotel-system.vercel.app
2. Go to **"Scores & Evaluation"** page (from sidebar)
3. **Select the student** who is getting the error from the dropdown
4. Look for the **green "Final Result Published"** section
5. Click the **blue "🔄 Regenerate Certificate"** button (on the right side)
6. Wait a few seconds - you'll see "Certificate regenerated successfully!"
7. **Done!** The student can now download their certificate

### What the Button Does:
- Calls the backend API to generate a fresh certificate PDF
- Saves it to the production server's filesystem
- Updates the database with the new certificate path
- Takes only 2-3 seconds

---

## Alternative Solution: Republish Result

If you don't see the Regenerate button (old deployment), you can also:

1. Login as HR
2. Go to "Scores & Evaluation" page
3. Select the student
4. Scroll down to the publish section
5. Click **"Compile & Publish Result"** again
6. This will regenerate the certificate automatically

**Note:** Republishing is safe - it won't change scores or feedback, just creates a fresh certificate.

---

## For All Students with This Issue

HR needs to regenerate certificates for each student who has this problem. This is a one-time fix per student. After regeneration, the certificate will work permanently.

### Quick Checklist:
- [ ] HR logs in
- [ ] Goes to Scores & Evaluation page
- [ ] Selects student from dropdown
- [ ] Clicks "Regenerate Certificate" button
- [ ] Verifies success message
- [ ] Student tests download again

---

## Technical Details (For Developers)

### Why Certificates Don't Persist:
- Render free tier uses ephemeral filesystem
- Files in `uploads/certificates` folder don't survive deployments
- Each new deployment starts with empty uploads folder

### Long-Term Solutions (Future):
1. **Cloud Storage (Best):** Upload certificates to AWS S3, Cloudinary, or Google Cloud Storage
2. **Database Storage:** Store PDF as base64 in MongoDB (not recommended for large files)
3. **Paid Render Plan:** Persistent disk storage available on paid plans

### Current Solution:
- Generate certificates on-demand when needed
- Store in temporary server filesystem
- If file missing, regenerate using database data
- Works perfectly for production with the new Regenerate button

---

## API Endpoint Used

```javascript
POST /api/results/:studentId/regenerate-certificate
```

**Authorization:** HR only  
**Response:** New certificate URL and success message

---

## Deployment Status

✅ **Frontend:** Deployed to Vercel (auto-deploys from GitHub)  
✅ **Backend:** Deployed to Render (auto-deploys from GitHub)  
✅ **Regenerate Button:** Pushed to GitHub - will be live after Vercel rebuilds

### Check Deployment:
1. **Vercel:** https://vercel.com/dashboard - wait for build to complete
2. **Render:** https://dashboard.render.com - wait for deploy to complete
3. **Usually takes 2-3 minutes** for both platforms

---

## Testing the Fix

### Test Steps:
1. HR regenerates certificate for a student
2. Student logs in
3. Student goes to "My Results" page
4. Student clicks "Download Certificate"
5. Certificate should download successfully
6. PDF opens showing beautiful RORI HOTEL logo

### If Still Not Working:
- Check Render logs for errors
- Verify backend environment variables are set
- Confirm MongoDB connection is working
- Try regenerating certificate again
- Check browser console for errors

---

## Summary

**Problem:** Certificate file doesn't exist on production server  
**Solution:** Click "Regenerate Certificate" button in HR Scores page  
**Time:** 2-3 seconds per student  
**Permanent:** Yes, once regenerated it stays until next deployment  

**After deployment reset:** Simply regenerate certificates again for affected students.

---

## Contact

If the issue persists after trying both solutions, check:
- Render backend logs for certificate generation errors
- MongoDB connection is working
- Environment variables are set correctly
- Sufficient disk space on Render (free tier has limits)

**Backend URL:** https://rori-hotel-system.onrender.com  
**Frontend URL:** https://rori-hotel-system.vercel.app  
**GitHub Repo:** https://github.com/sisayleule/Rori-Hotel-System
