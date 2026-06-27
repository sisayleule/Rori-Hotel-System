// This file handles student feedback submissions and HR viewing of feedback reports inside the internship system.
const express = require('express'); // Import express framework module to initialize routing middleware.
const router = express.Router(); // Create a new express Router constructor instance.
const { protect } = require('../middleware/authMiddleware'); // Import protect helper to require active auth tokens.
const { requireRole } = require('../middleware/roleMiddleware'); // Import requireRole helper to enforce privilege restrictions.
const StudentFeedback = require('../models/StudentFeedback'); // Import StudentFeedback database model for feedback entries.
const Student = require('../models/Student'); // Import Student database model to query candidate records.
const User = require('../models/User'); // Import User database model to query full name profiles.
const { notifyAllWithRole } = require('../utils/notifications'); // Import notification broadcast utility.
// Create a POST route at path / to process student feedback submissions.
router.post('/', protect, requireRole('student'), async (req, res) => { // Setup POST / path with protections.
  try { // Start safety try-catch block wrapper.
    const { targetDepartment, feedbackType, message } = req.body; // Extract feedback inputs from request body.
    if (!feedbackType || !message) { // Validate that mandatory feedback attributes are supplied.
      return res.status(400).json({ message: "please fill in all required fields" }); // Respond code 400.
    } // End verification validation check.
    const userId = req.user.id || req.user.userId; // Resolve active user ID from token data.
    const studentDoc = await Student.findOne({ userId: userId }); // Query for Student profile document.
    if (!studentDoc) { // Validate if Student profile document exists in collections.
      return res.status(404).json({ message: "Student profile not found" }); // Respond 404 block.
    } // End verification validation check.
    const feedbackDoc = new StudentFeedback({ // Create a new StudentFeedback document using constructor.
      studentId: studentDoc._id, // Map associated student profile ID reference.
      targetDepartment: targetDepartment || '', // Save designation or fallback.
      feedbackType: feedbackType, // Save feedback attribute categorizations.
      message: message // Save custom message content.
    }); // End schema initialization.
    await feedbackDoc.save(); // Save the documented feedback record into MongoDB Atlas.
    
    // Create a notification for all HR users informing them that a student has submitted new feedback.
    await notifyAllWithRole(
      'hr', // Send notification to all users with HR role.
      'New Student Feedback', // Set notification title.
      `A student has submitted new feedback. Please review it.`, // Set feedback alert message.
      '/hr/dashboard', // Link to HR dashboard where feedback is displayed.
      'feedback' // Set notification type as feedback.
    ); // Close notifyAllWithRole call.
    
    return res.status(201).json({ message: "feedback submitted successfully thank you for helping us improve" }); // Respond status 201.
  } catch (error) { // Trap connection exceptions.
    console.error('Error submitting student feedback:', error); // Log error onto backend output monitors.
    return res.status(500).json({ message: "Internal server error" }); // Respond code 500 error reporting signal.
  } // Terminate try-catch block scope.
}); // Close POST / route.
// Add the GET /feedback route (mapped as GET / here inside feedback.js routes bundle).
router.get('/', protect, requireRole('hr'), async (req, res) => { // Setup GET / path under auth protect policies.
  try { // Start safety try block wrapper.
    const feedbacks = await StudentFeedback.find({}) // Retrieve all records from StudentFeedback collection.
      .populate('studentId') // Populate related Student record to retrieve university details.
      .sort({ createdAt: -1 }); // Sort in descending order to render newest submissions first.
    const compiledFeedbacks = []; // Initialize empty list to append resolved items data.
    for (let i = 0; i < feedbacks.length; i++) { // Loop active feedbacks catalog records.
      const feedbackDoc = feedbacks[i]; // Access current index element inside array.
      const studentProfile = feedbackDoc.studentId; // Pull populated student profile properties.
      let studentName = 'Academic Intern'; // Establish default fallback labeling.
      let universityName = 'University'; // Establish default fallback labeling.
      let studentIdVal = null; // Default value fallback.
      if (studentProfile) { // Check if student profile object exists.
        studentIdVal = studentProfile._id; // Obtain student profile system identification key.
        universityName = studentProfile.universityName || 'University'; // Retrieve university label details.
        if (studentProfile.userId) { // Check if a related user credentials link exists.
          const userDoc = await User.findById(studentProfile.userId); // Query User records using Mongoose.
          if (userDoc) { // Check if user document was successfully retrieved.
            studentName = userDoc.fullName || 'Academic Intern'; // Extract full name from accounts.
          } // End inner check block.
        } // End userId verify block.
      } // End studentProfile check block.
      compiledFeedbacks.push({ // Create custom formatted record block.
        _id: feedbackDoc._id, // Pass original feedback identification string.
        studentId: studentIdVal, // Pass resolved student identifier.
        studentName: studentName, // Pass resolved full name parameter.
        universityName: universityName, // Pass resolved institution description.
        targetDepartment: feedbackDoc.targetDepartment, // Pass target rotated department name.
        feedbackType: feedbackDoc.feedbackType, // Pass complaint or recommendation class descriptors.
        message: feedbackDoc.message, // Pass observations message text contents block.
        createdAt: feedbackDoc.createdAt // Pass date parameters.
      }); // End array insert configuration.
    } // End loop blocks structure.
    return res.status(200).json(compiledFeedbacks); // Return status 200 carrying completed feedbacks array payload.
  } catch (error) { // Trap exceptions.
    console.error('Error listing student feedbacks:', error); // Log failure reports to console.
    return res.status(500).json({ message: "Could not retrieve student feedbacks" }); // Respond 500 error code.
  } // Terminate try-catch block.
}); // Close GET / route path coordinates wrapper.
module.exports = router; // Export router database configurations list.
