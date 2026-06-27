# Troubleshooting Settings Feature 404 Errors

## Issue: Settings page showing 404 errors for API routes

### Root Cause Analysis

The 404 errors you're seeing (`/api/users/profile1`, `/api/users/delete-request1`) suggest the routes might have extra characters or the server needs restart.

### Solution Steps

#### Step 1: Restart Backend Server ✅
The backend server has been restarted and is now running properly on port 5000.

#### Step 2: Clear Browser Cache and Re-Login
The most important step is to **log out and log back in** to get the updated user data with new fields (`photoLocked`, `notifications`, etc.).

**Do this:**
1. Open browser at http://localhost:3000/
2. Click "LOG OUT" button in top right
3. Go to login page
4. Login again with your credentials (e.g., `hr@rorihotel.com` / `password123`)
5. After login, click "Settings" in sidebar
6. Settings page should now load without errors

#### Step 3: Clear Browser LocalStorage (if step 2 doesn't work)
If logging out doesn't work, manually clear localStorage:

1. Open browser DevTools (F12)
2. Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
3. Click "Local Storage" → `http://localhost:3000`
4. Right-click → "Clear"
5. Refresh page (F5)
6. Login again
7. Try Settings page

#### Step 4: Verify API Routes are Working
Test the API routes directly to confirm they're registered:

**Open a new terminal and run:**
```cmd
cd c:\Users\HP\Downloads\rori-hotel-internship-management-system (1)\rori-hotel\server
node -e "const app = require('./server'); console.log(app._router.stack.filter(r => r.route).map(r => r.route.path))"
```

This will list all registered routes.

#### Step 5: Check Browser Console for Specific Errors

Open browser console (F12 → Console tab) and look for:
- "Failed to load resource" - Check the exact URL
- "404 Not Found" - Check which endpoint is missing
- "401 Unauthorized" - Token might be missing
- "403 Forbidden" - Photo might be locked

---

## Common Issues and Fixes

### Issue 1: 404 on all `/api/users/*` routes
**Cause:** Server didn't reload after users.js was created
**Fix:** ✅ Server has been restarted

### Issue 2: "Failed to update profile" error
**Cause:** Old user data in localStorage doesn't have `photoLocked` field
**Fix:** Log out and log back in to refresh user data

### Issue 3: Photo upload shows 403 error
**Cause:** Photo is locked
**Fix:** Click "Unlock Photo" button first, then try uploading

### Issue 4: Routes have weird URLs like `/api/users/profile1`
**Cause:** Frontend code might have typos in API calls
**Fix:** Check Settings.jsx for correct endpoint URLs

---

## Verify Everything is Correct

### Backend Checklist:
- ✅ `server/routes/users.js` exists and has all 6 routes
- ✅ `server/server.js` imports users routes: `const usersRoutes = require('./routes/users')`
- ✅ `server/server.js` registers routes: `app.use('/api/users', usersRoutes)`
- ✅ Server running on port 5000
- ✅ MongoDB connected
- ✅ `server/models/User.js` has `photoLocked` and `notifications` fields

### Frontend Checklist:
- ✅ `client/src/pages/Settings.jsx` exists with all 6 tabs
- ✅ `client/src/App.jsx` has 3 Settings routes
- ✅ `client/src/components/Sidebar.jsx` has Settings links
- ✅ `client/src/pages/Login.jsx` stores all user fields
- ✅ `client/src/utils/api.js` uses correct baseURL
- ✅ Frontend running on port 3000

### Auth Flow Checklist:
- ✅ Login returns all fields: `email`, `photoLocked`, `notifications`, `createdAt`
- ✅ AuthContext stores token as `roriToken`
- ✅ api.js reads token as `roriToken`
- ✅ All Settings routes are protected with authentication

---

## Test After Fixes

1. **Test Profile Tab:**
   - Go to Settings → Profile
   - Try changing your name → should work
   - Try uploading photo → should work and auto-lock
   - Try unlocking photo → should show confirmation
   - Check sidebar for lock badge

2. **Test Email Tab:**
   - Go to Settings → Email
   - Enter new unique email
   - Click Update → should logout after 2 seconds
   - Login with new email → should work

3. **Test Password Tab:**
   - Go to Settings → Password
   - Enter current and new password
   - Watch strength indicator change colors
   - Click Update → should succeed

4. **Test Notifications Tab:**
   - Go to Settings → Notifications
   - Toggle switches should animate smoothly
   - Click Save → should persist
   - Refresh page → toggles should retain state

5. **Test Privacy Tab:**
   - Go to Settings → Privacy
   - Should see current device
   - Click "Request Account Deletion" → should confirm

6. **Test About Tab:**
   - Go to Settings → About
   - Should see logo, version, links
   - Click "Back to Dashboard" → should redirect

---

## If Still Not Working

### Check Exact Error in Console:

**Open DevTools Console and screenshot:**
1. The full error message
2. The Network tab showing failed requests
3. The request URL and response

### Check Token is Present:

**In DevTools Console, run:**
```javascript
console.log('Token:', localStorage.getItem('roriToken'));
console.log('User:', JSON.parse(localStorage.getItem('roriUser')));
```

Should show:
- Token: A long JWT string
- User: Object with `id`, `role`, `fullName`, `email`, `photoLocked`, `notifications`, etc.

**If user object is missing fields:**
- Log out and log back in
- This will fetch fresh user data from server with all new fields

### Check Server Logs:

Look at the backend terminal for:
```
PUT /api/users/profile
PUT /api/users/email
PUT /api/users/password
PUT /api/users/notifications
POST /api/users/delete-request
PUT /api/users/unlock-photo
```

If you see these, routes are working!
If you see 404 errors, routes might not be registered.

---

## Quick Fix Summary

**Most likely fix: Just log out and log back in!**

The settings page needs the updated user data (with `photoLocked` and `notifications` fields) which is only fetched during login. Since you were already logged in before these fields were added, your localStorage has old data.

**Steps:**
1. Click "LOG OUT" (top right)
2. Login again with same credentials
3. Click "Settings" in sidebar
4. Should work now!

---

## Contact

If none of these fixes work, provide:
1. Screenshot of browser console errors
2. Screenshot of Network tab showing failed request
3. Backend terminal output showing the error
4. Output of `localStorage.getItem('roriUser')` from console

This will help diagnose the exact issue.
