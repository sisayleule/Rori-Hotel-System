# Rori Hotel Internship Management System - Deployment Documentation

## 🌐 Live URLs

**Frontend (Client)**: `https://your-vercel-url.vercel.app`  
*Update this after Vercel deployment*

**Backend (API)**: `https://your-render-url.onrender.com`  
*Update this after Render deployment*

**API Base URL**: `https://your-render-url.onrender.com/api`  
*Use this URL in frontend environment variables*

---

## 📋 Default Login Accounts

Test the deployed application with these pre-configured accounts:

| Role | Email Address | Password | Department | Access Level |
|------|---------------|----------|------------|--------------|
| **HR Manager** | hr@rorihotel.com | hr123456 | Human Resources | Full admin access to all features |
| **Front Office Supervisor** | fo@rorihotel.com | sup123456 | Front Office | Score submission for FO students |
| **Housekeeping Supervisor** | hk@rorihotel.com | sup123456 | Housekeeping | Score submission for HK students |
| **Kitchen Supervisor** | kt@rorihotel.com | sup123456 | Kitchen | Score submission for KT students |
| **F&B Supervisor** | fb@rorihotel.com | sup123456 | Food & Beverage | Score submission for F&B students |

**Note**: Students register through the public registration form on the website.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18.x
- **Build Tool**: Vite (next-generation frontend tooling)
- **Styling**: Tailwind CSS 3.x (utility-first CSS framework)
- **Charts**: Recharts (composable charting library)
- **Routing**: React Router v6 (client-side routing)
- **HTTP Client**: Axios (promise-based HTTP client)
- **Animations**: Vanilla Tilt (3D tilt effects)

### Backend
- **Runtime**: Node.js (JavaScript runtime)
- **Framework**: Express.js (minimalist web framework)
- **Database**: MongoDB Atlas (cloud NoSQL database)
- **ODM**: Mongoose (MongoDB object modeling)
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer (multipart/form-data handling)
- **Email**: Nodemailer (email sending library)
- **PDF Generation**: PDFKit (PDF document creation)
- **QR Codes**: qrcode library (QR code generation for certificates)

### Cloud Services & Hosting
- **Frontend Hosting**: Vercel (serverless deployment platform)
- **Backend Hosting**: Render (unified cloud platform)
- **Database**: MongoDB Atlas (managed MongoDB service)
- **File Storage**: 
  - Cloudinary (profile photos - permanent cloud storage)
  - Render local disk (internship letters - temporary storage)

### Development Tools
- **Version Control**: Git & GitHub
- **Package Manager**: npm
- **Environment Variables**: dotenv

---

## ✨ Features List (After Phase 8 - Attendance Removal)

### Student Features
✅ **Online Registration System**
- Complete registration form with profile photo upload
- Internship letter document upload (PDF format)
- Email and phone validation
- Automatic status tracking

✅ **Dashboard & Profile**
- View application status (Pending/Approved/Rejected)
- Track department rotation schedule
- View assigned start date
- Personal profile management

✅ **Messaging System** (Upwork-Style)
- Direct messaging with HR department
- Real-time message notifications
- Message history and threading
- Attachment support

✅ **Results & Certificates**
- View final internship results
- Download PDF completion certificate
- Certificate includes QR code for verification
- Score breakdown by department

✅ **Daily Journal**
- Document daily internship experiences
- Reflection and learning entries
- HR can review journal entries
- Date-stamped entries

✅ **Feedback System**
- Submit complaints and recommendations
- Anonymous feedback option
- Categorized feedback types
- HR review and response

✅ **Settings & Preferences**
- Profile photo management with lock feature
- Account information updates
- Password change
- Notification preferences

### HR (Human Resources) Features
✅ **Application Management**
- View all student applications
- Approve or reject applications
- Set internship start dates
- Assign department rotations
- View uploaded documents (photos, letters)

✅ **Student Database**
- Comprehensive student list
- Filter by status, department, dates
- Export student data
- Bulk actions support

✅ **Messaging Center**
- Communicate with all students
- Broadcast announcements
- Individual messaging
- Message tracking

✅ **Scores Management**
- View supervisor score submissions
- Compile final results
- Publish results to students
- Generate completion certificates

✅ **Statistics Dashboard**
- Application conversion metrics
- Department distribution charts
- Timeline analytics
- Status breakdown visualization
- Feedback overview

✅ **Student Feedback Review**
- View all student feedback
- Categorized feedback display
- Response management
- Trend analysis

✅ **Journal Review**
- Access student daily journals
- Monitor internship progress
- Provide guidance and feedback

### Supervisor Features (All Departments)
✅ **Student Roster**
- View assigned department students
- Track student progress
- Access student profiles

✅ **Score Submission**
- Submit evaluation scores (out of 100)
- One-time score submission (locked after submit)
- Score validation and confirmation
- Department-specific scoring

✅ **Profile Management**
- Update supervisor profile
- Upload profile photo with lock feature
- Manage account settings

### Cross-Role Features
✅ **Real-time Notifications**
- Application status updates
- New message alerts
- Score publication notifications
- System announcements

✅ **Profile Photo Lock System**
- Upload profile photo
- Lock photo to prevent changes
- Unlock with verification code
- Verification code sent via email

✅ **Secure Authentication**
- JWT-based authentication
- Role-based access control
- Session management
- Automatic token refresh

✅ **Responsive Design**
- Mobile-friendly interface
- Tablet optimization
- Desktop full-feature access

### Removed Features (Phase 8)
❌ **QR Code Attendance System** - Completely removed
❌ **Daily Clock-in/Clock-out** - Completely removed
❌ **Attendance Tracking** - Completely removed
❌ **Punctuality Reports** - Completely removed
❌ **QR Token Generation** - Completely removed

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │            React App (Vercel Hosting)               │    │
│  │                                                      │    │
│  │  • Student Dashboard    • HR Dashboard              │    │
│  │  • Supervisor Dashboard • Public Pages              │    │
│  │  • Messaging UI         • Settings Pages            │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           │ HTTPS Requests                   │
│                           ▼                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        SERVER SIDE                           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │        Express API Server (Render Hosting)          │    │
│  │                                                      │    │
│  │  • Authentication Routes    • Student Routes         │    │
│  │  • HR Routes               • Supervisor Routes      │    │
│  │  • Messaging Routes        • Results Routes         │    │
│  │  • Notification Routes     • Settings Routes        │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           │ MongoDB Queries                  │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │           MongoDB Atlas (Cloud Database)            │    │
│  │                                                      │    │
│  │  • Users Collection        • Students Collection     │    │
│  │  • Applications Collection • Messages Collection     │    │
│  │  • Scores Collection      • Results Collection      │    │
│  │  • Notifications Collection • Feedback Collection    │    │
│  │  • Journal Collection                                │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                        │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │   Cloudinary     │  │   Gmail SMTP     │                │
│  │  (Photo Storage) │  │ (Email Service)  │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Deployment Configuration

### Environment Variables Summary

#### Backend (Render)
```
PORT=5000
MONGODB_URI=mongodb+srv://rori-apparent-mngt:Rori2710@cluster0.jjragcd.mongodb.net/?appName=Cluster0
JWT_SECRET=RoriHotel_2026_x7kP9mL2vQ8nA5zT1wR
CLOUDINARY_CLOUD_NAME=ddcdwdusw
CLOUDINARY_API_KEY=575186247735916
CLOUDINARY_API_SECRET=SAuwevU-QbF2bsq82SlBmBtDDH4
EMAIL_USER=ssisayleule@gmail.com
EMAIL_PASS=qanp fbqi ixrl mkf
CLIENT_URL=http://localhost:3000
CLIENT_URL_PROD=https://[YOUR-VERCEL-URL].vercel.app
NODE_ENV=production
BACKEND_URL=https://[YOUR-RENDER-URL].onrender.com
```

#### Frontend (Vercel)
```
VITE_API_URL=https://[YOUR-RENDER-URL].onrender.com/api
```

---

## 📝 Maintenance Notes

### Free Tier Service Limitations

#### Render Free Tier
⚠️ **Automatic Sleep After Inactivity**
- Services sleep after **15 minutes** of no incoming requests
- First request after sleep takes **30-50 seconds** to "wake up"
- Subsequent requests are fast once the service is awake
- **Solution**: Use a uptime monitoring service (like UptimeRobot) to ping your API every 10 minutes

⚠️ **Monthly Runtime Limit**
- Free tier provides 750 hours per month
- Sufficient for development and testing
- For 24/7 uptime, consider upgrading to paid tier

#### MongoDB Atlas Free Tier
⚠️ **Storage Limitation**
- **512 MB** total storage limit on free tier (M0 cluster)
- Sufficient for approximately 5,000-10,000 student records
- Monitor storage usage in Atlas dashboard
- **Solution**: Upgrade to M10 tier ($0.08/hour) when approaching limit

⚠️ **Connection Limit**
- Maximum **100 simultaneous connections**
- Adequate for small to medium deployments
- Monitor connection pool usage

#### Vercel Free Tier
✅ **Generous Limits**
- Unlimited deployments
- 100 GB bandwidth per month
- No sleep/wake delay
- Sufficient for most use cases

### File Storage Considerations

#### Profile Photos (Cloudinary)
✅ **Permanent Storage**
- Photos are stored on Cloudinary cloud
- Survive backend redeployments
- Accessible via HTTPS URLs
- Free tier: 25 GB storage, 25 GB bandwidth/month

#### Internship Letters (Render Local Disk)
⚠️ **Temporary Storage**
- Letters stored on Render's ephemeral filesystem
- **Files are DELETED when Render redeploys** the service
- Redeployment happens on:
  - Manual redeploy button click
  - Environment variable changes
  - Git push to connected branch

**Production Recommendation**:
For production deployment, migrate letter storage to:
- **Cloudinary** (recommended - easy integration)
- **AWS S3** (enterprise solution)
- **Google Cloud Storage** (alternative option)

Current Implementation:
```javascript
// server/config/cloudinaryConfig.js
// Modify to handle both photos and letters
```

### Database Backup Strategy

⚠️ **No Automatic Backups on Free Tier**
- MongoDB Atlas M0 (free tier) does NOT include automated backups
- Manual export required for data protection

**Backup Recommendations**:
1. **Weekly Manual Exports**
   - Use `mongodump` command
   - Export to local machine
   - Store in secure location

2. **Upgrade to M10+ for Auto Backup**
   - Continuous backups with point-in-time recovery
   - Automated backup snapshots
   - One-click restore capability

3. **Export Command Example**:
   ```bash
   mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/database"
   ```

### Security Considerations

#### Environment Variables
🔒 **Never Commit These Files**:
- `.env`
- `.env.local`
- `.env.production` (with real values)

Always use `.env.example` with placeholder values in version control.

#### JWT Secret
- Current secret: `RoriHotel_2026_x7kP9mL2vQ8nA5zT1wR`
- Should be rotated every 6 months
- Invalidates all existing user sessions when changed

#### MongoDB Connection String
- Contains database password in plain text
- Rotate password every 90 days in MongoDB Atlas
- Update environment variable after rotation

#### Gmail App Password
- Specific to this application
- Can be revoked in Google Account settings
- Regenerate if compromised

### Monitoring & Logging

#### Render Logs
- Access via Render dashboard > Logs tab
- Real-time log streaming
- Search and filter capabilities
- Retained for 7 days on free tier

#### MongoDB Atlas Monitoring
- Database metrics dashboard
- Connection analytics
- Performance insights
- Query profiling

#### Vercel Analytics
- Deployment logs
- Build logs
- Function execution logs
- Real-time deployment status

### Performance Optimization

#### Frontend (Vercel)
✅ **Automatic Optimizations**:
- Edge caching
- Gzip compression
- Image optimization
- Code splitting

#### Backend (Render)
⚠️ **Manual Optimizations Needed**:
- Database query indexing
- Response caching
- Connection pooling
- Load balancing (paid tier)

### Scaling Considerations

#### When to Upgrade

**Upgrade Backend Hosting** when:
- Sleep/wake delay affects user experience
- Need 24/7 uptime
- Exceed 750 hours/month runtime
- Need more than 512 MB RAM

**Upgrade Database** when:
- Storage exceeds 400 MB (80% of limit)
- Need automated backups
- Require better performance
- Need dedicated resources

**Upgrade File Storage** when:
- Need permanent letter storage
- Exceed Cloudinary free tier limits
- Require CDN distribution

---

## 🆘 Troubleshooting Guide

### Common Deployment Issues

#### Issue: Backend deployment fails on Render
**Symptoms**: Build fails, service won't start
**Solutions**:
1. Check build logs for specific error
2. Verify `package.json` has all dependencies
3. Ensure `node_modules` is in `.gitignore`
4. Check Node.js version compatibility

#### Issue: Frontend build fails on Vercel
**Symptoms**: Build process fails during `npm run build`
**Solutions**:
1. Test build locally first: `npm run build`
2. Check for missing dependencies
3. Verify environment variables are set
4. Review Vercel build logs for specific errors

#### Issue: CORS errors in production
**Symptoms**: `Access to XMLHttpRequest has been blocked by CORS policy`
**Solutions**:
1. Verify `CLIENT_URL_PROD` in Render matches Vercel URL exactly
2. Include `https://` protocol in URL
3. Ensure no trailing slash in URL
4. Redeploy backend after updating CORS settings

#### Issue: Database connection fails
**Symptoms**: `MongoServerError: Authentication failed`
**Solutions**:
1. Verify MongoDB URI is correct
2. Check MongoDB Atlas Network Access allows 0.0.0.0/0
3. Confirm database user has read/write permissions
4. Test connection string locally first

#### Issue: Page refresh gives 404 on Vercel
**Symptoms**: Direct URLs or refresh gives "404 Not Found"
**Solutions**:
1. Ensure `vercel.json` exists in client folder
2. Verify `vercel.json` has correct rewrite rules
3. Redeploy after adding `vercel.json`

#### Issue: Images not loading
**Symptoms**: Profile photos or hotel images don't display
**Solutions**:
1. Check browser console for 404 errors
2. Verify Cloudinary credentials in backend
3. Check image URLs are absolute, not relative
4. Ensure CORS allows image loading

#### Issue: Emails not sending
**Symptoms**: Password resets, notifications not received
**Solutions**:
1. Verify `EMAIL_USER` and `EMAIL_PASS` are correct
2. Ensure Gmail App Password is used (not regular password)
3. Check Gmail hasn't blocked the app
4. Test email configuration with simple test

#### Issue: First request is very slow
**Symptoms**: 30-50 second delay on first request after period of inactivity
**Solution**:
- This is normal for Render free tier (service sleeps after 15 minutes)
- Use uptime monitoring to keep service awake
- Or upgrade to paid tier for 24/7 availability

---

## 📞 Support & Documentation

### Additional Resources

- **Backend README**: `rori-hotel/server/README.md`
- **Frontend README**: `rori-hotel/client/README.md`
- **GitHub Repository**: https://github.com/sisayleule/Rori-Hotel-System

### External Documentation

- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Cloudinary**: https://cloudinary.com/documentation

---

## 📜 License

This project is for **Rori Hotel internal use only**. All rights reserved.

---

**Last Updated**: Phase 8 - Attendance System Removal Complete  
**Deployment Status**: Ready for Production Deployment  
**System Version**: 2.0 (Post-Attendance Removal)
