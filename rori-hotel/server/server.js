// Import the path module to resolve relative file paths across server folders.
const path = require('path'); // Load path library module instance.
// Require dotenv package and invoke its configuration method to load environment variables.
require('dotenv').config({ path: path.resolve(__dirname, '.env') }); // Load server local .env.
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') }); // Load root workspace .env as fallback.
// Import the seedData function from the utils folder to automatically create default staff accounts and QR tokens.
const { seedData } = require('./utils/seedData'); // Load seedling helper routines.
// Import the express framework module so we can build our backend web application server easily.
const express = require('express'); // Instantiate express library dependency.
// Import the cross-origin resource sharing (CORS) package to permit safe web clients domain connections.
const cors = require('cors'); // Load cors module library.
// Import the real mongoose database connection - connects to MongoDB Atlas cloud database not local mock.
const mongoose = require('mongoose'); // Load real mongoose library for MongoDB Atlas.

// Connect to MongoDB Atlas using connection string from environment variable.
const connectDB = async () => { // Define async database connection function.
  try { // Start error handling block.
    // Connect to MongoDB using environment variable - works for both local development and production deployment.
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rori-hotel'; // Use env variable with local fallback.
    await mongoose.connect(mongoUri); // Connect to database.
    console.log('Connected to MongoDB successfully'); // Log success message.
    // Call seedData after successful connection to create default users.
    await seedData(); // Run database seeding subroutine.
  } catch (error) { // Catch connection errors.
    console.error('MongoDB connection error:', error.message); // Log error message.
    console.error('Full error:', error); // Log full error details for debugging.
    process.exit(1); // Exit process with error code if database connection fails.
  } // Close try-catch block.
}; // Close connectDB function.

// Call connectDB to establish database connection on server startup.
connectDB(); // Initialize database connection.
// Import the auth routes configuration router module to manage student and staff authentications.
const authRoutes = require('./routes/auth'); // Load auth routes module.
// Import the student routes configuration router module.
const studentRoutes = require('./routes/students'); // Load student routes.
// MESSAGE ROUTES
// Import the messages routes configuration router module.
const messageRoutes = require('./routes/messages'); // Load messages routes.
// FEEDBACK ROUTES
// Import the student feedback routes configuration router module.
const feedbackRoutes = require('./routes/feedback'); // Load student feedback routes.
// APPLICATION ROUTES
// Import the applications routes configuration module to manage incoming intern submissions.
const applicationRoutes = require('./routes/applications'); // Load HR applications route.
// REMOVED ATTENDANCE ROUTER - attendance system completely removed in Phase 8.
// IMPORT SCORES ROUTER
const scoreRoutes = require('./routes/scores'); // Load HR/supervisor scores routes.
// IMPORT STATISTICS ROUTER
const statisticsRoutes = require('./routes/statistics'); // Load HR statistics routes.
// REMOVED QR ROUTER - QR code attendance system completely removed in Phase 8.
// IMPORT NOTIFICATIONS ROUTER
const notificationRoutes = require('./routes/notifications'); // Load notification routes.
// IMPORT USERS SETTINGS ROUTER
const usersRoutes = require('./routes/users'); // Load user settings routes for profile, email, password, notifications, and photo lock.
// IMPORT JOURNAL ROUTER FOR STUDENT DAILY ENTRIES
const journalRoutes = require('./routes/journal'); // Load journal routes for student daily journal entries and HR review.
// IMPORT RESULTS ROUTER FOR CERTIFICATE DOWNLOADS
const resultsRoutes = require('./routes/results'); // Load results routes for certificate downloads and regeneration.
// Instantiate an express application instance which will serve as our primary web routing and middleware engine.
const app = express(); // Initialize express app instance.

// Configure CORS options object to allow multiple frontend origins including localhost development servers.
const corsOptions = { // Define CORS configuration settings object.
  // Define origin validation function to check if incoming request origin is allowed to access API.
  origin: function (origin, callback) { // Create origin validation callback function.
    // List all allowed frontend URLs that can make requests to this backend server.
    const allowedOrigins = [ // Create array of permitted origins.
      'http://localhost:3000', // Vite default development server port.
      'http://localhost:5173', // Alternative Vite development server port.
      'http://127.0.0.1:3000', // Localhost IP address variant on port 3000.
      'http://127.0.0.1:5173', // Localhost IP address variant on port 5173.
      process.env.CLIENT_URL, // Environment variable for development client URL.
      process.env.CLIENT_URL_PROD // Environment variable for production client URL.
    ].filter(Boolean); // Remove any undefined or null values from the allowed origins array.
    // Check if request has no origin (server-to-server) or if origin is in allowed list.
    if (!origin || allowedOrigins.includes(origin)) { // Validate origin is permitted.
      callback(null, true); // Allow the request by calling callback with true.
    } else { // Origin is not in the allowed list.
      callback(new Error('Not allowed by CORS')); // Reject the request with CORS error.
    } // End origin validation check.
  }, // Close origin validation function.
  credentials: true, // Allow cookies and authorization headers to be sent with requests.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Specify which HTTP methods are allowed.
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'], // Specify which headers can be sent.
  optionsSuccessStatus: 200 // Set success status code for preflight OPTIONS requests to 200 instead of 204.
}; // Close CORS options configuration object.

// Apply CORS middleware to all routes using the configured options - MUST be first middleware.
app.use(cors(corsOptions)); // Enable CORS with custom options.
// Handle preflight OPTIONS requests explicitly for all routes - browsers send OPTIONS before POST/PUT/DELETE.
app.options('*', cors(corsOptions)); // Enable preflight CORS checks for all endpoints.

// Add backup CORS headers middleware to manually set headers on every response in case cors package misses edge cases.
app.use((req, res, next) => { // Create custom middleware function to set CORS headers.
  // Set Access-Control-Allow-Origin header to the requesting origin or default to localhost:3000.
  res.header('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:3000'); // Allow origin header.
  // Allow credentials (cookies, authorization headers) to be included in cross-origin requests.
  res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials header.
  // Specify which HTTP methods are permitted for cross-origin requests.
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS'); // Allow methods header.
  // Specify which request headers are allowed in cross-origin requests.
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin'); // Allow headers.
  // Handle preflight OPTIONS requests immediately by returning 200 status without processing further.
  if (req.method === 'OPTIONS') { // Check if request is preflight OPTIONS.
    return res.status(200).end(); // End OPTIONS request with success status.
  } // End OPTIONS check.
  next(); // Continue to next middleware in the chain.
}); // Close backup CORS headers middleware.

// Mount the JSON parsing middleware to allow the express server to automatically parse incoming JSON payloads.
app.use(express.json()); // Enable JSON formats parsing engine.
// Mount URL encoded body parsers with nested attributes object structures scanning activated.
app.use(express.urlencoded({ extended: true })); // Enable standard URL body decoders.
// Mount the authentication routing engine middleware on the /api/auth namespace path.
app.use('/api/auth', authRoutes); // Register auth controller routes pattern.
// Register the students database routing engine middleware on /api/students.
app.use('/api/students', studentRoutes); // Mount student router.
// Register the messages database routing engine middleware on /api/messages.
app.use('/api/messages', messageRoutes); // Mount message router.
// Register the student feedback database routing engine middleware on /api/feedback.
app.use('/api/feedback', feedbackRoutes); // Mount feedback router.
// Register the applications database routing engine middleware on /api/applications.
app.use('/api/applications', applicationRoutes); // Mount applications router.
// REMOVED ATTENDANCE ROUTES - attendance system completely removed in Phase 8.
// Register the scores database routing engine middleware on /api/scores.
app.use('/api/scores', scoreRoutes); // Mount scores router.
// Register the statistics database routing engine middleware on /api/statistics.
app.use('/api/statistics', statisticsRoutes); // Mount statistics router.
// REMOVED QR ROUTES - QR code attendance system completely removed in Phase 8.
// Register the notification routing engine on /api/notifications.
app.use('/api/notifications', notificationRoutes); // Mount notifications router.
// Register the users settings routing engine on /api/users for profile, email, password, and preferences management.
app.use('/api/users', usersRoutes); // Mount users settings router.
// Register the journal routing engine on /api/journal for student daily entries and HR journal review.
app.use('/api/journal', journalRoutes); // Mount journal router for journal entry creation and retrieval.
// Register the results routing engine on /api/results for certificate downloads and regeneration.
app.use('/api/results', resultsRoutes); // Mount results router for certificate access endpoints.

// Determine if we are running in production - backend runs on Render, frontend on Vercel (separate deployments).
const isProduction = process.env.NODE_ENV === 'production';

// Serve student uploads folder as static - needed for internship letter downloads.
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// Create certificates directory if it doesn't exist and serve as static folder for certificate access.
const certificatesPath = path.join(__dirname, 'uploads', 'certificates'); // Construct path to certificates directory.
const fs = require('fs'); // Import fs module to check and create directory.
if (!fs.existsSync(certificatesPath)) { // Check if certificates directory exists.
  fs.mkdirSync(certificatesPath, { recursive: true }); // Create directory recursively if it doesn't exist.
} // Close directory check.
app.use('/certificates', express.static(certificatesPath)); // Serve certificates folder as static for direct URL access.

// Backend only serves API in production - frontend is deployed separately on Vercel.
// Provide a simple status endpoint to verify backend is running.
app.get('/', (req, res) => { // Declare status endpoint.
  res.json({ 
    message: "Rori Hotel API is running", 
    status: "ok", 
    environment: isProduction ? "production" : "development" 
  });
});

// KEEP-ALIVE MECHANISM - Prevent Render free tier from sleeping after 15 minutes of inactivity.
// This self-ping keeps the server awake and improves response times by avoiding cold starts.
if (isProduction) { // Only run keep-alive in production (Render).
  const https = require('https'); // Import https module for self-ping.
  const BACKEND_URL = process.env.BACKEND_URL || 'https://rori-hotel-system.onrender.com'; // Backend URL from env.
  
  // Ping the backend every 10 minutes (600000ms) to keep it awake.
  setInterval(() => { // Set up recurring ping timer.
    const url = `${BACKEND_URL}/`; // Ping the root status endpoint.
    console.log(`[Keep-Alive] Pinging ${url} to prevent sleep...`); // Log ping attempt.
    
    https.get(url, (res) => { // Make GET request to self.
      console.log(`[Keep-Alive] Ping successful - Status: ${res.statusCode}`); // Log success.
    }).on('error', (err) => { // Handle ping errors.
      console.error(`[Keep-Alive] Ping failed:`, err.message); // Log error.
    }); // Close error handler.
  }, 10 * 60 * 1000); // Run every 10 minutes (600000ms).
  
  console.log('[Keep-Alive] Self-ping mechanism enabled - server will stay awake'); // Log activation.
} // Close production check.

// Define the backend to run on environment port with fallback - Render provides dynamic PORT variable.
const port = process.env.PORT || 5000;
// Start the express application to listen to server socket requests on the specified port.
app.listen(port, "0.0.0.0", () => { // Bind server to host network interfaces.
  // Print the required confirmation running log console statement.
  console.log(`Server running on port ${port} in ${isProduction ? 'production' : 'development'} mode`); // Log running confirmation state indicators.
}); // Close app connection scope brackets.
