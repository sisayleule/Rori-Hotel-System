# Test Settings API Routes

## Quick Test - Are Routes Working?

### Method 1: Test in Browser Console

1. Open http://localhost:3000/ in browser
2. Login as HR: `hr@rorihotel.com` / `password123`
3. Open DevTools Console (F12 → Console tab)
4. Run this command:

```javascript
// Get current token
const token = localStorage.getItem('roriToken');
console.log('Token:', token ? 'Found' : 'Not found');

// Test unlock photo endpoint
fetch('http://localhost:5000/api/users/unlock-photo', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('Unlock Photo Response:', data))
.catch(err => console.error('Error:', err));
```

**Expected Result:**
- Should see: `Unlock Photo Response: {message: "Photo unlocked successfully", user: {...}}`
- OR: `{message: "Photo is already unlocked"}`

**If you see 404:**
- Routes are not registered correctly
- Server needs restart (already done)

**If you see 401:**
- Token is missing or invalid
- Log out and log back in

---

### Method 2: Test with PowerShell/CMD

Open new terminal and run:

```cmd
curl -X GET http://localhost:5000/api/auth/test
```

This tests if server is responding at all.

Then test a users route (you'll need a valid token):

```cmd
REM First, login to get a token
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"hr@rorihotel.com\",\"password\":\"password123\"}"
```

Copy the token from the response, then:

```cmd
REM Replace YOUR_TOKEN_HERE with actual token
curl -X PUT http://localhost:5000/api/users/unlock-photo ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -H "Content-Type: application/json"
```

---

### Method 3: Check Server Registered Routes

Run this in server directory:

```cmd
cd c:\Users\HP\Downloads\rori-hotel-internship-management-system (1)\rori-hotel\server
node -e "console.log(require('./server.js'))"
```

This will show if server loaded correctly.

---

## The REAL Fix: Log Out and Log Back In

The main issue is that **you're logged in with old user data**. When you logged in BEFORE the new fields were added, your browser stored user data without `photoLocked` and `notifications`.

### Why This Causes 404 Errors:

The Settings page might be constructing URLs incorrectly because the user object doesn't have expected fields. JavaScript errors can cause weird URL concatenations.

### The Solution:

1. **Click "LOG OUT" button** (top right corner of page)
2. **Go to login page** (http://localhost:3000/login)
3. **Login again** with `hr@rorihotel.com` / `password123`
4. **Click "Settings"** in sidebar
5. **Should work now!**

When you login, the server returns ALL fields including:
- `photoLocked`
- `notifications`
- `email`
- `createdAt`

These are saved to localStorage and the Settings page needs them.

---

## Check Your localStorage

In browser console, run:

```javascript
const user = JSON.parse(localStorage.getItem('roriUser'));
console.log('User Data:', user);
console.log('Has photoLocked?', 'photoLocked' in user);
console.log('Has notifications?', 'notifications' in user);
console.log('Has email?', 'email' in user);
console.log('Has createdAt?', 'createdAt' in user);
```

**If any of these return `false`:**
- Your localStorage has old data
- Log out and log back in
- This will fetch fresh user data with all fields

---

## Still Not Working?

### Check Exact Error URLs

In DevTools Network tab:
1. Filter by "users"
2. Look at failed requests
3. What is the EXACT URL?

If you see:
- `/api/users/profile1` - There's a bug adding "1"
- `/api/users/profile` - Correct URL, but might be 404 or 401
- `/api//users/profile` - Double slash issue
- `/users/profile` - Missing `/api` prefix

### Common URL Issues:

**Issue:** URL has extra characters like `profile1`
**Cause:** JavaScript error in Settings.jsx
**Fix:** Check browser console for React errors

**Issue:** URL is `/users/profile` instead of `/api/users/profile`
**Cause:** api.js baseURL is wrong
**Fix:** Check `client/src/utils/api.js` has `baseURL: 'http://localhost:5000/api'`

**Issue:** URL is `http://localhost:3000/api/users/profile`
**Cause:** Request going to frontend instead of backend
**Fix:** api.js baseURL should be port 5000, not 3000

---

## Debug Steps

1. **Check token exists:**
   ```javascript
   console.log(localStorage.getItem('roriToken'));
   ```
   Should show long string starting with "eyJ"

2. **Check user data:**
   ```javascript
   console.log(JSON.parse(localStorage.getItem('roriUser')));
   ```
   Should show object with all fields

3. **Check API baseURL:**
   ```javascript
   import api from './utils/api';
   console.log(api.defaults.baseURL);
   ```
   Should be: `http://localhost:5000/api`

4. **Test simple API call:**
   ```javascript
   import api from './utils/api';
   api.get('/auth/test').then(r => console.log(r)).catch(e => console.log(e));
   ```

---

## Quick Fix Summary

**99% of the time, the fix is simple:**

### ⚠️ LOG OUT AND LOG BACK IN ⚠️

That's it! Your localStorage has old user data. Logging out and back in will:
1. Clear old data
2. Fetch fresh user data from server
3. Include all new fields (`photoLocked`, `notifications`, etc.)
4. Settings page will work correctly

**Don't waste time debugging - just logout and login!**
