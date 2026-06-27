// This file defines all user settings routes for profile, email, password, notifications, and photo lock management.
// These routes are protected and allow users to update their personal information and preferences.
const express = require('express'); // Import express framework to create router for handling HTTP requests.
const router = express.Router(); // Create a new Express router instance to define route handlers.
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware to secure routes with JWT authentication.
const User = require('../models/User'); // Import User model to query and update user documents in MongoDB.
const bcrypt = require('bcryptjs'); // Import bcryptjs library for hashing and comparing passwords securely.
const multer = require('multer'); // Import multer middleware for handling multipart/form-data file uploads.
const { storage } = require('../config/cloudinary'); // Import Cloudinary storage configuration for uploading profile photos to cloud.
const { createNotification } = require('../utils/notifications'); // Import notification utility to send alerts to HR for account deletion requests.

// Configure multer to use Cloudinary storage for single profile photo uploads with field name profilePhoto.
const upload = multer({ storage: storage }); // Create multer instance with Cloudinary storage engine for handling file uploads.

// PUT route at /profile — Update user profile including fullName and profilePhoto with photo lock enforcement.
router.put('/profile', protect, upload.single('profilePhoto'), async (req, res) => { // Define PUT route with authentication and file upload middleware.
  try { // Start error handling block to catch any exceptions during profile update.
    const { fullName } = req.body; // Extract fullName from request body sent by client.
    const userId = req.user.id || req.user.userId; // Get authenticated user ID from JWT token attached by protect middleware.
    
    const user = await User.findById(userId); // Find user document in database by ID.
    if (!user) { // Check if user exists in database.
      return res.status(404).json({ message: 'User not found' }); // Return 404 error if user doesn't exist.
    } // End user existence check.
    
    // Check if user is trying to upload a new profile photo by checking if req.file exists.
    if (req.file) { // If a file was uploaded in this request.
      // PHOTO LOCK ENFORCEMENT — Check if the user's photo is currently locked before allowing upload.
      if (user.photoLocked === true) { // If photoLocked is true the photo cannot be changed.
        return res.status(403).json({ // Return 403 Forbidden status code.
          message: 'Your profile photo is locked. Please unlock it in Settings before changing your photo.' // Error message explaining photo is locked.
        }); // Close response object.
      } // End photo lock check.
      
      // Photo is unlocked or this is first photo upload, allow the change.
      user.profilePhoto = req.file.path; // Update profilePhoto field with Cloudinary URL from uploaded file.
      user.photoLocked = true; // Immediately lock the photo after saving to prevent accidental changes.
      console.log('[Profile Update] Photo uploaded and locked for user:', userId); // Log photo upload and lock action.
    } // End file upload check.
    
    // Update fullName if provided in request body, this is allowed even when photo is locked.
    if (fullName) { // Check if fullName was sent in request.
      user.fullName = fullName; // Update user's full name with new value.
      console.log('[Profile Update] Full name updated for user:', userId); // Log name change action.
    } // End fullName update.
    
    await user.save(); // Save updated user document to MongoDB database.
    
    // Return success response with updated user data including photoLocked status.
    return res.status(200).json({ // Return 200 OK status with response body.
      message: 'Profile updated successfully', // Success message.
      user: { // Return updated user object with relevant fields.
        _id: user._id, // User ID.
        fullName: user.fullName, // Updated full name.
        email: user.email, // Email address.
        role: user.role, // User role.
        profilePhoto: user.profilePhoto, // Updated profile photo URL.
        photoLocked: user.photoLocked, // Photo lock status.
        createdAt: user.createdAt // Account creation date.
      } // Close user object.
    }); // Close response.
  } catch (error) { // Catch any errors during profile update.
    console.error('[Profile Update] Error:', error.message); // Log error to console.
    return res.status(500).json({ message: 'Server error updating profile' }); // Return 500 server error.
  } // End try-catch block.
}); // Close PUT /profile route.

// PUT route at /email — Update user email address with uniqueness validation.
router.put('/email', protect, async (req, res) => { // Define PUT route with authentication middleware only.
  try { // Start error handling block.
    const { newEmail } = req.body; // Extract new email from request body.
    const userId = req.user.id || req.user.userId; // Get authenticated user ID from JWT token.
    
    // Validate that newEmail is provided and not empty.
    if (!newEmail || newEmail.trim() === '') { // Check if new email is missing or empty.
      return res.status(400).json({ message: 'New email address is required' }); // Return 400 bad request error.
    } // End validation.
    
    const user = await User.findById(userId); // Find user document by ID.
    if (!user) { // Check if user exists.
      return res.status(404).json({ message: 'User not found' }); // Return 404 if user not found.
    } // End existence check.
    
    // Check if new email is different from current email.
    if (newEmail.toLowerCase().trim() === user.email.toLowerCase()) { // Compare emails case-insensitive.
      return res.status(400).json({ message: 'New email is the same as current email' }); // Return error if emails match.
    } // End same email check.
    
    // Check if new email is already used by another user in the database.
    const existingUser = await User.findOne({ email: newEmail.toLowerCase().trim() }); // Query for user with this email.
    if (existingUser) { // If email already exists.
      return res.status(400).json({ message: 'This email is already in use by another account' }); // Return error.
    } // End duplicate check.
    
    user.email = newEmail.toLowerCase().trim(); // Update user email with new value normalized to lowercase.
    await user.save(); // Save updated user to database.
    
    console.log('[Email Update] Email changed for user:', userId, 'to', newEmail); // Log email change.
    return res.status(200).json({ // Return success response.
      message: 'Email updated successfully', // Success message.
      user: { // Return updated user object.
        _id: user._id,
        fullName: user.fullName,
        email: user.email, // Updated email.
        role: user.role,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (error) { // Catch errors.
    console.error('[Email Update] Error:', error.message); // Log error.
    return res.status(500).json({ message: 'Server error updating email' }); // Return server error.
  } // End try-catch.
}); // Close PUT /email route.

// PUT route at /password — Update user password with current password verification and hashing.
router.put('/password', protect, async (req, res) => { // Define PUT route with authentication.
  try { // Start error handling.
    const { currentPassword, newPassword } = req.body; // Extract passwords from request body.
    const userId = req.user.id || req.user.userId; // Get user ID from token.
    
    // Validate that both passwords are provided.
    if (!currentPassword || !newPassword) { // Check if either password is missing.
      return res.status(400).json({ message: 'Current password and new password are required' }); // Return validation error.
    } // End validation.
    
    // Validate new password meets minimum length requirement.
    if (newPassword.length < 8) { // Check if new password is too short.
      return res.status(400).json({ message: 'New password must be at least 8 characters long' }); // Return length error.
    } // End length check.
    
    const user = await User.findById(userId); // Find user in database.
    if (!user) { // Check existence.
      return res.status(404).json({ message: 'User not found' }); // Return not found error.
    } // End check.
    
    // Verify current password matches stored hash using bcrypt compare.
    const isMatch = await bcrypt.compare(currentPassword, user.password); // Compare plain text with hash.
    if (!isMatch) { // If passwords don't match.
      return res.status(401).json({ message: 'Current password is incorrect' }); // Return unauthorized error.
    } // End password verification.
    
    // Hash new password with 10 salt rounds before storing in database.
    const saltRounds = 10; // Set bcrypt salt rounds for hashing complexity.
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds); // Generate secure hash of new password.
    
    user.password = hashedPassword; // Update user password with hashed version.
    await user.save(); // Save updated user to database.
    
    console.log('[Password Update] Password changed for user:', userId); // Log password change.
    return res.status(200).json({ message: 'Password updated successfully' }); // Return success.
  } catch (error) { // Catch errors.
    console.error('[Password Update] Error:', error.message); // Log error.
    return res.status(500).json({ message: 'Server error updating password' }); // Return server error.
  } // End try-catch.
}); // Close PUT /password route.

// PUT route at /notifications — Update user notification preferences toggles.
router.put('/notifications', protect, async (req, res) => { // Define PUT route with authentication.
  try { // Start error handling.
    const { emailNotifications, messageAlerts, applicationAlerts, newApplicationAlerts, scoreAlerts } = req.body; // Extract all toggle values from request body.
    const userId = req.user.id || req.user.userId; // Get user ID from token.
    
    const user = await User.findById(userId); // Find user in database.
    if (!user) { // Check if user exists.
      return res.status(404).json({ message: 'User not found' }); // Return not found error.
    } // End check.
    
    // Update user notifications object with provided toggle values, keep existing if not provided.
    user.notifications = { // Update notifications object.
      emailNotifications: emailNotifications !== undefined ? emailNotifications : user.notifications.emailNotifications, // Update if provided, else keep current.
      messageAlerts: messageAlerts !== undefined ? messageAlerts : user.notifications.messageAlerts, // Update if provided, else keep current.
      applicationAlerts: applicationAlerts !== undefined ? applicationAlerts : user.notifications.applicationAlerts, // Update if provided, else keep current.
      newApplicationAlerts: newApplicationAlerts !== undefined ? newApplicationAlerts : user.notifications.newApplicationAlerts, // Update if provided, else keep current.
      scoreAlerts: scoreAlerts !== undefined ? scoreAlerts : user.notifications.scoreAlerts // Update if provided, else keep current.
    }; // Close notifications update.
    
    await user.save(); // Save updated user to database.
    
    console.log('[Notifications Update] Preferences updated for user:', userId); // Log notification update.
    return res.status(200).json({ // Return success response.
      message: 'Notification preferences updated successfully', // Success message.
      notifications: user.notifications // Return updated notifications object.
    });
  } catch (error) { // Catch errors.
    console.error('[Notifications Update] Error:', error.message); // Log error.
    return res.status(500).json({ message: 'Server error updating notifications' }); // Return server error.
  } // End try-catch.
}); // Close PUT /notifications route.

// POST route at /delete-request — Submit account deletion request and notify HR.
router.post('/delete-request', protect, async (req, res) => { // Define POST route with authentication.
  try { // Start error handling.
    const userId = req.user.id || req.user.userId; // Get requesting user ID from token.
    
    const user = await User.findById(userId); // Find requesting user in database.
    if (!user) { // Check if user exists.
      return res.status(404).json({ message: 'User not found' }); // Return not found error.
    } // End check.
    
    // Find HR user to send notification about deletion request.
    const hrUser = await User.findOne({ role: 'hr' }); // Query for HR user account.
    if (hrUser) { // If HR user exists in system.
      // Create notification for HR about account deletion request with user details.
      await createNotification(
        hrUser._id, // Send notification to HR user ID.
        'Account Deletion Request', // Notification title.
        `User ${user.fullName} (${user.email}) with role ${user.role} has requested account deletion.`, // Message with requesting user details.
        '/hr/settings', // Link to HR settings page.
        'deletion' // Notification type.
      ); // Close createNotification call.
      console.log('[Delete Request] Notification sent to HR for user:', userId); // Log notification sent.
    } // End HR notification.
    
    console.log('[Delete Request] Deletion request submitted by user:', userId); // Log deletion request.
    return res.status(200).json({ // Return success response.
      message: 'Deletion request submitted successfully. HR has been notified.' // Success message.
    });
  } catch (error) { // Catch errors.
    console.error('[Delete Request] Error:', error.message); // Log error.
    return res.status(500).json({ message: 'Server error submitting deletion request' }); // Return server error.
  } // End try-catch.
}); // Close POST /delete-request route.

// PUT route at /unlock-photo — Unlock user's profile photo to allow changes.
router.put('/unlock-photo', protect, async (req, res) => { // Define PUT route with authentication only.
  try { // Start error handling block for unlock operation.
    const userId = req.user.id || req.user.userId; // Get authenticated user ID from JWT token.
    
    const user = await User.findById(userId); // Find user document in database by ID.
    if (!user) { // Check if user exists in database.
      return res.status(404).json({ message: 'User not found' }); // Return 404 error if user doesn't exist.
    } // End user existence check.
    
    // Check if photo is already unlocked to prevent unnecessary updates.
    if (user.photoLocked === false) { // If photoLocked is already false.
      return res.status(400).json({ message: 'Photo is already unlocked' }); // Return bad request since photo already unlocked.
    } // End already unlocked check.
    
    user.photoLocked = false; // Set photoLocked to false to unlock the profile photo.
    await user.save(); // Save updated user document to database.
    
    console.log('[Photo Unlock] Photo unlocked for user:', userId); // Log unlock action.
    return res.status(200).json({ // Return success response.
      message: 'Photo unlocked successfully', // Success message.
      user: { // Return updated user object.
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
        photoLocked: user.photoLocked // Return updated lock status set to false.
      }
    });
  } catch (error) { // Catch any errors during unlock operation.
    console.error('[Photo Unlock] Error:', error.message); // Log error to console.
    return res.status(500).json({ message: 'Server error unlocking photo' }); // Return 500 server error.
  } // End try-catch block.
}); // Close PUT /unlock-photo route.

module.exports = router; // Export router to be registered in main server file.
