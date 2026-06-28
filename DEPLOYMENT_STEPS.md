# 🚀 RORI HOTEL SYSTEM - COMPLETE DEPLOYMENT GUIDE

## ✅ PHASE 8 COMPLETE - ATTENDANCE REMOVED

All attendance and QR code features have been completely removed from the system.  
Your code is now ready for production deployment to the internet!

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Before starting deployment, verify you have:

- [x] GitHub repository with latest code pushed
- [x] Render account (render.com)
- [x] Vercel account (vercel.com)
- [x] MongoDB Atlas database
- [x] Cloudinary account with credentials
- [x] Gmail account with App Password
- [x] All environment variables ready

---

## 🎯 DEPLOYMENT OVERVIEW

We will deploy in this order:
1. **Backend to Render** (5-10 minutes)
2. **Frontend to Vercel** (2-3 minutes)
3. **Update URLs** (link frontend and backend)
4. **Test Everything** (verify all features work)

Total Time: ~20-30 minutes

---

## 📍 STEP 1: DEPLOY BACKEND TO RENDER

### 1.1 Go to Render Dashboard

1. Open https://render.com in your browser
2. Click **Sign In**
3. Sign in with your GitHub account

### 1.2 Create New Web Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** if GitHub isn't connected yet
4. Find and select repository: **"Rori-Hotel-System"**
5. Click **"Connect"**

### 1.3 Configure Service Settings

Fill in these EXACT values:

| Setting | Value | Notes |
|---------|-------|-------|
| **Name** | `rori-hotel-backend` | Or any name you prefer |
| **Region** | `Frankfurt (EU Central)` | Closest to Ethiopia |
| **Branch** | `main` | Your main git branch |
| **Root Directory** | `rori-hotel/server` | Important: folder path |
| **Runtime** | `Node` | Auto-detected |
| **Build Command** | `npm install` | Do not change |
| **Start Command** | `node server.js` | Do not change |
| **Instance Type** | `Free` | Select free tier |

### 1.4 Add Environment Variables

Click **"Advanced"** button to expand advanced settings.

Click **"Add Environment Variable"** for EACH of these:

#### Copy-Paste These Exact Values:

```
PORT
5000
```

```
MONGODB_URI
mongodb+srv://rori-apparent-mngt:Rori2710@cluster0.jjragcd.mongodb.net/?appName=Cluster0
```

```
JWT_SECRET
RoriHotel_2026_x7kP9mL2vQ8nA5zT1wR
```

```
CLOUDINARY_CLOUD_NAME
ddcdwdusw
```

```
CLOUDINARY_API_KEY
575186247735916
```

```
CLOUDINARY_API_SECRET
SAuwevU-QbF2bsq82SlBmBtDDH4
```

```
EMAIL_USER
ssisayleule@gmail.com
```

```
EMAIL_PASS
qanp fbqi ixrl mkf
```

```
CLIENT_URL
http://localhost:3000
```

```
CLIENT_URL_PROD
https://placeholder.vercel.app
```

```
NODE_ENV
production
```

```
BACKEND_URL
https://placeholder.onrender.com
```

**Note**: We'll update CLIENT_URL_PROD and BACKEND_URL after we get the real URLs.

### 1.5 Deploy

1. Double-check all environment variables are entered correctly
2. Click **"Create Web Service"** (blue button at bottom)
3. Wait 5-10 minutes for deployment
4. Watch the logs scroll (this is normal)

### 1.6 Look for Success Messages

Watch for these in the logs:

```
Connected to MongoDB successfully ✅
Server running on port 5000 in production mode ✅
```

If you see these, your backend is LIVE! 🎉

### 1.7 Get Your Backend URL

1. After deployment succeeds, Render shows your URL at the top
2. It looks like: `https://rori-hotel-backend.onrender.com`
3. **COPY THIS URL** - you'll need it multiple times!

### 1.8 Test Your Backend

1. Open a new browser tab
2. Go to: `https://your-render-url.onrender.com`  
   (replace with your actual URL)
3. You should see:
   ```json
   {"message":"Rori Hotel API is running","status":"ok"}
   ```

If you see this, **BACKEND IS WORKING!** ✅

---

## 📍 STEP 2: UPDATE BACKEND ENVIRONMENT VARIABLES

Now that we have the Render URL, let's update it:

### 2.1 Update BACKEND_URL

1. In Render dashboard, click your `rori-hotel-backend` service
2. Click **"Environment"** in the left sidebar
3. Find `BACKEND_URL`
4. Click the pencil icon to edit
5. Change value to your actual Render URL:
   ```
   https://rori-hotel-backend.onrender.com
   ```
   (Replace with YOUR actual Render URL)
6. Click **"Save Changes"**

Render will automatically redeploy (wait 2-3 minutes).

---

## 📍 STEP 3: CONFIGURE MONGODB ATLAS NETWORK ACCESS

**CRITICAL STEP** - Without this, Render cannot connect to your database!

### 3.1 Open MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Sign in to your account
3. Select your cluster

### 3.2 Allow Access from Anywhere

1. Click **"Network Access"** in the left sidebar
2. Click **"+ ADD IP ADDRESS"** button
3. Click **"ALLOW ACCESS FROM ANYWHERE"** button
4. It will show: `0.0.0.0/0`
5. Click **"Confirm"**

This allows Render servers (which have dynamic IPs) to connect to your database.

---

## 📍 STEP 4: DEPLOY FRONTEND TO VERCEL

### 4.1 Update Production API URL

Before deploying to Vercel, we need to update the production environment file:

1. Open this file on your computer:
   ```
   rori-hotel/client/.env.production
   ```

2. Update the `VITE_API_URL` with your Render URL:
   ```
   VITE_API_URL=https://rori-hotel-backend.onrender.com/api
   ```
   **Important**: Add `/api` at the end!

3. Save the file

### 4.2 Commit and Push Changes

Open terminal in the project root folder and run:

```bash
git add .
git commit -m "Update production API URL for Vercel"
git push origin main
```

### 4.3 Go to Vercel Dashboard

1. Open https://vercel.com in your browser
2. Click **"Login"**
3. Sign in with your GitHub account

### 4.4 Create New Project

1. Click **"Add New..."** button (top right)
2. Select **"Project"**
3. Find repository: **"Rori-Hotel-System"**
4. Click **"Import"**

### 4.5 Configure Project Settings

Fill in these values:

| Setting | Value | Notes |
|---------|-------|-------|
| **Framework Preset** | `Vite` | Select from dropdown |
| **Root Directory** | `rori-hotel/client` | Click Edit and type this |
| **Build Command** | `npm run build` | Auto-filled |
| **Output Directory** | `dist` | Auto-filled |

### 4.6 Add Environment Variable

1. Scroll down to **"Environment Variables"** section
2. Click to expand it
3. Add ONE variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://rori-hotel-backend.onrender.com/api`  
     (Use YOUR actual Render URL + /api)
4. Leave **Environment** as "Production"

### 4.7 Deploy

1. Double-check the API URL is correct
2. Click **"Deploy"** button
3. Wait 2-3 minutes
4. Watch build logs

### 4.8 Get Your Frontend URL

After successful deployment:

1. Vercel shows your live URL at the top
2. It looks like: `https://rori-hotel-system.vercel.app`
3. **COPY THIS URL** - you need it for backend CORS!

---

## 📍 STEP 5: UPDATE BACKEND CORS SETTINGS

**CRITICAL STEP** - Without this, frontend cannot talk to backend!

### 5.1 Update Client URL in Render

1. Go back to Render dashboard
2. Click your `rori-hotel-backend` service
3. Click **"Environment"** in left sidebar
4. Find and update these TWO variables:

**CLIENT_URL**:
- Click pencil icon
- Change to: `https://rori-hotel-system.vercel.app`  
  (Your actual Vercel URL)
- Click Save

**CLIENT_URL_PROD**:
- Click pencil icon
- Change to: `https://rori-hotel-system.vercel.app`  
  (Same Vercel URL)
- Click Save

5. Click **"Save Changes"** button at bottom

Render will automatically redeploy (wait 2-3 minutes).

---

## 📍 STEP 6: END-TO-END TESTING

Now let's test EVERYTHING on the live system!

### ⚠️ IMPORTANT TESTING RULES

1. **Use ONLY the Vercel URL** for all tests
2. **Do NOT use localhost** for any test
3. Open browser in **Incognito/Private mode** for fresh testing
4. Press **F12** to open Developer Console and watch for errors

### Test 1: Homepage Loads ✅

**Action**:
1. Open your Vercel URL: `https://your-project.vercel.app`

**Expected Result**:
- Homepage loads with Rori Hotel branding
- Hotel department photos display
- Navigation bar visible
- No errors in console

**Status**: ⬜ Pass / ⬜ Fail

---

### Test 2: Student Registration ✅

**Action**:
1. Click **"Apply for Internship"** button
2. Fill in ALL fields:
   - Full Name: `Test Student`
   - Email: `test@student.com`
   - Phone: `+251912345678`
   - Password: `test123456`
   - Upload profile photo (any small image)
   - Upload internship letter (any PDF file)
3. Click **"Submit Application"**

**Expected Result**:
- Green success message appears
- "Application submitted successfully"
- Redirects to login page

**Status**: ⬜ Pass / ⬜ Fail

---

### Test 3: HR Login ✅

**Action**:
1. Click **"Login"** in navigation
2. Enter credentials:
   - Email: `hr@rorihotel.com`
   - Password: `hr123456`
3. Click **"Sign In"**

**Expected Result**:
- Successfully logs in
- Redirects to HR Dashboard
- Dashboard shows statistics
- Sidebar shows HR navigation links
- NO attendance link in sidebar

**Status**: ⬜ Pass / ⬜ Fail

---

### Test 4: View Student Application ✅

**Action**:
1. While logged in as HR
2. Click **"Applications"** in sidebar
3. Find the test student application
4. Click **"View Profile"** or student name

**Expected Result**:
- Application details page loads
- Student info displays correctly
- Can see uploaded photo
- "Submitted Documents" section visible
- Can click "View in New Tab" for letter

**Status**: ⬜ Pass / ⬜ Fail

---

### Test 5: Approve Application ✅

**Action**:
1. On the application detail page
2. Set **Start Date** to today's date
3. Set **Department Rotation** to any option
4. Click **"Approve Application"**

**Expected Result**:
- Success message appears
- Status changes to "Approved"
- Start date and rotation saved

**Status**: ⬜ Pass / ⬜ Fail

---

### Test 6: Student Login ✅

**Action**:
1. Click profile icon > Logout
2. Login as the test student:
   - Email: `test@student.com`
   - Password: `test123456`

**Expected Result**:
- Successfully logs in
- Redirects to Student Dashboard
- Shows "Approved" status
- Displays start date
- Shows department rotation schedule
- NO attendance link in sidebar

**Status**: ⬜ Pass / ⬜ Fail

---

### Test 7: Messaging System ✅

**Action**:
1. As student, click **"Messages"** in sidebar
2. Click **"New Message"** or compose button
3. Send message to HR: "Hello, this is a test message"
4. Logout and login as HR (`hr@rorihotel.com` / `hr123456`)
5. Click **"Messages"** in sidebar

**Expected Result**:
- Student can send message successfully
- HR sees the message in inbox
- Can click message to view details
- HR can reply to message
- Student receives reply

**Status**: ⬜ Pass / ⬜ Fail

---

### Test 8: Supervisor Score Submission ✅

**Action**:
1. Logout and login as supervisor:
   - Email: `fo@rorihotel.com`
   - Password: `sup123456`
2. Dashboard shows "My Students" list
3. Find the test student
4. Enter score: `85`
5. Click **"Submit Score"**

**Expected Result**:
- Score submits successfully
- Score locks (cannot edit again)
- Lock icon appears
- Success message shows

**Status**: ⬜ Pass / ⬜ Fail

---

### Test 9: Publish Final Results ✅

**Action**:
1. Logout and login as HR
2. Click **"Scores"** in sidebar
3. Select the test student
4. Enter scores for all 4 departments (if not done)
5. Click **"Publish Result"**

**Expected Result**:
- Result publishes successfully
- Status changes to "Published"
- Success message appears

**Status**: ⬜ Pass / ⬜ Fail

---

### Test 10: Download Certificate ✅

**Action**:
1. Logout and login as test student
2. Click **"My Results"** in sidebar
3. View published results
4. Click **"Download Certificate"** button

**Expected Result**:
- PDF certificate downloads
- Certificate contains:
  - Student name
  - Rori Hotel branding
  - Final score
  - QR code
  - Completion date

**Status**: ⬜ Pass / ⬜ Fail

---

### Test 11: Profile Photo Lock ✅

**Action**:
1. As any user, click **"Settings"** in sidebar
2. Click **"Upload Photo"** button
3. Select and upload a new photo
4. Click **"Save Changes"**
5. Verify email receives unlock code
6. Try to change photo again
7. Use unlock code to unlock

**Expected Result**:
- Photo uploads successfully
- Photo locks after first save
- Lock icon shows on profile
- Email with unlock code received
- Cannot change until unlocked
- Unlock code works correctly

**Status**: ⬜ Pass / ⬜ Fail

---

### Test 12: Attendance Links Removed ✅

**Action**:
1. Login as student
2. Check sidebar navigation
3. Login as HR
4. Check sidebar navigation
5. Check browser console for errors
6. Try accessing old URL: `/student/attendance`
7. Try accessing: `/hr/attendance`

**Expected Result**:
- NO "Attendance" link in student sidebar ✅
- NO "Attendance" link in HR sidebar ✅
- No console errors related to attendance ✅
- Old attendance URLs don't break app ✅
- No broken links anywhere ✅

**Status**: ⬜ Pass / ⬜ Fail

---

## 📊 TESTING SCORECARD

Mark each test as PASS or FAIL:

- [ ] Test 1: Homepage Loads
- [ ] Test 2: Student Registration
- [ ] Test 3: HR Login
- [ ] Test 4: View Application
- [ ] Test 5: Approve Application
- [ ] Test 6: Student Login
- [ ] Test 7: Messaging System
- [ ] Test 8: Supervisor Scores
- [ ] Test 9: Publish Results
- [ ] Test 10: Download Certificate
- [ ] Test 11: Profile Photo Lock
- [ ] Test 12: Attendance Removed

**Required Score**: 12/12 PASS for complete deployment success

---

## 🎉 DEPLOYMENT COMPLETE!

If all tests pass, congratulations! Your system is now live on the internet!

### Your Live URLs:

- **Frontend**: https://your-vercel-url.vercel.app
- **Backend**: https://your-render-url.onrender.com

### Share These URLs:

- **Homepage**: `https://your-vercel-url.vercel.app`
- **Login**: `https://your-vercel-url.vercel.app/login`
- **Register**: `https://your-vercel-url.vercel.app/register`

### Default Login Accounts:

| Role | Email | Password |
|------|-------|----------|
| HR | hr@rorihotel.com | hr123456 |
| Front Office Supervisor | fo@rorihotel.com | sup123456 |
| Housekeeping Supervisor | hk@rorihotel.com | sup123456 |
| Kitchen Supervisor | kt@rorihotel.com | sup123456 |
| F&B Supervisor | fb@rorihotel.com | sup123456 |

---

## ⚠️ IMPORTANT NOTES

### First Request Delay

Your backend is on Render's free tier:
- After 15 minutes of no activity, the service "sleeps"
- First request after sleep takes 30-50 seconds to wake up
- This is normal for free tier!
- Subsequent requests are fast

### File Storage Warning

⚠️ **Internship letters are stored on Render's local disk**:
- Letters may be lost when Render redeploys
- For production, migrate to Cloudinary or AWS S3
- Profile photos on Cloudinary are safe

### MongoDB Free Tier

- 512 MB storage limit
- Sufficient for ~5,000-10,000 students
- Monitor usage in MongoDB Atlas dashboard

---

## 🐛 TROUBLESHOOTING

### If Tests Fail:

#### Frontend Not Loading
1. Check Vercel deployment logs
2. Verify build completed successfully
3. Check `vercel.json` exists in client folder

#### Login Not Working
1. Open browser console (F12)
2. Check for CORS errors
3. Verify `CLIENT_URL_PROD` in Render matches Vercel URL exactly
4. Ensure no trailing slash in URLs

#### Database Connection Failed
1. Check MongoDB Atlas Network Access allows 0.0.0.0/0
2. Verify `MONGODB_URI` is correct in Render
3. Test connection string locally first

#### Images Not Loading
1. Check Cloudinary credentials in Render env variables
2. Verify image URLs in browser console
3. Check for 404 errors

#### Emails Not Sending
1. Verify `EMAIL_USER` and `EMAIL_PASS` are correct
2. Ensure Gmail App Password (not regular password)
3. Check Gmail hasn't blocked the app

---

## 📞 NEED HELP?

If you encounter issues:

1. **Check Logs**:
   - Render: Dashboard > Logs tab
   - Vercel: Project > Deployments > View logs
   - MongoDB: Atlas dashboard > Metrics

2. **Review Documentation**:
   - Backend: `rori-hotel/server/README.md`
   - Frontend: `rori-hotel/client/README.md`
   - Deployment: `DEPLOYMENT.md`

3. **Common Issues**:
   - CORS errors → Update CLIENT_URL_PROD
   - Database connection → Check Network Access
   - Build errors → Test locally first
   - 404 on refresh → Check vercel.json

---

## ✅ POST-DEPLOYMENT CHECKLIST

After successful deployment:

- [ ] Update DEPLOYMENT.md with real URLs
- [ ] Test all features on live system
- [ ] Share URLs with stakeholders
- [ ] Document any custom configurations
- [ ] Set up monitoring (optional)
- [ ] Plan backup strategy
- [ ] Schedule security updates

---

**🎊 Congratulations on deploying your Rori Hotel Internship Management System!**

The system is now accessible from anywhere in the world via the internet.

**Last Updated**: Phase 8 Complete - Attendance System Removed  
**Deployment Status**: ✅ Ready for Production  
**System Version**: 2.0
