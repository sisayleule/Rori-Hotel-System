# ⚡ ROTATION SYSTEM - QUICK TEST (5 MINUTES)

## ✅ Test the Department Rotation System

### Prerequisites:
- ✅ Backend running: http://localhost:5000/
- ✅ Frontend running: http://localhost:3000/
- ✅ Both servers confirmed running

---

## 🎯 Quick Test Flow

### Step 1: Login as HR (30 seconds)
```
URL: http://localhost:3000/login
Email: hr@rorihotel.com
Password: hr123456
```

### Step 2: View Any Student (30 seconds)
1. Click **"Applications"** in sidebar
2. Click any student name
3. Scroll down

**Expected Result:**
- ✅ If student is approved: See "Department Rotation Progress" section
- ✅ If student is pending: See approval form with 4 department dropdowns

---

### Step 3: Test Approval with Rotation (2 minutes)

**If student is PENDING:**

1. Click "Approve Application" button
2. Set start date (any future date)
3. Set end date (after start date)
4. Set rotation order:
   - **Department 1**: Housekeeping
   - **Department 2**: Kitchen  
   - **Department 3**: Front Office
   - **Department 4**: F&B Service
5. Click "Submit Approval"

**Expected Result:**
- ✅ Green success message appears
- ✅ "Department Rotation Progress" section appears
- ✅ Current department badge shows: **Housekeeping** (gold)
- ✅ Progress timeline shows:
  - Housekeeping: **In Progress** (gold circle with "2")
  - Others: **Upcoming** (gray circles)

---

### Step 4: Move to Next Department (1 minute)

1. Scroll to "Department Rotation Progress" section
2. Click **"Move to Next Department"** button
3. Wait for success message

**Expected Result:**
- ✅ Success message: "student moved to next department successfully"
- ✅ Current department badge changes to: **Kitchen** (gold)
- ✅ Progress timeline updates:
  - Housekeeping: **✓ Completed** (green with checkmark)
  - Kitchen: **In Progress** (gold circle with "3")
  - Others: **Upcoming** (gray circles)

4. Click **"Move to Next Department"** again

**Expected Result:**
- ✅ Current department: **Front Office** (gold)
- ✅ Completed: Housekeeping ✓, Kitchen ✓ (green)
- ✅ Active: Front Office (gold)
- ✅ Upcoming: F&B Service (gray)

5. Click **"Move to Next Department"** again

**Expected Result:**
- ✅ Current department: **F&B Service** (gold)
- ✅ All previous departments have green checkmarks
- ✅ F&B Service is gold (last department)

6. Click **"Move to Next Department"** one more time

**Expected Result:**
- ✅ Error message: "student has completed all departments in the rotation order"

---

### Step 5: Verify Student Dashboard (1 minute)

1. Note the student's email address
2. Logout from HR account
3. Login as that student
4. View dashboard

**Expected Result:**
- ✅ "Current Department" shows: **F&B Service**
- ✅ Rotation progress section displays
- ✅ Progress shows:
  - Stage 1: Housekeeping - **✓ Done** (green)
  - Stage 2: Kitchen - **✓ Done** (green)
  - Stage 3: Front Office - **✓ Done** (green)
  - Stage 4: F&B Service - **Active Now** (gold, animated)

---

## ✅ Success Criteria

All these must work:
- ✅ HR can set 4-department rotation order during approval
- ✅ Current department badge displays correctly
- ✅ Progress timeline shows correct colors (green/gold/gray)
- ✅ "Move to Next Department" button works
- ✅ Departments change in correct sequence
- ✅ Completed departments show green checkmarks
- ✅ Error message when trying to move past last department
- ✅ Student sees same rotation progress on their dashboard

---

## 🚨 Common Issues

### Issue 1: "Failed to approve"
**Solution**: Check all 4 department dropdowns are selected

### Issue 2: Button says "Processing..." forever
**Solution**: Check backend console for errors, refresh page

### Issue 3: Progress doesn't update after move
**Solution**: Refresh the page to see latest data

### Issue 4: Can't see rotation section
**Solution**: Student must be approved first, check status

---

## 📋 Validation Test (Extra 2 minutes)

### Test Duplicate Department:
1. Try to approve with same department twice
2. Department 1: Kitchen
3. Department 2: Kitchen ← duplicate
4. Department 3: Housekeeping
5. Department 4: Front Office
6. Click "Submit Approval"

**Expected Result:**
- ✅ Error: "please assign all 4 departments and make sure no department is repeated"

### Test Missing Department:
1. Leave Department 4 empty
2. Click "Submit Approval"

**Expected Result:**
- ✅ Error: "please assign all 4 departments for the rotation order"

---

## 🎉 If All Tests Pass:

**The rotation system is working perfectly!**

You can now:
- Register new students
- Approve them with custom rotation orders
- Move them through departments
- Track their progress
- Have supervisors see only their current students

---

## 🔄 Next Student Test

Want to test with a fresh student?

1. Go to http://localhost:3000/register
2. Register new student (use any test email)
3. Login as HR
4. Approve with different rotation order:
   - Department 1: Front Office
   - Department 2: F&B Service
   - Department 3: Housekeeping
   - Department 4: Kitchen
5. Verify rotation works with different order!

---

**Time to Complete**: 5-7 minutes
**Difficulty**: Easy
**Status**: Ready to test!

🚀 **Start testing now!**
