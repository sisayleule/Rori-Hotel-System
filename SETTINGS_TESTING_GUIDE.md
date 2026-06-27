# Settings Feature - Complete Testing Guide

## Overview
The Settings feature is now **100% COMPLETE** with all 6 tabs implemented for all user roles (Student, HR, Supervisor).

---

## What Was Implemented

### ✅ Backend (100% Complete)
1. **User Model Updates** (`server/models/User.js`)
   - Added `photoLocked` field (Boolean, default: false)
   - Added `notifications` object with 5 toggle preferences

2. **New Routes** (`server/routes/users.js`)
   - `PUT /api/users/profile` - Update name/photo with lock enforcement
   - `PUT /api/users/email` - Update email with uniqueness validation
   - `PUT /api/users/password` - Update password with bcrypt verification
   - `PUT /api/users/notifications` - Save notification preferences
   - `POST /api/users/delete-request` - Submit account deletion request
   - `PUT /api/users/unlock-photo` - Unlock profile photo

3. **Login Route Update** (`server/routes/auth.js`)
   - Now returns ALL user fields including `photoLocked`, `notifications`, `email`, `createdAt`

### ✅ Frontend (100% Complete)
1. **Settings Page** (`client/src/pages/Settings.jsx`)
   - **Profile Tab**: Full name, role, member since, profile photo with lock feature
   - **Email Tab**: Current email (readonly), new email input, re-login warning
   - **Password Tab**: Current/new/confirm passwords, strength indicator, requirements list
   - **Notifications Tab**: 5 role-specific toggles (Email, Messages, Applications, New Applications, Scores)
   - **Privacy Tab**: Active sessions, account security info, danger zone (delete account)
   - **About Tab**: Logo, version, release date, quick links, copyright footer

2. **Sidebar Updates** (`client/src/components/Sidebar.jsx`)
   - Profile photo at top with 🔒 lock badge if `photoLocked = true`
   - Added Settings link for all 3 roles

3. **App Routes** (`client/src/App.jsx`)
   - `/student/settings` - Student settings route
   - `/hr/settings` - HR settings route
   - `/supervisor/settings` - Supervisor settings route

4. **Login Updates** (`client/src/pages/Login.jsx`)
   - Now stores ALL user fields in AuthContext including `photoLocked`, `notifications`, `email`, `createdAt`

---

## Testing Instructions

### 1. Start Both Servers

**Backend:**
```cmd
cd rori-hotel\server
node server.js
```
Should see: `Server running on http://localhost:5000/`

**Frontend:**
```cmd
cd rori-hotel\client
npm run dev
```
Should see: `Local: http://localhost:3000/`

---

### 2. Test Profile Tab (Photo Lock Feature)

**Login as any user:**
1. Go to `http://localhost:3000/login`
2. Login with any account (student/hr/supervisor)

**Navigate to Settings:**
3. Click "Settings" link in sidebar (at bottom of nav links)
4. Should see Settings page with 6 tabs at top

**Test Photo Lock Flow:**
5. Profile tab should be active by default
6. If photo is locked:
   - Should see "Profile Photo Locked 🔒" card
   - Click "🔓 Unlock Photo" button
   - Confirmation dialog appears: "Are you sure?"
   - Click "Yes, Unlock It"
   - Photo unlocks → "Change Photo" button appears
7. Click "Change Photo" → select image file
8. Update full name if desired
9. Click "Save Profile"
10. Photo auto-locks again after save
11. Check sidebar → should see lock badge 🔒 on profile photo

**Expected Results:**
- ✅ Photo unlocks only after confirmation
- ✅ "Change Photo" button only appears when unlocked
- ✅ Photo auto-locks after upload/save
- ✅ Lock badge shows in sidebar when locked
- ✅ Success message: "Profile updated successfully!"

---

### 3. Test Email Tab

**Navigate to Email tab:**
1. Click "email" tab at top
2. Current email shows in readonly input (grayed out)
3. Enter new email in "New Email Address" input
4. Warning card shows: "⚠️ After changing your email, you will be logged out"

**Test Email Change:**
5. Enter a NEW unique email (not already registered)
6. Click "Update Email"
7. Success message: "Email updated successfully! Please log in again with your new email."
8. After 2 seconds, automatic logout + redirect to login page
9. Login with NEW email and same password
10. Navigate to Settings → Email tab → verify new email shows

**Expected Results:**
- ✅ Email updates successfully
- ✅ Auto-logout after email change
- ✅ Can login with new email
- ✅ Error if email already exists
- ✅ Error if new email same as current

---

### 4. Test Password Tab

**Navigate to Password tab:**
1. Click "password" tab
2. See 3 password inputs: Current, New, Confirm
3. Enter current password
4. Enter new password

**Test Password Strength Indicator:**
5. Type password < 8 chars → "Weak" red indicator
6. Type password 8+ chars (letters only) → "Fair" orange indicator
7. Type password 8+ chars (letters + numbers) → "Good" yellow indicator
8. Type password 12+ chars (letters + numbers + symbols) → "Strong" green indicator
9. Strength bar grows from 25% → 100% based on level

**Test Password Update:**
10. Fill all 3 fields correctly
11. Click "Update Password"
12. Success message: "Password updated successfully!"
13. Logout and login with NEW password to verify

**Test Validation:**
- Try mismatched passwords → Error: "New passwords do not match"
- Try wrong current password → Error: "incorrect password"
- Try password < 8 chars → Error: "New password must be at least 8 characters long"

**Expected Results:**
- ✅ Strength indicator updates in real-time
- ✅ Requirements list visible
- ✅ Password updates successfully
- ✅ Can login with new password
- ✅ All validation errors display correctly

---

### 5. Test Notifications Tab

**Navigate to Notifications tab:**
1. Click "notifications" tab
2. Info card explains: "Control which notifications you receive. Some options are role-specific."

**Test Role-Specific Toggles:**

**For STUDENTS:**
- ✅ Email Notifications (visible)
- ✅ Message Alerts (visible)
- ✅ Application Status Updates (visible - student only)
- ❌ New Application Alerts (hidden - HR only)
- ✅ Score & Evaluation Alerts (visible - student/supervisor only)

**For HR:**
- ✅ Email Notifications (visible)
- ✅ Message Alerts (visible)
- ❌ Application Status Updates (hidden - student only)
- ✅ New Application Alerts (visible - HR only)
- ❌ Score & Evaluation Alerts (hidden - student/supervisor only)

**For SUPERVISORS:**
- ✅ Email Notifications (visible)
- ✅ Message Alerts (visible)
- ❌ Application Status Updates (hidden - student only)
- ❌ New Application Alerts (hidden - HR only)
- ✅ Score & Evaluation Alerts (visible - student/supervisor only)

**Test Toggle Switches:**
3. Click any toggle → should switch between enabled (gold) and disabled (gray)
4. Enabled = slider moves right, background turns gold (#C9A84C)
5. Disabled = slider moves left, background turns gray
6. Change multiple toggles
7. Click "Save Preferences"
8. Success message: "Notification preferences saved successfully!"
9. Refresh page → toggles retain saved states

**Expected Results:**
- ✅ Correct toggles visible for each role
- ✅ Toggles animate smoothly
- ✅ Preferences save successfully
- ✅ Preferences persist after refresh

---

### 6. Test Privacy Tab

**Navigate to Privacy tab:**
1. Click "privacy" tab

**Active Sessions Section:**
2. Should see "Current Device 💻" card
3. Badge says "This device"
4. Status shows "Active now"

**Account Security Section:**
5. Green shield card 🛡️
6. Message: "Your account is protected with password authentication"

**Danger Zone:**
7. Red danger zone card
8. Warning: "Once you request account deletion, HR will be notified"
9. Click "Request Account Deletion" button
10. Browser confirmation dialog: "Are you sure you want to request account deletion?"
11. Click OK
12. Success message: "Deletion request submitted. HR has been notified."

**Expected Results:**
- ✅ Active session displays correctly
- ✅ Security info visible
- ✅ Delete button requires confirmation
- ✅ Success message after deletion request

---

### 7. Test About Tab

**Navigate to About tab:**
1. Click "about" tab

**Logo & Branding:**
2. Hotel logo displays at top (20x20, rounded, bordered)
3. "Rori Hotel" title in serif font
4. "Internship Management System" subtitle

**Version Info:**
5. Gray card with version details:
   - Version: 1.0.0
   - Released: 2024

**Quick Links:**
6. "Back to Dashboard" button
7. Click it → redirects to role-specific dashboard

**Footer:**
8. Copyright: "© 2024 Rori Hotel. All rights reserved."
9. System description: "Internship Management System"

**Expected Results:**
- ✅ Logo loads correctly
- ✅ Version info displays
- ✅ Dashboard button works
- ✅ Footer shows current year

---

## Cross-Role Testing

**Test with all 3 roles:**

1. **Student Account:**
   - Login → Settings link in sidebar
   - All 6 tabs accessible
   - Notifications tab shows student-specific toggles
   - Profile photo lock works

2. **HR Account:**
   - Login → Settings link in sidebar
   - All 6 tabs accessible
   - Notifications tab shows HR-specific toggles
   - Profile photo lock works

3. **Supervisor Account:**
   - Login → Settings link in sidebar
   - All 6 tabs accessible
   - Notifications tab shows supervisor-specific toggles
   - Profile photo lock works

---

## Visual Checks

**Sidebar:**
- ✅ Profile photo at top with lock badge if locked
- ✅ Settings link at bottom of navigation
- ✅ Golden active state on Settings link when on Settings page

**Settings Page:**
- ✅ 6 tab navigation (Profile, Email, Password, Notifications, Privacy, About)
- ✅ Active tab has golden underline and golden text
- ✅ Inactive tabs are gray
- ✅ All inputs styled consistently
- ✅ Success messages are green
- ✅ Error messages are red
- ✅ Warning cards are amber
- ✅ Danger zone is red

---

## Known Behaviors

1. **Photo Lock Auto-Lock:** Photos automatically lock after upload/save
2. **Email Change Logout:** Changing email triggers automatic logout after 2 seconds
3. **Password Validation:** Passwords must be minimum 8 characters
4. **Notification Toggles:** Some toggles are role-specific (hide for wrong roles)
5. **Delete Request:** Only sends notification to HR, doesn't actually delete account

---

## Troubleshooting

**"Cannot read properties of undefined" error:**
- Check browser console
- Verify backend is running on port 5000
- Check if all user fields are returned from login route
- Clear localStorage and login again

**Settings link not appearing:**
- Check Sidebar.jsx has Settings link in navLinks array
- Verify App.jsx has Settings routes for all 3 roles

**Photo not updating:**
- Check Cloudinary credentials in server/.env
- Verify Cloudinary preset is set to "unsigned"
- Check network tab for upload errors

**Toggles not saving:**
- Check backend route /api/users/notifications exists
- Verify User model has notifications field
- Check browser network tab for request errors

---

## Files Modified

### Backend (3 files):
1. `server/models/User.js` - Added photoLocked and notifications fields
2. `server/routes/users.js` - Created 6 new routes
3. `server/routes/auth.js` - Updated login response to return all user fields

### Frontend (5 files):
1. `client/src/pages/Settings.jsx` - Complete Settings page with 6 tabs
2. `client/src/components/Sidebar.jsx` - Profile photo with lock badge + Settings links
3. `client/src/App.jsx` - Added 3 Settings routes
4. `client/src/pages/Login.jsx` - Updated to store all user fields
5. `client/src/context/AuthContext.jsx` - Already had updateUser function (no changes needed)

---

## Status: ✅ COMPLETE

All requirements for Task 3 (Settings Feature) have been successfully implemented and are ready for testing.
