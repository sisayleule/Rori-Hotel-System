// Import the express library module to allow handling HTTP endpoint routes easily.
const express = require('express'); // Create an express instance.
// Retrieve the Router constructor object from express to build modular route handlers.
const router = express.Router(); // Instantiate the router engine.
// Import the bcryptjs library for securely hashing user passwords during registration and login checks.
const bcrypt = require('bcryptjs'); // Require bcryptjs library.
// Import the jsonwebtoken library to generate secure authentication tokens for session verification.
const jwt = require('jsonwebtoken'); // Require jsonwebtoken library.
// Import the multer library to handle multi-part form file uploads for student documents.
const multer = require('multer'); // Require multer library.
const rateLimit = require('express-rate-limit'); // Require rate limiting for public auth routes.
// Import our Mongoose model for User accounts to perform query and write operations.
const User = require('../models/User'); // Load User model.
// Import our Mongoose model for Student applications to create application data logs.
const Student = require('../models/Student'); // Load Student model.
// Import the Cloudinary storage engine and flag from config to upload files to cloud or local disk.
const { storage, useCloudinary } = require('../config/cloudinary'); // Load storage configuration and flag.
// Import the notification helper function to notify HR when new students register.
const { notifyAllWithRole } = require('../utils/notifications'); // Import notification helper.
// Import the email service functions to send real email notifications to users.
const { sendWelcomeEmail, sendApprovalEmail, sendRejectionEmail } = require('../utils/emailService'); // Import email notification functions.
const { getRequiredEnv } = require('../utils/env'); // Load required env helper.

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please try again later.' }
});

// Configure multer upload middleware with Cloudinary storage and file filtering for security.
const upload = multer({ // Create multer instance with configuration options.
  storage: storage, // Use Cloudinary storage engine from config file.
  limits: { // Set upload size limits to prevent abuse.
    fileSize: 10 * 1024 * 1024 // Maximum 10MB per file.
  }, // Close limits configuration.
  fileFilter: (req, file, cb) => { // Define file filter function to validate file types.
    console.log('File filter checking field:', file.fieldname, 'mimetype:', file.mimetype); // Log file being validated.
    // Define array of allowed MIME types for profile photos and internship letters.
    const allowedMimeTypes = [ // Create whitelist of permitted file types.
      'image/jpeg', // JPEG image format.
      'image/jpg', // JPG image format.
      'image/png', // PNG image format.
      'image/webp', // WebP image format.
      'application/pdf' // PDF document format.
    ]; // Close allowed types array.
    // Check if the uploaded file's MIME type is in the allowed list.
    if (allowedMimeTypes.includes(file.mimetype)) { // Validate file type.
      console.log('File accepted:', file.fieldname, file.originalname); // Log accepted file.
      cb(null, true); // Accept the file by calling callback with true.
    } else { // File type is not allowed.
      console.log('File rejected - invalid type:', file.mimetype); // Log rejected file.
      cb(null, false); // Reject the file by calling callback with false.
    } // End file type validation.
  } // Close fileFilter function.
}); // Close multer configuration.

// Create error-safe multer upload handler that catches upload errors without crashing the entire registration.
// Using upload.fields instead of upload.any to specify exact field names and max counts for better control.
const handleUpload = (req, res, next) => { // Define custom middleware function to safely handle file uploads.
  // Call multer with specific fields configuration - profilePhoto and internshipLetter with 1 file each.
  upload.fields([ // Define array of expected file fields.
    { name: 'profilePhoto', maxCount: 1 }, // Accept max 1 profile photo file.
    { name: 'internshipLetter', maxCount: 1 } // Accept max 1 internship letter file.
  ])(req, res, (err) => { // Execute multer with error callback to catch upload errors.
    if (err) { // Check if multer encountered an upload error.
      console.error('Upload middleware error (non-fatal):', err.message); // Log the error for debugging without crashing.
      req.files = {}; // Set files to empty object when using upload.fields (not array).
      next(); // Continue to next middleware - registration will proceed without files.
    } else { // No multer errors occurred.
      console.log('Upload middleware success'); // Log successful upload processing.
      console.log('req.files keys:', req.files ? Object.keys(req.files) : 'none'); // Log which field names have files.
      next(); // Continue to route handler with successfully uploaded files.
    } // End error check.
  }); // Close multer execution with error callback.
}; // Close handleUpload middleware function.

// Define the registering endpoint POST route at '/register' accepting file attachments with safe error handling.
router.post('/register', authLimiter, handleUpload, async (req, res) => { // Declaring post route with custom upload handler.
  // Implement a safety try-catch block representing robust transaction error handling logic.
  try { // Start handling block.
    console.log('Registration started for email:', req.body.email); // Log registration attempt for debugging.
    
    // Retrieve required textual student registry details from request body mapping arrays.
    const fullName = req.body.fullName; // Grab user fullname value from form.
    const email = req.body.email; // Grab email value from submitted request.
    const password = req.body.password; // Grab plain text password value from submission.
    const universityName = req.body.universityName || ''; // Grab optional collegiate institution name with empty string fallback.
    const studentIdNumber = req.body.studentIdNumber || ''; // Grab optional registrar university ID with empty string fallback.
    const departmentPreference = req.body.departmentPreference || ''; // Grab optional department string value with empty string fallback.
    const phoneNumberValue = req.body.phoneNumber || ''; // Extract optional phone number with empty string fallback.
    
    // Confirm that only the essential fields (name, email, password) are provided - all other fields are optional.
    if (!fullName || !email || !password) { // Validate presence of only critical fields.
      console.warn('Registration validation failed: missing required fields'); // Log validation failure.
      // Respond with a bad client request error code if validation criteria fails.
      return res.status(400).json({ message: "full name, email and password are required" }); // Stop execution.
    } // End input state validation checking branch.
    
    // Look up the registered user dataset to prevent register profile email duplicates.
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() }); // Query collection matching email with case-insensitive trim.
    // Cancel the transaction if the queried email address is already taken.
    if (existingUser) { // Conditional logic check.
      console.warn('Registration failed: email already exists -', email); // Log duplicate email attempt.
      // Return a duplicate error registration message log back to client.
      return res.status(400).json({ message: "this email is already registered" }); // Trigger error 400.
    } // End duplication verification check.
    
    // Hash security check password using bcryptjs library module mapping 10 load salt rounds.
    const saltRoundsCount = 10; // Assign level of complexity for bcrypt hashing algorithm.
    const securedPassword = await bcrypt.hash(password, saltRoundsCount); // Compute password hash code securely.
    console.log('Password hashed successfully'); // Log successful password hashing.
    
    // Save the User record inside db directory.
    const newUserRecord = await User.create({ // Create database document record.
      fullName: fullName.trim(), // Bind registered full name with whitespace trimmed.
      email: email.toLowerCase().trim(), // Bind registered email login normalized to lowercase and trimmed.
      password: securedPassword, // Bind computed password hash.
      role: 'student' // Assign standard system student authorization parameters.
    }); // Complete registration document save.
    console.log('User saved to database with ID:', newUserRecord._id); // Log successful user creation.
    
    // Declare attachment file path placeholders to store Cloudinary secure HTTPS URLs or local file paths.
    let profilePhotoPathValue = ''; // Set base URL space for profile avatar Cloudinary link or local path.
    let internshipLetterPathValue = ''; // Set base URL space for registration letter Cloudinary link or local path.
    
    // Process uploaded files in a safe try-catch block so file errors never crash registration.
    try { // Start file processing error handling block.
      // Helper function to build correct public Cloudinary URL without signed tokens and with proper resource type for PDFs vs images.
      const buildUrl = (fieldName, files) => { // Define function accepting field name and files object to extract and correct URL.
        // Get file array for the specified field name from files object.
        const fileArray = files[fieldName]; // Extract array of files for this field name.
        // Check if file array exists and has at least one file uploaded.
        if (!fileArray || fileArray.length === 0) { // Validate file was uploaded for this field.
          console.log('[URL Build]', fieldName, 'not uploaded'); // Log when no file exists for this field.
          return ''; // Return empty string when no file uploaded.
        } // End file existence check.
        
        // Extract first file from array since we only accept one file per field.
        const file = fileArray[0]; // Get first file object from array.
        // Try multiple possible properties where Cloudinary might store the file URL.
        let url = file.secure_url || file.path || file.url || file.location || ''; // Check all common URL properties with fallback chain.
        console.log('[URL Build]', fieldName, 'raw URL:', url); // Log original URL extracted from file object.
        console.log('[URL Build]', fieldName, 'mimetype:', file.mimetype); // Log file MIME type for debugging.
        console.log('[URL Build]', fieldName, 'originalname:', file.originalname); // Log original filename for debugging.
        
        // If no URL was found in any property return empty string.
        if (!url) { // Check if URL is empty after trying all properties.
          console.log('[URL Build]', fieldName, 'ERROR: no URL found in file object'); // Log error when URL is missing.
          return ''; // Return empty string when no URL available.
        } // End URL existence check.
        
        // Remove any signed token pattern like s--pP6wCkQ9-- from URL using regex that matches s-- followed by any characters until next --.
        url = url.replace(/\/s--[^/]+--\//, '/'); // Strip signed token pattern from Cloudinary URL to make it plain public URL without expiration.
        
        // Check if this file is a PDF based on MIME type or filename extension for correct resource type.
        const isPDF = file.mimetype === 'application/pdf' || // Check if MIME type equals application/pdf format.
                      (file.originalname && file.originalname.toLowerCase().endsWith('.pdf')); // Also check if filename ends with .pdf extension case insensitive.
        // Check if this file is an image based on MIME type or common image extensions.
        const isImage = file.mimetype && file.mimetype.startsWith('image/'); // Check if MIME type starts with 'image/' like image/jpeg or image/png.
        
        // Handle PDF files - must use raw/upload resource type.
        if (isPDF) { // Check if PDF file detected.
          // Replace image/upload with raw/upload in URL path because PDFs must use raw resource type not image type to prevent corruption.
          url = url.replace('/image/upload/', '/raw/upload/'); // Fix image resource type to raw for proper PDF serving without corruption.
          // Also replace auto/upload with raw/upload as backup in case auto-detection resource type was used during upload.
          url = url.replace('/auto/upload/', '/raw/upload/'); // Fix auto resource type to raw as backup if auto-detection was used.
          // Ensure URL ends with .pdf extension for proper browser recognition.
          if (!url.toLowerCase().endsWith('.pdf')) { // Check if URL is missing .pdf extension.
            url = url + '.pdf'; // Append .pdf extension to URL for proper file type identification.
          } // End PDF extension check.
          console.log('[URL Build]', fieldName, 'PDF URL corrected to:', url); // Log corrected URL showing raw resource type fix.
        } else if (isImage) { // Handle image files - must use image/upload resource type.
          // Replace raw/upload with image/upload in URL path because images must use image resource type not raw type or Cloudinary returns 404.
          url = url.replace('/raw/upload/', '/image/upload/'); // Fix raw resource type to image for proper image serving without 404 errors.
          // Also replace auto/upload with image/upload as backup in case auto-detection resource type was used during upload.
          url = url.replace('/auto/upload/', '/image/upload/'); // Fix auto resource type to image as backup if auto-detection was used.
          console.log('[URL Build]', fieldName, 'IMAGE URL corrected to:', url); // Log corrected URL showing image resource type fix.
        } // End image URL correction.
        
        console.log('[URL Build]', fieldName, 'FINAL URL to save:', url); // Log final corrected URL that will be saved to database.
        return url; // Return corrected public URL without signed tokens and with proper resource type ready for database storage.
      }; // Close buildUrl helper function.
      
      // Get uploaded files object with fallback to empty object if no files uploaded.
      const uploadedFiles = req.files || {}; // Extract files from request with safe fallback.
      // Build correct public URLs for both profile photo and internship letter using helper function.
      const profilePhotoUrl = buildUrl('profilePhoto', uploadedFiles); // Extract and correct profile photo URL removing tokens and fixing resource type.
      const internshipLetterUrl = buildUrl('internshipLetter', uploadedFiles); // Extract and correct internship letter URL removing tokens and fixing resource type.
      
      // Assign corrected URLs to path variables for database save.
      profilePhotoPathValue = profilePhotoUrl; // Set profile photo path to corrected public URL.
      internshipLetterPathValue = internshipLetterUrl; // Set internship letter path to corrected public URL.
      
      console.log('Files processed - Photo:', profilePhotoPathValue ? 'uploaded' : 'not provided', 'Letter:', internshipLetterPathValue ? 'uploaded' : 'not provided'); // Log file processing results summary.
    } catch (fileErr) { // Catch any file processing errors.
      // Log file processing error but don't crash registration - files are optional.
      console.error('File processing error (non-fatal, continuing without files):', fileErr.message); // Log error as non-fatal.
      // Leave file paths empty and continue with registration.
    } // End file processing error handling.

    // Establish deep student application details linking registered child.
    const newStudentProfile = await Student.create({ // Create database profile.
      userId: newUserRecord._id, // Relate application record directly back to parent account - this is the only required field.
      universityName: universityName, // Save optional academia system name or empty string.
      studentIdNumber: studentIdNumber, // Save optional identifier student number sequence or empty string.
      departmentPreference: departmentPreference, // Bind optional preferred hotel team or empty string.
      profilePhoto: profilePhotoPathValue, // Bind optional profile image Cloudinary URL or empty string.
      idDocument: '', // Initialize fallback path for unrequired documents registry.
      internshipLetter: internshipLetterPathValue, // Bind optional verification letter Cloudinary URL or empty string.
      status: 'pending', // Initialize standard application routing review status tags.
      phoneNumber: phoneNumberValue // Bind optional newly added phone number parameter or empty string.
    }); // Save mapping structures parameters.
    console.log('Student profile saved to database with ID:', newStudentProfile._id); // Log successful student creation.
    console.log('Student saved with profilePhoto:', newStudentProfile.profilePhoto); // Log saved profile photo URL for verification.
    console.log('Student saved with internshipLetter:', newStudentProfile.internshipLetter); // Log saved internship letter URL for verification.

    // Notify all HR administrators of this event - wrapped in try-catch so it never blocks registration.
    try { // Start notification error handling.
      await notifyAllWithRole(
        'hr', // Send to all HR users.
        'New Trainee Registration', // Notification title.
        `Trainee ${fullName} has registered and submitted an internship application.`, // Notification message.
        `/hr/applications/${newStudentProfile._id}`, // Link to application details.
        'application' // Notification type.
      ); // Close notification call.
      console.log('HR notification sent successfully'); // Log successful notification.
    } catch (notifErr) { // Catch notification errors silently.
      console.error('[Registration] Failed to send notification (non-fatal):', notifErr.message); // Log error but continue.
    } // Close notification error handling.

    // Send welcome email to the newly registered student - wrapped in try-catch so email failure never blocks registration.
    try { // Start email sending error handling block.
      const emailSent = await sendWelcomeEmail(email, fullName);
      if (emailSent) {
        console.log('[Registration] Welcome email sent successfully to:', email);
      } else {
        console.warn('[Registration] Welcome email not sent to:', email);
      }
    } catch (emailErr) { // Catch any email sending errors without crashing registration.
      console.error('[Registration] Failed to send welcome email (non-fatal):', emailErr.message); // Log email error but continue registration process.
    } // Close email error handling block.

    console.log('Registration completed successfully for:', email); // Log successful registration completion.
    // Dispatch success response indicating student created successfully and awaits review.
    res.status(201).json({ // Return payload with 201 Created status.
      message: "registration successful please wait for HR approval", // Return descriptive message string.
      studentId: newStudentProfile._id // Attach reference value.
    }); // Close trigger response callback.
  } catch (err) { // Trap unforeseen exceptions context.
    // Write out actual exception description details directly to logs directory system with full stack trace.
    console.error('=== REGISTRATION FATAL ERROR ==='); // Log error section header.
    console.error('Error name:', err.name); // Log error type name.
    console.error('Error message:', err.message); // Log error message text.
    console.error('Error stack:', err.stack); // Log full stack trace for debugging.
    console.error('Request body keys:', Object.keys(req.body || {})); // Log which fields were in the request.
    console.error('Request files:', req.files ? Object.keys(req.files) : 'none'); // Log which files were uploaded.
    console.error('=== END REGISTRATION ERROR ==='); // Log error section footer.
    // Return standard system fault indicator message blocks with error details.
    res.status(500).json({ // Return 500 server error status.
      message: "something went wrong please try again" // User-friendly error message.
    }); // Deliver response details.
  } // Terminate try-catch trap block.
}); // Close register handler block.

// Define the login verification POST route at '/login' endpoint path.
router.post('/login', authLimiter, async (req, res) => { // Declaring post route middleware.
  // Secure route checks inside exception catching blocks.
  try { // Start handling logic.
    // Trace login parameters directly out from request body blocks.
    const email = req.body.email; // Pull credential security email block.
    const password = req.body.password; // Pull credential security password block.

    // Validate that inputs are provided
    if (!email || !password) {
      console.warn('Login draft failed: missing email or password');
      return res.status(400).json({ message: "email and password are required" });
    }

    // Perform database lookups inside users database matching registration logs.
    const normalizedEmail = email.toLowerCase().trim(); // Normalize email before lookup.
    const userAccount = await User.findOne({ email: normalizedEmail }); // Fire search query handler.
    // Assess user record availability presence.
    if (!userAccount) { // Case where matching account is missing.
      // Respond stating user doesn't exist on server directory logs.
      return res.status(401).json({ message: "invalid email or password" }); // Send generic authentication error.
    } // End account match conditional checkout.

    // Confirm that the userAccount has a password field
    if (!userAccount.password) {
      console.error(`User account for ${email} is missing a password hash in the database`);
      return res.status(500).json({ message: "Account setup is invalid. Please contact support." });
    }

    // Log types for diagnostic purposes
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Verifying credentials for ${normalizedEmail}`);
    }

    // Validate matching decrypted hash password criteria using password evaluation functions.
    const isPasswordValid = await bcrypt.compare(password, userAccount.password); // Run decryption verify check.
    // Abort session if verification matching is flawed.
    if (!isPasswordValid) { // Validation failed.
      // Block entry and output invalid message tags back to application UI.
      return res.status(401).json({ message: "invalid email or password" }); // Send unauthenticated 401 response.
    } // End validation check evaluation state.
    // Set up secure token verification payload containing identifying primary markers.
    const authenticationPayload = { // Construct jwt token metadata mapping values.
      userId: userAccount._id, // Bind the primary user log identifier.
      role: userAccount.role // Bind permission validation category parameters.
    }; // Close authorization packet.
    // Encrypt validation credential packages using standard process secure signature secret key logic.
    const authenticationToken = jwt.sign( // Construct encryption string key credentials.
      authenticationPayload, // Pass identity records.
      getRequiredEnv('JWT_SECRET'), // Access required signing secret.
      { expiresIn: '7d' } // Limit credentials active authorization timespan to 7 days.
    ); // Close verification transaction block.
    // Retain approved connection records and send variables back to user.
    res.status(200).json({ // Dispatch 200 connection status log.
      message: "login successful", // Confirm auth logs.
      token: authenticationToken, // Carry active token logs.
      role: userAccount.role, // Carry corresponding permission tags.
      userId: userAccount._id, // Carry registered object mapping id.
      fullName: userAccount.fullName, // Carry customer registered name.
      email: userAccount.email, // Carry user email address.
      profilePhoto: userAccount.profilePhoto || "", // Carry profile photo.
      photoLocked: userAccount.photoLocked || false, // Carry photo lock status for Settings feature.
      notifications: userAccount.notifications || {}, // Carry notification preferences for Settings feature.
      createdAt: userAccount.createdAt // Carry account creation timestamp for Settings display.
    }); // Close dispatch response interface parameters.
  } catch (err) { // Capture server failures context.
    // Output error stack variables to console interface.
    console.error('Session signing authentication failed:', err); // Print console tracking variables.
    // Return standard system fault indicator message.
    res.status(500).json({ message: "something went wrong" }); // Deliver response details.
  } // Terminate try-catch trap block.
}); // Close login handler block.

// PUT /api/auth/settings - Update profile photo, email, password, and fullName
const { protect } = require('../middleware/authMiddleware'); // Load protect middleware inline.
router.put('/settings', protect, upload.any(), async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { email, password, fullName } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate email uniqueness if changing email
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'This email is already in use' });
      }
      user.email = email;
    }

    if (fullName) {
      user.fullName = fullName;
    }

    // If new password has been passed
    if (password && password.trim() !== '') {
      const saltRoundsCount = 10;
      user.password = await bcrypt.hash(password, saltRoundsCount);
    }

    // Look for profile photo upload from settings update form.
    if (req.files && req.files.length > 0) { // Check if files were uploaded.
      for (let i = 0; i < req.files.length; i++) { // Loop through uploaded files.
        const file = req.files[i]; // Get current file reference.
        if (file.fieldname === 'profilePhoto') { // Check if this is the profile photo field.
          // For Cloudinary: use file.path which contains HTTPS URL
          // For local storage: use 'uploads/' + file.filename to create relative path
          const url = file.path || (file.filename ? `uploads/${file.filename}` : ''); // Get URL or path.
          if (url) { // Check if URL is not empty.
            user.profilePhoto = url; // Update user profile photo with URL or path.

            // Update student record as well if user is student role.
            if (user.role === 'student') { // Check if user has student role.
              await Student.findOneAndUpdate({ userId }, { profilePhoto: url }); // Update student profile photo.
            } // End student role check.
          } // End URL check.
        } // End profile photo field check.
      } // End file loop.
    } // End files check.

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        userId: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        profilePhoto: user.profilePhoto || ''
      }
    });
  } catch (err) {
    console.error('Settings update failed:', err);
    res.status(500).json({ message: 'Internal server error updating settings' });
  }
});

// Export our authentication router handler block for server distribution mappings.
module.exports = router; // Deliver routes engine export.


// TESTING INSTRUCTIONS FOR CLOUDINARY DOCUMENT UPLOAD INTEGRATION - REQUIREMENT 2
// This comprehensive test validates that student profile photos and internship letters are properly uploaded to Cloudinary cloud storage.
// Test Steps:
// 1. Open browser and navigate to http://localhost:3000/register to access the student registration form page.
// 2. Fill in all required text fields: Full Name, Email Address, Phone Number with country code, Password, University Name, Student ID Number.
// 3. Select a Department Preference from the dropdown menu options (Front Office, Housekeeping, Kitchen, or F&B Service).
// 4. For Profile Photo field, click Choose File button and select a JPG or PNG image file from your local computer.
// 5. For Internship Approval Letter field, click Choose File and select either a PDF document OR a JPG/PNG image of the letter.
// 6. Click Submit Application button and wait for success message confirming registration was successful and HR will review.
// 7. After seeing success message, navigate to http://localhost:3000/login and sign in as HR using email: hr@rorihotel.com password: (default HR password).
// 8. Once logged in as HR, click Applications link in left sidebar navigation to view all pending student applications.
// 9. Locate the newly registered student in the applications list and click on their name to open detailed profile view.
// 10. In the student detail page, verify the profile photo displays correctly in the top section showing student information.
// 11. Scroll down to Submitted Documents section and click the View Photo link - it should open the student profile image in a new browser tab.
// 12. Verify the URL in the new tab starts with https://res.cloudinary.com/ confirming the file is hosted on Cloudinary cloud storage.
// 13. Return to student detail page and click View Letter link - it should open the internship letter document in a new browser tab.
// 14. Verify the letter opens correctly whether it was uploaded as PDF or image format, and URL starts with https://res.cloudinary.com/.
// 15. If both View Photo and View Letter links successfully open files in new tabs with Cloudinary URLs, the integration is working correctly.
// Expected Results:
// - All uploaded files should be stored on Cloudinary cloud storage, not on local server disk.
// - File URLs saved in database should be complete HTTPS URLs starting with https://res.cloudinary.com/rori-apparnt-mngt/.
// - Profile photos and letters should be viewable from any device with internet connection, not just localhost.
// - No files should be saved in the server/uploads folder since we switched from local disk storage to Cloudinary cloud storage.
// - Both PDF documents and image files (JPG, PNG) should upload and display correctly for internship letters.
