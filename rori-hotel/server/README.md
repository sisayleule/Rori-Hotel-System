# Rori Hotel Internship Management System - Backend Server

This is the backend API server for the Rori Hotel Internship Management System built with Node.js, Express, and MongoDB.

## Features After Phase 8

✅ Student online registration with document upload  
✅ HR application management (approve/reject)  
✅ Upwork-style messaging between students and HR  
✅ Department rotation system (4 departments)  
✅ Supervisor scoring (out of 100 per department)  
✅ HR compiles scores and publishes final results  
✅ PDF certificate generation with QR code  
✅ Real-time notification system  
✅ Settings with profile photo lock feature  
✅ Student feedback (complaints and recommendations)  
✅ Daily journal system for student reflections  
✅ Statistics dashboard with charts  
❌ Attendance and QR code system (removed in Phase 8)

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary (profile photos) + Local disk (internship letters)
- **Email**: Nodemailer with Gmail SMTP
- **PDF Generation**: PDFKit
- **QR Codes**: qrcode library (for certificates only)

## How to Run Locally

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account OR local MongoDB installation
- Cloudinary account (free tier)
- Gmail account with App Password enabled

### Installation Steps

1. **Navigate to the server folder**
   ```bash
   cd rori-hotel/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   ```bash
   copy .env.example .env
   ```
   - Open `.env` and fill in all required values:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A long random string (minimum 32 characters)
     - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
     - `CLOUDINARY_API_KEY`: Your Cloudinary API key
     - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
     - `EMAIL_USER`: Your Gmail address
     - `EMAIL_PASS`: Your Gmail app-specific password
     - `CLIENT_URL`: Frontend URL (http://localhost:3000 for development)

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The server will start on http://localhost:5000

5. **Verify the server is running**
   - Open http://localhost:5000 in your browser
   - You should see: `{"message":"Rori Hotel API is running","status":"ok"}`

## How to Deploy to Render

### Step 1: Prepare Your Code

Ensure all your code is pushed to GitHub at: https://github.com/sisayleule/Rori-Hotel-System

### Step 2: Create Render Web Service

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository: `sisayleule/Rori-Hotel-System`

### Step 3: Configure Render Service

Fill in the following settings:

- **Name**: `rori-hotel-backend` (or any name you prefer)
- **Region**: `Frankfurt (EU Central)` (closest to Ethiopia)
- **Branch**: `main`
- **Root Directory**: `rori-hotel/server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Plan**: `Free`

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add each of these:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `PORT` | `5000` | Render will override this with dynamic port |
| `MONGODB_URI` | `mongodb+srv://rori-apparent-mngt:Rori2710@cluster0.jjragcd.mongodb.net/?appName=Cluster0` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `RoriHotel_2026_x7kP9mL2vQ8nA5zT1wR` | Same as local .env |
| `CLOUDINARY_CLOUD_NAME` | `ddcdwdusw` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | `575186247735916` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `SAuwevU-QbF2bsq82SlBmBtDDH4` | Your Cloudinary API secret |
| `EMAIL_USER` | `ssisayleule@gmail.com` | Gmail address for sending emails |
| `EMAIL_PASS` | `qanp fbqi ixrl mkf` | Gmail app password (with spaces) |
| `CLIENT_URL` | `http://localhost:3000` | Will update after frontend deploys |
| `CLIENT_URL_PROD` | `https://placeholder.vercel.app` | Will update after frontend deploys |
| `NODE_ENV` | `production` | Sets production mode |
| `BACKEND_URL` | `https://placeholder.onrender.com` | Will update after getting Render URL |

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Watch the logs for these success messages:
   - `Connected to MongoDB successfully`
   - `Server running on port [PORT] in production mode`

### Step 6: Update URLs

After successful deployment:

1. **Copy your Render URL** (e.g., `https://rori-hotel-backend.onrender.com`)
2. **Update environment variables** in Render dashboard:
   - `BACKEND_URL` = `https://rori-hotel-backend.onrender.com`
   - `CLIENT_URL_PROD` = (will get this after Vercel deployment)
3. **Redeploy** (Render does this automatically when you save env variables)

### Step 7: Verify Deployment

1. Open your Render URL in browser
2. You should see: `{"message":"Rori Hotel API is running","status":"ok"}`
3. Test an API endpoint: `https://your-render-url.onrender.com/api/auth/login`

## Default Login Accounts

After deployment, these accounts are automatically created by seedData:

| Role | Email | Password | Department |
|------|-------|----------|------------|
| HR Manager | hr@rorihotel.com | hr123456 | Human Resources |
| Front Office Supervisor | fo@rorihotel.com | sup123456 | Front Office |
| Housekeeping Supervisor | hk@rorihotel.com | sup123456 | Housekeeping |
| Kitchen Supervisor | kt@rorihotel.com | sup123456 | Kitchen |
| F&B Supervisor | fb@rorihotel.com | sup123456 | Food & Beverage |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Student Routes
- `GET /api/students/me` - Get student profile
- `GET /api/students/my-results` - Get published results

### HR Routes
- `GET /api/applications` - Get all applications
- `PUT /api/applications/:id/approve` - Approve application
- `PUT /api/applications/:id/reject` - Reject application

### Messages
- `GET /api/messages` - Get user messages
- `POST /api/messages` - Send message

### Scores
- `POST /api/scores` - Submit supervisor score
- `GET /api/scores/student/:id` - Get student scores

### Results
- `POST /api/results/publish` - Publish final result (HR)
- `GET /api/results/certificate/:studentId` - Download certificate

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read

### Settings
- `PUT /api/users/profile` - Update profile
- `POST /api/users/upload-photo` - Upload profile photo
- `PUT /api/users/unlock-photo` - Unlock profile photo

## Important Notes

### Free Tier Limitations

⚠️ **Render Free Tier**:
- Services sleep after 15 minutes of inactivity
- First request after sleep takes ~30-50 seconds to wake up
- Subsequent requests are fast

⚠️ **MongoDB Atlas Free Tier**:
- 512 MB storage limit
- Sufficient for development and small deployments

⚠️ **File Storage**:
- Profile photos: Stored on Cloudinary (permanent)
- Internship letters: Stored on Render local disk (lost on redeploy)
- For production: Use Cloudinary or AWS S3 for all files

### MongoDB Atlas Network Access

Before deploying to Render:
1. Go to MongoDB Atlas dashboard
2. Click **Network Access** in sidebar
3. Click **Add IP Address**
4. Click **Allow Access from Anywhere** (0.0.0.0/0)
5. Click **Confirm**

Without this, Render cannot connect to your database!

## Troubleshooting

### MongoDB Connection Failed
- Check MongoDB Atlas Network Access allows 0.0.0.0/0
- Verify MONGODB_URI is correct in Render environment variables
- Check MongoDB Atlas cluster is running

### CORS Errors
- Verify CLIENT_URL_PROD matches your Vercel URL exactly
- Include https:// protocol in the URL
- Redeploy after updating CORS settings

### Email Not Sending
- Verify EMAIL_USER and EMAIL_PASS are correct
- Ensure Gmail App Password (not regular password) is used
- Check Gmail hasn't blocked the app

### Files Not Uploading
- Check Cloudinary credentials are correct
- Verify uploads folder exists with write permissions
- Check file size limits (10MB for letters, 5MB for photos)

## Development vs Production

### Development Mode (Local)
- Uses local MongoDB OR MongoDB Atlas
- CORS allows localhost:3000
- Detailed error messages
- Hot reload with nodemon

### Production Mode (Render)
- Must use MongoDB Atlas (no local DB on Render)
- CORS allows production Vercel URL
- Minimal error messages for security
- Auto-restarts on crash

## Support

For issues or questions:
- Check logs in Render dashboard
- Review MongoDB Atlas metrics
- Verify all environment variables are set correctly

## License

This project is for Rori Hotel internal use only.
