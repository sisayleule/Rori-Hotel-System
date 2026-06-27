// This file handles routes for accessing and downloading student final results and certificates.
const express = require('express'); // Import express framework to create router instance.
const router = express.Router(); // Create new express router for results endpoints.
const path = require('path'); // Import path module to construct file paths for certificate downloads.
const fs = require('fs'); // Import fs module to check if certificate files exist on disk.
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware to require authentication.
const { requireRole } = require('../middleware/roleMiddleware'); // Import requireRole to enforce role-based access control.
const FinalResult = require('../models/FinalResult'); // Import FinalResult model to query published results.
const Student = require('../models/Student'); // Import Student model to verify student ownership and get student data.
const { generateCertificate } = require('../utils/certificateGenerator'); // Import certificate generator for regeneration if needed.
const { calculateBadges } = require('../utils/badgeService'); // Import badge calculator for certificate regeneration.
const SupervisorScore = require('../models/SupervisorScore'); // Import SupervisorScore model for certificate regeneration.
const Journal = require('../models/Journal'); // Import Journal model for counting journals during regeneration.
const StudentFeedback = require('../models/StudentFeedback'); // Import StudentFeedback model for counting feedback during regeneration.

// Create GET route at /:studentId/certificate to download student's internship certificate PDF.
router.get('/:studentId/certificate', protect, async (req, res) => { // Define route with protect middleware requiring authentication.
  try { // Start try-catch block for error handling.
    const studentId = req.params.studentId; // Extract student ID from URL parameters.
    const userId = req.user.id || req.user.userId; // Get authenticated user ID from request.
    const userRole = req.user.role; // Get user role to check permissions.
    
    // Find the published final result for this student to get certificate URL.
    const finalResult = await FinalResult.findOne({ // Query FinalResult collection.
      studentId: studentId, // Match student ID parameter.
      isPublished: true // Only allow access to published results.
    }); // Close findOne query.
    
    // Return 404 if no published result exists for this student.
    if (!finalResult) { // Check if result was found.
      return res.status(404).json({ message: 'No published result found for this student' }); // Return not found error.
    } // Close result check.
    
    // Find student document to verify ownership and get student data.
    const studentDoc = await Student.findById(studentId).populate('userId', 'fullName studentIdNumber'); // Find and populate student.
    
    // Return 404 if student document doesn't exist.
    if (!studentDoc) { // Check if student was found.
      return res.status(404).json({ message: 'Student not found' }); // Return not found error.
    } // Close student check.
    
    // Authorization check: Students can only download their own certificate, HR can download any.
    if (userRole === 'student') { // Check if user is a student.
      const studentUserId = studentDoc.userId._id.toString(); // Get student's user ID as string.
      if (studentUserId !== userId) { // Compare with authenticated user ID.
        return res.status(403).json({ message: 'You can only download your own certificate' }); // Return forbidden error.
      } // Close ownership check.
    } else if (userRole !== 'hr') { // Check if user is not HR.
      return res.status(403).json({ message: 'Only students and HR can download certificates' }); // Return forbidden error.
    } // Close role authorization check.
    
    // Check if certificate URL exists in database.
    if (!finalResult.certificateUrl) { // Check if certificate was generated.
      console.error('[Results] No certificate URL in database for student:', studentId); // Log missing URL.
      return res.status(404).json({ 
        message: 'Certificate not yet generated. Please ask HR to republish your result to generate the certificate.' 
      }); // Return not found error with helpful message.
    } // Close certificate URL check.
    
    // Construct absolute file path from certificate URL stored in database.
    let certificatePath; // Declare certificate path variable.
    
    // Check if stored path is already absolute or needs to be constructed
    if (path.isAbsolute(finalResult.certificateUrl)) { // Check if stored path is absolute.
      certificatePath = finalResult.certificateUrl; // Use as-is if absolute.
    } else { // Path is relative.
      certificatePath = path.join(__dirname, '..', finalResult.certificateUrl); // Join with server directory if relative.
    } // Close path type check.
    
    console.log('[Results] Certificate path to check:', certificatePath); // Log path being checked for debugging.
    
    // Check if certificate file actually exists on disk.
    console.log('[Results] Checking if file exists at:', certificatePath); // Log the path being checked.
    if (!fs.existsSync(certificatePath)) { // Use fs.existsSync to check file existence.
      console.error('[Results] Certificate file not found at path:', certificatePath); // Log missing file error.
      console.error('[Results] Certificate URL in database:', finalResult.certificateUrl); // Log what was in database.
      console.error('[Results] __dirname is:', __dirname); // Log current directory.
      return res.status(404).json({ 
        message: 'Certificate file not found on server. The certificate may not have been generated yet. Please ask HR to republish your result.' 
      }); // Return not found error with helpful message.
    } // Close file existence check.
    
    console.log('[Results] Certificate file found! Preparing to send...'); // Log success.
    
    // Create clean filename for download using student name without spaces.
    const studentName = studentDoc.userId.fullName.replace(/\s+/g, '-'); // Replace all spaces with hyphens.
    const downloadFilename = `Certificate-${studentName}.pdf`; // Create filename with Certificate prefix.
    
    // Send certificate file as download attachment to client.
    res.download(certificatePath, downloadFilename, (err) => { // Use res.download to send file with custom filename.
      if (err) { // Check if download error occurred.
        console.error('[Results] Error sending certificate file:', err); // Log download error.
        if (!res.headersSent) { // Check if headers haven't been sent yet.
          return res.status(500).json({ message: 'Error downloading certificate' }); // Return server error.
        } // Close headers check.
      } // Close error check.
      console.log('[Results] Certificate downloaded successfully for student:', studentId); // Log successful download.
    }); // Close download callback.
  } catch (err) { // Catch any errors in try block.
    console.error('[Results] Error in certificate download route:', err); // Log error details.
    return res.status(500).json({ message: 'Server error while downloading certificate' }); // Return server error.
  } // Close try-catch block.
}); // Close GET certificate route.

// Create POST route at /:studentId/regenerate-certificate for HR to regenerate a student's certificate.
router.post('/:studentId/regenerate-certificate', protect, requireRole('hr'), async (req, res) => { // Define route with HR-only access.
  try { // Start try-catch block for error handling.
    const studentId = req.params.studentId; // Extract student ID from URL parameters.
    
    // Find the published final result for this student.
    const finalResult = await FinalResult.findOne({ // Query FinalResult collection.
      studentId: studentId, // Match student ID.
      isPublished: true // Only regenerate for published results.
    }); // Close findOne query.
    
    // Return 404 if no published result exists.
    if (!finalResult) { // Check if result exists.
      return res.status(404).json({ message: 'No published result found for this student' }); // Return error.
    } // Close result check.
    
    // Find student document with user data for certificate generation.
    const studentDoc = await Student.findById(studentId).populate('userId', 'fullName email studentIdNumber'); // Find and populate.
    
    // Return 404 if student not found.
    if (!studentDoc) { // Check student existence.
      return res.status(404).json({ message: 'Student not found' }); // Return error.
    } // Close student check.
    
    // Get all supervisor scores for department scores array.
    const scores = await SupervisorScore.find({ studentId: studentId }); // Query all scores for student.
    
    // Count journal entries for badge calculation.
    const journalCount = await Journal.countDocuments({ studentId: studentId }); // Count journals.
    
    // Count feedback submissions for badge calculation.
    const feedbackCount = await StudentFeedback.countDocuments({ studentId: studentId }); // Count feedback.
    
    // Get completed departments from student document.
    const completedDepartments = studentDoc.completedDepartments || []; // Get array or empty array.
    
    // Build department scores array from supervisor scores.
    const departmentScores = scores.map(score => ({ // Map to object array.
      department: score.department, // Department name.
      score: score.score // Score value.
    })); // Close map.
    
    // Recalculate badges with current data.
    const badges = calculateBadges({ // Call badge calculator.
      overallScore: finalResult.overallScore, // Use overall score from result.
      departmentScores: departmentScores, // Pass department scores.
      journalCount: journalCount, // Pass journal count.
      feedbackCount: feedbackCount, // Pass feedback count.
      completedDepartments: completedDepartments // Pass completed departments.
    }); // Close calculateBadges.
    
    // Prepare certificate data object for regeneration.
    const certificateData = { // Build certificate data.
      studentName: studentDoc.userId.fullName, // Student full name.
      universityName: studentDoc.universityName || 'University', // University name with fallback.
      studentIdNumber: studentDoc.userId.studentIdNumber || studentDoc._id.toString().substring(0, 8).toUpperCase(), // Student ID.
      internshipPeriod: { // Internship dates object.
        startDate: studentDoc.startDate ? new Date(studentDoc.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A', // Format start.
        endDate: studentDoc.endDate ? new Date(studentDoc.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' // Format end.
      }, // Close period.
      overallScore: finalResult.overallScore, // Overall score.
      bestDepartment: finalResult.bestDepartment, // Best department.
      departmentScores: departmentScores, // Department scores array.
      hrFeedback: finalResult.hrGeneralFeedback || 'Completed internship successfully.', // HR feedback.
      badges: badges, // Badges array.
      generatedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), // Today's date.
      certificateId: `CERT-${studentDoc.userId.studentIdNumber || studentDoc._id.toString().substring(0, 8).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` // New certificate ID.
    }; // Close certificate data.
    
    // Generate new certificate PDF.
    const newCertificateUrl = await generateCertificate(certificateData); // Call generator and await path.
    
    // Update final result with new certificate URL and badges.
    finalResult.certificateUrl = newCertificateUrl; // Set new certificate path.
    finalResult.badges = badges; // Update badges in case they changed.
    await finalResult.save(); // Save updated result to database.
    
    console.log('[Results] Certificate regenerated successfully for student:', studentId); // Log success.
    
    // Return success response with new certificate URL.
    return res.status(200).json({ // Return 200 OK.
      message: 'Certificate regenerated successfully', // Success message.
      certificateUrl: newCertificateUrl // New certificate path.
    }); // Close response.
  } catch (err) { // Catch errors.
    console.error('[Results] Error regenerating certificate:', err); // Log error.
    return res.status(500).json({ message: 'Server error while regenerating certificate' }); // Return server error.
  } // Close try-catch.
}); // Close POST regenerate route.

// Export router for registration in server.js.
module.exports = router; // Export router as module.
