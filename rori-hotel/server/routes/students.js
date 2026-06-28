// This file handles all routes for the student role, including fetching profile info and results. Attendance removed in Phase 8.
const express = require('express'); // Import express to load routing structures.
const router = express.Router(); // Create a new router instance for student actions.
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware to guard paths.
const { requireRole } = require('../middleware/roleMiddleware'); // Import requireRole to enforce token authorization.
const Student = require('../models/Student'); // Import Student database model to query profiles.
// REMOVED Attendance import - attendance system completely removed in Phase 8.
const FinalResult = require('../models/FinalResult'); // Import FinalResult model to fetch evaluation details.
const User = require('../models/User'); // Import User database model to load account metadata.

// Create a GET route at path /me to fetch logged in student's unified profile data.
router.get('/me', protect, requireRole('student'), async (req, res) => { // Setup GET /me with protections.
  try { // Start error trapping sequence to capture database failures.
    const userId = req.user.id || req.user.userId; // Resolve active user ID from request properties.
    const userDoc = await User.findById(userId); // Find User doc matching verified credential credentials.
    const studentDoc = await Student.findOne({ userId: userId }); // Find student document mapping back to user doc.
    if (!studentDoc) { // Check if student profile document reference exists.
      return res.status(404).json({ message: "student profile not found" }); // Respond 404 error code if missing.
    } // End empty Student profiles handling.
    const mergedObj = { // Start constructing unified target response metadata objects.
      ...userDoc.toObject(), // Merge all standard user registration traits.
      ...studentDoc.toObject(), // Merge all specific student-themed criteria fields.
      userId: userDoc._id, // Add explicit userId reference key pointing to the user id.
      user: userDoc.toObject() // Add nested user object containing credentials to align with frontend components.
    }; // Close merged results target objects creation.
    return res.status(200).json(mergedObj); // Return 200 HTTP response codes.
  } catch (error) { // Trapping execution errors block.
    console.error('Error fetching student unified profile:', error); // Log failure to backend console.
    return res.status(500).json({ message: "Internal server error" }); // Reply code 500 indicating database fault.
  } // Terminate try-catch block.
}); // Close GET /me router endpoint.

// REMOVED /my-attendance route - attendance system completely removed in Phase 8.

// Create a GET route at path /my-results to fetch published evaluation sheets.
router.get('/my-results', protect, requireRole('student'), async (req, res) => { // Setup GET /my-results path.
  try { // Start try catch error containment context.
    const userId = req.user.id || req.user.userId; // Resolve incoming customer authorization token payload.
    const studentDoc = await Student.findOne({ userId: userId }); // Select associated Student metadata profile.
    if (!studentDoc) { // Run verification checks for profile existence.
      return res.status(404).json({ message: "Student profile not found" }); // Respond 404 error code if missing.
    } // End verification check.
    const resultDoc = await FinalResult.findOne({ studentId: studentDoc._id, isPublished: true }); // Find published grades.
    if (!resultDoc) { // In case final evaluations are absent or draft.
      return res.status(200).json({ published: false, message: "your result has not been published yet" }); // Deliver non-published indicators.
    } // End unpublished results handler.
    return res.status(200).json({ published: true, result: resultDoc }); // Deliver 200 codes along with payload elements.
  } catch (error) { // Trapping exceptions block.
    console.error('Error loading student final evaluation outcomes:', error); // Print diagnostic report logs.
    return res.status(500).json({ message: "Internal server error" }); // Respond 500 codes signifying failure.
  } // Terminate standard try catch wrapper.
}); // Close GET /my-results router endpoint.

module.exports = router; // Export the complete router dataset for application configuration.
