// Import Cloudinary instance for generating signed URLs if needed to bypass 401 errors.
const { cloudinary } = require('../config/cloudinary'); // Load Cloudinary API instance.
// This file handles all HR routes for managing student internship applications. Only users with the hr role can access these routes.
const express = require('express'); // Import express to load route structures.
const router = express.Router(); // Create a new router instance for HR applications actions.
const { protect } = require('../middleware/authMiddleware'); // Import protect to guard paths.
const { requireRole } = require('../middleware/roleMiddleware'); // Import requireRole to enforce token authorization.
const Student = require('../models/Student'); // Import Student database model to find profiles matching users.
const User = require('../models/User'); // Import User database model to load account metadata.
const { sendApprovalEmail, sendRejectionEmail } = require('../utils/emailService'); // Import email actions from utility provider.
const { createNotification } = require('../utils/notifications'); // Import notifications creation utility.

// Create a GET route at path / to load all registered students.
router.get('/', protect, requireRole('hr'), async (req, res) => { // Setup GET / with protections.
  try { // Start handling logic within safety blocks.
    const students = await Student.find() // Query for all Student documents.
      .populate('userId', 'fullName email') // Attach associated user info.
      .sort({ createdAt: -1 }); // Sort descending so first elements represent newer additions.
    return res.status(200).json(students); // Respond with 200 HTTP code along with populated dataset.
  } catch (error) { // Trapping execution errors block.
    console.error('Error fetching applications for HR list:', error); // Log failure to backend console.
    return res.status(500).json({ message: "Internal server error" }); // Reply code 500 indicating database fault.
  } // Terminate try-catch block.
}); // Close route handler.

// Create a GET route at path /:id to inspect a single student detail application profile.
router.get('/:id', protect, requireRole('hr'), async (req, res) => { // Setup GET /:id with protections for HR role only.
  try { // Start handling logic within safety blocks to catch any errors.
    // Fetch student document from database by ID parameter from URL with populated user info.
    const student = await Student.findById(req.params.id).populate('userId'); // Query database for student by ID and populate related user data.
    // Check if student exists in database to handle not found case.
    if (!student) { // Validate student document was found.
      return res.status(404).json({ error: 'Student not found' }); // Return 404 status with error message if student doesn't exist.
    } // End student existence check.
    
    // Convert Mongoose document to plain JavaScript object to allow property modifications.
    const studentObj = student.toObject(); // Transform to plain object so we can modify URL properties directly.
    
    // Fix internship letter URL if it exists by removing expired signed tokens and correcting resource type based on file type.
    if (studentObj.internshipLetter) { // Check if internship letter URL exists in student record.
      let url = studentObj.internshipLetter; // Store original URL in variable for modification.
      // Remove any signed token pattern like s--pP6wCkQ9-- from URL using regex that matches s-- followed by any characters until next --.
      url = url.replace(/\/s--[^/]+--\//, '/'); // Strip expired signed token pattern from Cloudinary URL to make it a plain public URL.
      
      // Detect if file is PDF or image based on URL to apply correct resource type fix.
      const isPDF = url.toLowerCase().includes('.pdf') || // Check if URL contains .pdf extension.
                    (url.toLowerCase().includes('internship-letter') && !url.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i)); // Or if it's internship letter without image extension.
      const isImage = url.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i); // Check if URL has image file extension using regex.
      
      // Handle PDF files - must use raw/upload resource type.
      if (isPDF) { // If file is detected as PDF.
        // Replace image/upload with raw/upload for PDFs since PDFs should use raw resource type not image type.
        url = url.replace('/image/upload/', '/raw/upload/'); // Fix resource type from image to raw for proper PDF serving without corruption.
        // Also replace auto/upload with raw/upload as backup in case auto-detection resource type was used.
        url = url.replace('/auto/upload/', '/raw/upload/'); // Fix auto resource type to raw as fallback for auto-detected uploads.
        // Ensure URL ends with .pdf extension for proper browser recognition.
        if (!url.toLowerCase().endsWith('.pdf')) { // Check if URL is missing .pdf extension.
          url = url + '.pdf'; // Append .pdf extension to URL for proper file type identification.
        } // End PDF extension check.
        console.log('[Application Detail] PDF URL cleaned:', url); // Log corrected PDF URL for debugging verification.
      } else if (isImage) { // Handle image files - must use image/upload resource type.
        // Replace raw/upload with image/upload for images since images must use image resource type not raw or Cloudinary returns 404.
        url = url.replace('/raw/upload/', '/image/upload/'); // Fix resource type from raw to image for proper image serving without 404 errors.
        // Also replace auto/upload with image/upload as backup in case auto-detection resource type was used.
        url = url.replace('/auto/upload/', '/image/upload/'); // Fix auto resource type to image as fallback for auto-detected uploads.
        console.log('[Application Detail] Image URL cleaned:', url); // Log corrected image URL for debugging verification.
      } // End image URL correction.
      
      // Save corrected URL back to student object to return to frontend.
      studentObj.internshipLetter = url; // Update internship letter URL with all fixes applied.
      console.log('[Application Detail] Final internshipLetter URL:', url); // Log final URL that will be sent to frontend.
    } // End internship letter URL fix.
    
    // Return student object with fixed URLs to frontend.
    return res.status(200).json(studentObj); // Respond with 200 status and student data with corrected public URLs.
  } catch (err) { // Catch any errors during student fetch or URL processing.
    console.error('[Application Detail] Error:', err.message); // Log error message for debugging.
    return res.status(500).json({ error: 'Server error' }); // Return 500 status with generic error message.
  } // End try-catch block.
}); // Close route handler.

// Create a PUT route at path /:id/approve to approve an application.
router.put('/:id/approve', protect, requireRole('hr'), async (req, res) => { // Setup PUT /:id/approve with protections.
  try { // Start handling logic within safety blocks.
    // Extract rotation order and current department from request body instead of single assigned department.
    const { startDate, endDate, departmentRotationOrder, currentDepartment } = req.body; // Extract dates and rotation fields from request body.
    // Validate that all required fields are provided including rotation order array and current department.
    if (!startDate || !endDate || !departmentRotationOrder || !currentDepartment) { // Check if any required field is missing.
      return res.status(400).json({ message: "please provide start date end date department rotation order and current department" }); // Respond 400 error status explanation.
    } // End verification validation check.
    // Validate that rotation order is an array with exactly 4 departments.
    if (!Array.isArray(departmentRotationOrder) || departmentRotationOrder.length !== 4) { // Check if rotation order is valid array with 4 elements.
      return res.status(400).json({ message: "department rotation order must be an array of 4 departments" }); // Respond with validation error.
    } // End array validation.
    const studentId = req.params.id; // Read target student record ID parameter from URL params.
    const student = await Student.findById(studentId); // Find student document by the id from parameters.
    if (!student) { // Check if Student is logged in database collections.
      return res.status(404).json({ message: "student not found" }); // Deliver 404 response if absent.
    } // End verification validation check block.
    student.status = 'approved'; // Update status to the string approved.
    student.startDate = startDate; // Set startDate to values from body.
    student.endDate = endDate; // Set endDate to values from body.
    student.departmentRotationOrder = departmentRotationOrder; // Set rotation order array to the 4 departments in sequence from request body.
    student.currentDepartment = currentDepartment; // Set current department to the first department in rotation from request body.
    student.completedDepartments = []; // Initialize completed departments as empty array since student just starting.
    student.rejectionNote = ''; // Clear previous rejection rationale text message.
    student.isApprovedForGrading = true; // Enable grading authorization so supervisors can submit scores immediately upon approval.
    await student.save(); // Save the updated student document database record to MongoDB with new rotation fields.
    
    // Create a notification for the student informing them their application has been approved with rotation information.
    await createNotification(
      student.userId, // Send notification to the student user ID.
      'Internship Approved', // Set notification title.
      `Congratulations! Your internship application at Rori Hotel has been approved. You will start in the ${currentDepartment} department.`, // Set success message with first department.
      '/student/dashboard', // Link to student dashboard.
      'approval' // Set notification type as approval.
    ); // Close createNotification call.

    const user = await User.findById(student.userId); // Find User doc matching verified credential credentials.
    if (user && user.email) { // Ensure we have found user containing emails.
      await sendApprovalEmail(user.email, user.fullName, startDate); // Call sendApprovalEmail to send the student an email.
    } // End email notification checks.
    return res.status(200).json({ message: "student approved successfully", student }); // Respond status 200 with saved records.
  } catch (error) { // Trapping execution errors block.
    console.error('Error approving student application:', error); // Log failures to backend console.
    return res.status(500).json({ message: "Internal server error" }); // Reply code 500 indicating database fault.
  } // Terminate try-catch block.
}); // Close route handler.

// Create a PUT route at path /:id/reject to reject an application.
router.put('/:id/reject', protect, requireRole('hr'), async (req, res) => { // Setup PUT /:id/reject with protections.
  try { // Start handling logic within safety blocks.
    const { rejectionNote } = req.body; // Extract rejection explanation message from request body.
    if (!rejectionNote) { // Ensure required input variables are missing.
      return res.status(400).json({ message: "please provide a rejection reason" }); // Respond 400 error status explanation.
    } // End verification validation check.
    const studentId = req.params.id; // Read target student record ID parameter from URL params.
    const student = await Student.findById(studentId); // Find student document by parameters.
    if (!student) { // Check if Student is logged in database collections.
      return res.status(404).json({ message: "student not found" }); // Deliver 404 response if absent.
    } // End verification validation check block.
    student.status = 'rejected'; // Set status to rejected.
    student.rejectionNote = rejectionNote; // Set rejection reason.
    await student.save(); // Save the updated student document database record to MongoDB.

    // Create a notification for the student informing them their application has been rejected.
    await createNotification(
      student.userId, // Send notification to the student user ID.
      'Application Update', // Set notification title.
      `There has been an update on your internship application. Please check your dashboard.`, // Set update message.
      '/student/dashboard', // Link to student dashboard.
      'rejection' // Set notification type as rejection.
    ); // Close createNotification call.

    const user = await User.findById(student.userId); // Find User doc matching verified credential credentials.
    if (user && user.email) { // Ensure we have found user containing emails.
      await sendRejectionEmail(user.email, user.fullName, rejectionNote); // Call sendRejectionEmail to deliver polite decline letters.
    } // End email notification checks.
    return res.status(200).json({ message: "application rejected", student }); // Respond status 200 with saved records.
  } catch (error) { // Trapping execution errors block.
    console.error('Error rejecting student application:', error); // Log failures to backend console.
    return res.status(500).json({ message: "Internal server error" }); // Reply code 500 indicating database fault.
  } // Terminate try-catch block.
}); // Close route handler.

// Create a PUT route at path /:id/toggle-grading to toggle the supervisor grading lock status.
router.put('/:id/toggle-grading', protect, requireRole('hr'), async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "student record not found" });
    }
    
    student.isApprovedForGrading = !student.isApprovedForGrading; // Toggle the grading authorization boolean flag.
    await student.save(); // Save the updated student document to database.

    // Create a notification for the student informing them about grading status change.
    await createNotification(
      student.userId, // Send notification to the student user ID.
      student.isApprovedForGrading ? 'Rotation Grading Unlocked' : 'Rotation Grading Locked', // Set dynamic title based on status.
      student.isApprovedForGrading 
        ? 'HR has authorized your departmental supervisors to submit your performance scores.'
        : 'HR has temporarily locked your rotation score submission.', // Set dynamic message based on status.
      '/student/dashboard', // Link to student dashboard.
      'score' // Set notification type as score.
    ); // Close createNotification call.

    return res.status(200).json({ 
      message: `Grading status updated to ${student.isApprovedForGrading ? "authorized" : "locked"}`, 
      student 
    });
  } catch (error) {
    console.error('Error toggling student grading status:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Create a PUT route at path /:id/next-department to move student to next department in rotation order.
router.put('/:id/next-department', protect, requireRole('hr'), async (req, res) => { // Setup PUT /:id/next-department with HR protection.
  try { // Start handling logic within safety blocks.
    const studentId = req.params.id; // Extract student ID from URL parameters.
    const student = await Student.findById(studentId); // Find student document by ID from database.
    if (!student) { // Check if student exists in database.
      return res.status(404).json({ message: "student not found" }); // Return 404 if student doesn't exist.
    } // End student existence check.
    
    // Validate that student has rotation order configured.
    if (!student.departmentRotationOrder || student.departmentRotationOrder.length !== 4) { // Check if rotation order exists and has 4 departments.
      return res.status(400).json({ message: "student does not have a valid rotation order configured" }); // Return error if rotation not set.
    } // End rotation validation.
    
    // Find current department index in rotation order array.
    const currentIndex = student.departmentRotationOrder.indexOf(student.currentDepartment); // Get index of current department.
    
    // Check if student is already in last department.
    if (currentIndex === student.departmentRotationOrder.length - 1) { // If current index is last position.
      return res.status(400).json({ message: "student has already completed all departments in rotation" }); // Return error message.
    } // End completion check.
    
    // Add current department to completed departments array before moving to next.
    if (!student.completedDepartments.includes(student.currentDepartment)) { // Check if current department not already in completed array.
      student.completedDepartments.push(student.currentDepartment); // Add current department to completed array.
    } // End duplicate check.
    
    // Set current department to next department in rotation order.
    const nextDepartment = student.departmentRotationOrder[currentIndex + 1]; // Get next department from rotation array.
    student.currentDepartment = nextDepartment; // Update current department to next department.
    
    await student.save(); // Save updated student document to database with new current department and completed list.
    
    // Create notification for student informing them about department change.
    await createNotification(
      student.userId, // Send notification to student user ID.
      'Department Rotation Update', // Set notification title.
      `You have moved to the next department in your rotation: ${nextDepartment}. Good luck!`, // Set message with new department name.
      '/student/dashboard', // Link to student dashboard.
      'rotation' // Set notification type as rotation.
    ); // Close createNotification call.
    
    return res.status(200).json({ // Return success response with updated student data.
      message: "student moved to next department successfully", // Success message.
      student // Return updated student object.
    }); // Close response.
  } catch (error) { // Catch any errors during execution.
    console.error('Error moving student to next department:', error); // Log error to console.
    return res.status(500).json({ message: "Internal server error" }); // Return 500 server error.
  } // End try-catch block.
}); // Close next-department route handler.

module.exports = router; // Export the router dataset for application configuration.

