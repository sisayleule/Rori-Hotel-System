# Rori Hotel Internship Management System - Frontend Client

This is the frontend React application for the Rori Hotel Internship Management System built with Vite, React, and Tailwind CSS.

## Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Animations**: Vanilla Tilt

## Features

✅ Responsive design for desktop and mobile  
✅ Role-based dashboards (Student, HR, Supervisor)  
✅ Real-time messaging system  
✅ Document upload and viewing  
✅ PDF certificate download  
✅ Profile photo management with lock feature  
✅ Interactive statistics charts  
✅ Daily journal system  
✅ Notification center  
❌ Attendance system (removed in Phase 8)

## How to Run Locally

### Prerequisites

- Node.js (v18 or higher)
- Backend server running on http://localhost:5000

### Installation Steps

1. **Navigate to the client folder**
   ```bash
   cd rori-hotel/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Ensure `.env.local` exists with correct backend URL
   - File should contain:
     ```
     VITE_API_URL=http://localhost:5000/api
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will start on http://localhost:3000

5. **Open in browser**
   - Navigate to http://localhost:3000
   - You should see the Rori Hotel homepage

## How to Deploy to Vercel

### Prerequisites

Before deploying frontend, ensure:
- ✅ Backend is deployed to Render
- ✅ You have the Render backend URL
- ✅ MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

### Step 1: Update Production Environment Variables

1. **Open `.env.production`** in the client folder
2. **Update VITE_API_URL** with your actual Render backend URL:
   ```
   VITE_API_URL=https://rori-hotel-backend.onrender.com/api
   ```
   Replace `rori-hotel-backend` with your actual Render service name

3. **Save the file**

### Step 2: Commit and Push Changes

```bash
# From the root rori-hotel folder
git add .
git commit -m "Update production API URL for Vercel deployment"
git push origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"New Project"**
4. Find and select repository: `Rori-Hotel-System`
5. Click **"Import"**

### Step 4: Configure Vercel Project

Fill in the configuration:

- **Framework Preset**: Select `Vite` from dropdown
- **Root Directory**: Click `Edit` and type `rori-hotel/client`
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `dist` (auto-filled)

### Step 5: Add Environment Variable

1. Click **"Environment Variables"**
2. Add one variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-render-backend.onrender.com/api`
   - Replace with your actual Render backend URL
3. Leave environment as **"Production"**

### Step 6: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment
3. Vercel will show build logs in real-time

### Step 7: Get Your Vercel URL

After successful deployment:
- Vercel shows your URL: `https://rori-hotel-system.vercel.app` (example)
- **Copy this URL** - you'll need it for backend CORS configuration

### Step 8: Update Backend CORS

**CRITICAL STEP** - Without this, frontend cannot connect to backend!

1. Go to Render dashboard
2. Find your `rori-hotel-backend` service
3. Click **"Environment"** in left sidebar
4. Update these variables:
   - `CLIENT_URL_PROD` = `https://your-project.vercel.app` (your Vercel URL)
   - `CLIENT_URL` = `https://your-project.vercel.app` (same as above)
5. Click **"Save Changes"**
6. Render will automatically redeploy (wait 2-3 minutes)

### Step 9: Test Your Deployment

1. Open your Vercel URL in browser
2. Test these features:
   - ✅ Homepage loads with hotel photos
   - ✅ Can navigate to Register page
   - ✅ Can navigate to Login page
   - ✅ Can login with: `hr@rorihotel.com` / `hr123456`
   - ✅ Dashboard loads correctly
   - ✅ No CORS errors in browser console (F12)

## Important Notes

### vercel.json Configuration

⚠️ **CRITICAL**: The `vercel.json` file MUST exist in the client folder!

This file tells Vercel to redirect all routes to `index.html` so React Router can handle navigation.

**Without this file**:
- Refreshing any page gives 404 error ❌
- Direct URLs to pages don't work ❌

**With this file**:
- All routes work perfectly ✅
- Page refresh works ✅
- Direct URLs work ✅

### Environment Variables

- `.env.local` - Used for local development (localhost:5000)
- `.env.production` - Used for Vercel deployment (Render URL)
- Vite requires `VITE_` prefix for environment variables

### Build Command

The build command `npm run build`:
1. Compiles React code to optimized JavaScript
2. Bundles all assets (images, CSS, fonts)
3. Outputs everything to `dist` folder
4. Creates production-ready static files

### Testing Build Locally

Before deploying, test the production build locally:

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

This opens the production build at http://localhost:4173

## Troubleshooting

### Build Fails on Vercel

**Error**: `Module not found` or `Cannot find module`
- **Solution**: Ensure all dependencies are in `package.json`
- Run `npm install` locally and commit `package-lock.json`

### CORS Errors in Production

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`
- **Solution**: Verify `CLIENT_URL_PROD` in Render matches Vercel URL exactly
- Include `https://` in the URL
- Redeploy backend after updating

### Page Refresh Gives 404

**Error**: Refreshing `/student/dashboard` shows 404 Not Found
- **Solution**: Ensure `vercel.json` file exists in client folder
- Redeploy to Vercel after adding the file

### Environment Variables Not Working

**Error**: API calls go to wrong URL or fail
- **Solution**: Verify `VITE_API_URL` is set in Vercel dashboard
- Must include `/api` at the end of the URL
- Redeploy after updating environment variables

### Images Not Loading

**Error**: Hotel photos or profile pictures don't show
- **Solution**: Check image paths in public folder
- Verify Cloudinary credentials in backend
- Check browser console for 404 errors

## Project Structure

```
client/
├── public/              # Static assets
│   └── hotel-photos/    # Hotel department photos
├── src/
│   ├── components/      # Reusable components
│   │   ├── DashboardLayout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/         # React Context providers
│   │   └── AuthContext.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Settings.jsx
│   │   ├── student/     # Student dashboard pages
│   │   ├── hr/          # HR dashboard pages
│   │   └── supervisor/  # Supervisor dashboard pages
│   ├── utils/           # Utility functions
│   │   └── api.js       # Axios configuration
│   ├── App.jsx          # Main app with routes
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env.local           # Local development env
├── .env.production      # Production env
├── vercel.json          # Vercel routing config
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

## Available Scripts

### `npm run dev`
Starts development server on http://localhost:3000  
Hot reload enabled - changes appear instantly

### `npm run build`
Creates production build in `dist` folder  
Optimizes code for best performance

### `npm run preview`
Preview production build locally  
Runs on http://localhost:4173

## Default Login Accounts

Test the deployed app with these accounts:

| Role | Email | Password |
|------|-------|----------|
| HR | hr@rorihotel.com | hr123456 |
| Front Office Supervisor | fo@rorihotel.com | sup123456 |
| Housekeeping Supervisor | hk@rorihotel.com | sup123456 |
| Kitchen Supervisor | kt@rorihotel.com | sup123456 |
| F&B Supervisor | fb@rorihotel.com | sup123456 |

Students register through the public registration form.

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables are correct
3. Test backend API directly with Postman
4. Check browser console for errors (F12)

## License

This project is for Rori Hotel internal use only.
