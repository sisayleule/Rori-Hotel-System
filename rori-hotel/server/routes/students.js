// This file handles all routes for the student role, including fetching profile info, results, and attendance trackers.
const express = require('express'); // Import express to load routing structures.
const router = express.Router(); // Create a new router instance for student actions.
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware to guard paths.
const { requireRole } = require('../middleware/roleMiddleware'); // Import requireRole to enforce token authorization.
const Student = require('../models/Student'); // Import Student database model to query profiles.
const Attendance = require('../models/Attendance'); // Import Attendance database model for QR checking.
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

// Create a GET route at path /my-attendance to query daily clock-in records.
router.get('/my-attendance', protect, requireRole('student'), async (req, res) => { // Setup GET /my-attendance.
  try { // Start handling logic within safety blocks.
    const userId = req.user.id || req.user.userId; // Resolve currently calling user's unique identity key.
    const studentDoc = await Student.findOne({ userId: userId }); // Locate associated student profile details.
    if (!studentDoc) { // Check if Student is logged in database collections.
      return res.status(404).json({ message: "Student profile not found" }); // Deliver 404 response if absent.
    } // End verification validation check block.
    const records = await Attendance.find({ studentId: studentDoc._id }).sort({ date: -1 }); // Get student's records sorted descending.
    // Calculate summary statistics from the records array.
    const totalDays = records.length; // Set totalDays to length of records array.
    const lateDays = records.filter(record => record.isLate === true).length; // Filter records to count late checks.
    const presentDays = records.filter(record => record.clockIn).length; // Filter records to count clock-in logs.
    const absentDays = totalDays - presentDays; // Deduct present days from total to calculate absences.
    let punctualityPercent = 0; // Initialize base punctuality tracker value.
    if (totalDays > 0) { // Keep safety barrier avoiding division by zero instances.
      punctualityPercent = parseFloat(((presentDays - lateDays) / totalDays * 100).toFixed(1)); // Run math calculations.
    } // End calculation of punctuality percentage.
    const summary = { // Construct final telemetry metrics payload.
      totalDays, // Reference total registered operational shifts.
      lateDays, // Reference total late clocks-in counts.
      presentDays, // Reference total active present registries.
      absentDays, // Reference total unaccounted inactive shifts.
      punctualityPercent // Reference computed ratios.
    }; // End summary metrics construction.
    return res.status(200).json({ records, summary }); // Return 200 success response containing logs and telemetry metrics.
  } catch (error) { // Trapping execution errors block.
    console.error('Error compiling student attendance metrics:', error); // Log failure to backend console.
    return res.status(500).json({ message: "Internal server error" }); // Reply code 500 indicating server error.
  } // Terminate try-catch block.
}); // Close GET /my-attendance router endpoint.

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
