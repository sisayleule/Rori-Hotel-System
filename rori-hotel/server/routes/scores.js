// This file handles supervisor score submission and HR result compilation.
const express = require('express'); // Import express framework module to initialize routing middleware.
const router = express.Router(); // Create a new express Router constructor instance.
const { protect } = require('../middleware/authMiddleware'); // Import protect helper to require active auth tokens.
const { requireRole } = require('../middleware/roleMiddleware'); // Import requireRole helper to enforce privilege restrictions.
const SupervisorScore = require('../models/SupervisorScore'); // Import the SupervisorScore mongoose model.
const Student = require('../models/Student'); // Import the Student mongoose model.
const User = require('../models/User'); // Import the User mongoose model.
const FinalResult = require('../models/FinalResult'); // Import the FinalResult mongoose model.
const Journal = require('../models/Journal'); // Import the Journal mongoose model to count student journal entries.
const StudentFeedback = require('../models/StudentFeedback'); // Import the StudentFeedback mongoose model to count student feedback submissions.
const { sendResultEmail, sendCertificateReadyEmail } = require('../utils/emailService'); // Import email service notification helpers.
const { createNotification, notifyAllWithRole } = require('../utils/notifications'); // Import notifications utilities.
const { generateCertificate } = require('../utils/certificateGenerator'); // Import certificate PDF generator function.
const { calculateBadges } = require('../utils/badgeService'); // Import badge calculation function.

// Create a GET route at path /my-students accessible by all 4 supervisor roles to list assigned active students.
router.get('/my-students', protect, requireRole('supervisor_fo', 'supervisor_hk', 'supervisor_kt', 'supervisor_fb'), async (req, res) => {
  // Wrap implementation inside a try-catch tracking block.
  try {
    // Define department mapping between supervisor roles and departmental strings.
    const departmentMap = {
      supervisor_fo: 'Front Office', // Map Front Office supervisor role.
      supervisor_hk: 'Housekeeping', // Map Housekeeping supervisor role.
      supervisor_kt: 'Kitchen', // Map Kitchen supervisor role.
      supervisor_fb: 'F&B Service' // Map F&B Service supervisor role.
    };
    // Identify active supervisor's assigned department from role.
    const assignedDept = departmentMap[req.user.role]; // Read department map coordinates.
    // Query database for approved students in THIS supervisor's current department using rotation system - filter by currentDepartment instead of assignedDepartment.
    const rawStudents = await Student.find({
      status: 'approved', // Filter only approved active internship candidates.
      currentDepartment: assignedDept // Filter students whose current department matches this supervisor's department in rotation.
    }).populate('userId', 'fullName email'); // Populate related user accounts to read fullName.
    // Create an empty array to compile students objects list.
    const compiledStudents = [];
    // Iterate through students records using a loop.
    for (const student of rawStudents) {
      // Check if this supervisor already submitted a rating score for this student.
      const existingScore = await SupervisorScore.findOne({
        studentId: student._id, // Filter for student profile ID.
        supervisorId: req.user.id || req.user.userId // Filter for supervisor user ID.
      });
      // Establish flag setting scoreSubmitted to true if existing score records are found.
      const scoreSubmitted = existingScore ? true : false; // Track submission state.
      // Append student record and flag onto compiled array.
      compiledStudents.push({
        studentData: student, // Store student info.
        scoreSubmitted: scoreSubmitted // Store submission status flag.
      });
    }
    // Return HTTP status 200 with resolved data objects.
    return res.status(200).json({
      department: assignedDept, // Return mapped department label.
      students: compiledStudents // Return compiled list of students.
    });
  } catch (err) {
    // Write out diagnostic traces on console.
    console.error('Error fetching supervisor student directory list:', err);
    // Respond with a 500 status stating retrieval failure.
    return res.status(500).json({ message: "Could not fetch students list" });
  }
});

// Create a POST route at path / allowing supervisors to submit and lock rating scores.
router.post('/', protect, requireRole('supervisor_fo', 'supervisor_hk', 'supervisor_kt', 'supervisor_fb'), async (req, res) => {
  // Wrap core rating operations inside try-catch context.
  try {
    // ===== COMPREHENSIVE DEBUG LOGGING START =====
    console.log('========================================'); // Log separator for visibility.
    console.log('=== SCORE SUBMIT DEBUG ==='); // Log debug header.
    console.log('req.user:', req.user); // Log authenticated user object.
    console.log('req.body:', req.body); // Log complete request body.
    console.log('studentId:', req.body.studentId); // Log student ID specifically.
    console.log('score:', req.body.score); // Log overall score.
    console.log('technicalSkills:', req.body.technicalSkills); // Log technical skills sub-score.
    console.log('communication:', req.body.communication); // Log communication sub-score.
    console.log('teamwork:', req.body.teamwork); // Log teamwork sub-score.
    console.log('professionalism:', req.body.professionalism); // Log professionalism sub-score.
    console.log('comments:', req.body.comments); // Log comments.
    console.log('=== END DEBUG ==='); // Log debug footer.
    console.log('========================================'); // Log separator for visibility.
    // ===== COMPREHENSIVE DEBUG LOGGING END =====
    
    // Decode parameters studentId, score, sub-scores, and comments directly from body parameters.
    const studentId = req.body.studentId; // Extract student ID from request body.
    const score = Number(req.body.score); // Extract overall score (calculated on frontend).
    const technicalSkills = Number(req.body.technicalSkills); // Extract technical skills sub-score.
    const communication = Number(req.body.communication); // Extract communication sub-score.
    const teamwork = Number(req.body.teamwork); // Extract teamwork sub-score.
    const professionalism = Number(req.body.professionalism); // Extract professionalism sub-score.
    const comments = req.body.comments; // Extract supervisor comments.
    
    // Log extracted and parsed values for debugging.
    console.log('[Score Submission] Parsed values:', { // Log extracted values.
      studentId, // Student ID.
      score, // Overall score.
      technicalSkills, // Technical skills sub-score.
      communication, // Communication sub-score.
      teamwork, // Teamwork sub-score.
      professionalism, // Professionalism sub-score.
      comments // Comments.
    }); // Close log.
    
    // Validate that overall score is a numeric value within constraints 0 up to 100.
    if (isNaN(score) || score < 0 || score > 100) {
      console.log('[Score Submission] Overall score validation failed:', score); // Log validation failure.
      // Abort return 400 bad request error status code.
      return res.status(400).json({ message: "Score must be a number between 0 and 100" });
    }
    
    // Validate all 4 sub-scores are provided and within valid range.
    if (isNaN(technicalSkills) || technicalSkills < 0 || technicalSkills > 100) { // Validate technical skills.
      console.log('[Score Submission] Technical skills validation failed:', technicalSkills); // Log validation failure.
      return res.status(400).json({ message: "Technical skills score must be a number between 0 and 100" }); // Return error.
    } // Close validation.
    if (isNaN(communication) || communication < 0 || communication > 100) { // Validate communication.
      console.log('[Score Submission] Communication validation failed:', communication); // Log validation failure.
      return res.status(400).json({ message: "Communication score must be a number between 0 and 100" }); // Return error.
    } // Close validation.
    if (isNaN(teamwork) || teamwork < 0 || teamwork > 100) { // Validate teamwork.
      console.log('[Score Submission] Teamwork validation failed:', teamwork); // Log validation failure.
      return res.status(400).json({ message: "Teamwork score must be a number between 0 and 100" }); // Return error.
    } // Close validation.
    if (isNaN(professionalism) || professionalism < 0 || professionalism > 100) { // Validate professionalism.
      console.log('[Score Submission] Professionalism validation failed:', professionalism); // Log validation failure.
      return res.status(400).json({ message: "Professionalism score must be a number between 0 and 100" }); // Return error.
    } // Close validation.
    
    console.log('[Score Submission] All validations passed'); // Log validation success.
    
    // Safeguard supervisor ID resolution safely.
    const supervisorUserId = req.user.id || req.user.userId;
    console.log('[Score Submission] Supervisor ID:', supervisorUserId); // Log supervisor ID.

    // Verify if HR has approved grading for this student
    console.log('[Score Submission] Checking student grading approval...'); // Log grading check start.
    const studentCheck = await Student.findById(studentId);
    console.log('[Score Submission] Student found:', studentCheck ? 'YES' : 'NO'); // Log if student found.
    if (!studentCheck) {
      console.log('[Score Submission] ERROR: Student not found'); // Log error.
      return res.status(404).json({ message: "Student record not found" });
    }
    console.log('[Score Submission] Student isApprovedForGrading:', studentCheck.isApprovedForGrading); // Log grading approval status.
    if (!studentCheck.isApprovedForGrading) {
      console.log('[Score Submission] ERROR: Grading locked by HR'); // Log error.
      return res.status(400).json({ message: "Grading is currently locked by HR for this student" });
    }
    console.log('[Score Submission] Grading approval check passed'); // Log success.

    // Check if score record already exists between this candidate and supervisor.
    const existingScoreLog = await SupervisorScore.findOne({
      studentId: studentId,
      supervisorId: supervisorUserId
    });
    // Abort if previous score exists and is already submitted.
    if (existingScoreLog && existingScoreLog.isSubmitted) {
      // Respond 400 error statement explaining locked state.
      return res.status(400).json({ message: "score already submitted and locked" });
    }
    // Define supervisor role-to-department configuration settings.
    const departmentMap = {
      supervisor_fo: 'Front Office',
      supervisor_hk: 'Housekeeping',
      supervisor_kt: 'Kitchen',
      supervisor_fb: 'F&B Service'
    };
    // Extract designated department from active role coordinates.
    const assignedDept = departmentMap[req.user.role];
    // Declare variable tracking newly built score records.
    let savedScore;
    // If a draft record was found update parameters on it.
    if (existingScoreLog) {
      existingScoreLog.score = score; // Set overall score.
      existingScoreLog.technicalSkills = technicalSkills; // Set technical skills sub-score.
      existingScoreLog.communication = communication; // Set communication sub-score.
      existingScoreLog.teamwork = teamwork; // Set teamwork sub-score.
      existingScoreLog.professionalism = professionalism; // Set professionalism sub-score.
      existingScoreLog.comments = comments; // Set comments text.
      existingScoreLog.isSubmitted = true; // Lock record.
      savedScore = await existingScoreLog.save(); // Save changes.
    } else {
      // Create new SupervisorScore document.
      savedScore = await SupervisorScore.create({
        studentId: studentId, // Set student ID.
        supervisorId: supervisorUserId, // Set supervisor user ID.
        department: assignedDept, // Set department.
        score: score, // Set overall score.
        technicalSkills: technicalSkills, // Set technical skills sub-score.
        communication: communication, // Set communication sub-score.
        teamwork: teamwork, // Set teamwork sub-score.
        professionalism: professionalism, // Set professionalism sub-score.
        comments: comments, // Set review comments.
        isSubmitted: true // Lock record submission flag.
      });
    }

    // Capture student name and send immediate notification to HR
    try {
      const studentDoc = await Student.findById(studentId).populate('userId', 'fullName');
      if (studentDoc && studentDoc.userId) {
        await notifyAllWithRole(
          'hr',
          'Supervisor Score Submitted',
          `The supervisor for ${assignedDept} has submitted an evaluation score of ${score} for ${studentDoc.userId.fullName}.`,
          '/hr/scores'
        );
      }
    } catch (notifErr) {
      console.error('Failed to notify HR about supervisor score:', notifErr);
    }

    // Respond back carrying the saved score records details.
    return res.status(201).json({
      message: "score submitted and locked",
      score: savedScore
    });
  } catch (err) {
    // Output error tracers to console.
    console.error('Error submitting supervisor scores:', err);
    // Return status 500 error code.
    return res.status(500).json({ message: "Could not submit evaluation score" });
  }
});

// Create a GET routes path at /student/:studentId for HR to view rating scores of any candidate.
router.get('/student/:studentId', protect, requireRole('hr'), async (req, res) => {
  // Wrap retrieval block within safe try-catch handlers.
  try {
    // Isolate student ID parameters from route parameters.
    const studentId = req.params.studentId;
    // Fetch all SupervisorScore documents from datablocks linking to student profile.
    const scores = await SupervisorScore.find({ studentId: studentId })
      .populate('supervisorId', 'fullName role'); // Populate supervisor user details.
    // Evaluate if all four departments successfully logged scores.
    const allSubmitted = scores.length === 4; // Check if counts match 4.
    // Declare base floating average calculation metrics.
    let averageScore = null;
    // Calculate overall averages if all scores are submitted.
    if (allSubmitted) {
      // Compute summation across scoring attributes.
      const sumOfScores = scores.reduce((accumulator, scoreItem) => accumulator + scoreItem.score, 0);
      // Divide total sum by 4 rating rotations to compile average index.
      averageScore = Number((sumOfScores / 4).toFixed(1)); // Keep single decimal accuracy.
    }
    // Query database to lookup if a FinalResult document has been compiled and saved.
    const finalResult = await FinalResult.findOne({ studentId: studentId }); // Query for final results doc.
    // Return status 200 carrying compiled scores results and stats and final results doc.
    return res.status(200).json({
      scores: scores,
      allSubmitted: allSubmitted,
      averageScore: averageScore,
      finalResult: finalResult // Include published result meta.
    });
  } catch (err) {
    // Log exception tracks.
    console.error('Error fetching student scores overview:', err);
    // Reply with a 500 code failure response.
    return res.status(500).json({ message: "Could not load supervisor scores" });
  }
});

// Create a POST route path at /results/:studentId for HR administrators to compile and publish results.
router.post('/results/:studentId', protect, requireRole('hr'), async (req, res) => {
  // Wrap database operations inside robust try catch sequences.
  try {
    // Isolate target student profile identification parameter key.
    const studentId = req.params.studentId;
    // Extract review comments list and general feedback strings directly from req.body variables.
    const departmentFeedback = req.body.departmentFeedback;
    const hrGeneralFeedback = req.body.hrGeneralFeedback;
    // Find all outstanding score records entered for this student profile ID.
    const scores = await SupervisorScore.find({ studentId: studentId });
    // Block publication if scores length counts are below the 4 departments rotations.
    if (scores.length < 4) {
      // Return 400 bad request error explaining draft evaluation state.
      return res.status(400).json({ message: "all 4 supervisor scores must be submitted before publishing" });
    }
    // Compute total sum of all scores.
    const totalSum = scores.reduce((acc, rating) => acc + rating.score, 0);
    // Compute overall numerical index average.
    const overallScore = Number((totalSum / 4).toFixed(1)); // Rounded to 1 decimal.
    // Sort supervisor scores in descending sequence to pinpoint the highest rated department.
    const sortedScores = [...scores].sort((p1, p2) => p2.score - p1.score);
    // Capture the name of department representing highest score index.
    const bestDepartment = sortedScores[0].department; // Best performing department name.
    
    // Find associated Student document with populated user data for certificate generation.
    const studentDoc = await Student.findById(studentId).populate('userId', 'fullName email studentIdNumber');
    
    // Count journal entries written by this student for badge calculation.
    const journalCount = await Journal.countDocuments({ studentId: studentId }); // Count all journal entries for this student.
    
    // Count feedback submissions by this student for badge calculation.
    const feedbackCount = await StudentFeedback.countDocuments({ studentId: studentId }); // Count all feedback submissions.
    
    // Get completed departments array from student document for badge calculation.
    const completedDepartments = studentDoc && studentDoc.completedDepartments ? studentDoc.completedDepartments : []; // Array of completed dept names.
    
    // Build department scores array for badge calculation and certificate generation.
    const departmentScores = scores.map(score => ({ // Map each score to object with department and score.
      department: score.department, // Department name like "Front Office".
      score: score.score // Score value out of 100.
    })); // Close map function.
    
    // Calculate badges earned by student based on performance, journals, and feedback.
    const badges = calculateBadges({ // Call calculateBadges with result data.
      overallScore: overallScore, // Pass overall score for excellence/achiever badges.
      departmentScores: departmentScores, // Pass department scores for department star and all-rounder badges.
      journalCount: journalCount, // Pass journal count for dedicated journalist badge.
      feedbackCount: feedbackCount, // Pass feedback count for constructive voice badge.
      completedDepartments: completedDepartments // Pass completed departments for full rotation badge.
    }); // Close calculateBadges call.
    
    // Generate certificate PDF with student data and performance results.
    let certificateUrl = null; // Initialize certificate URL as null in case generation fails.
    try { // Start try block for certificate generation to not block result publishing on failure.
      // Prepare certificate data object with all required fields for PDF generation.
      const certificateData = { // Build object with certificate information.
        studentName: studentDoc.userId.fullName, // Student's full name for prominent display.
        universityName: studentDoc.universityName || 'University', // University name from student profile with fallback.
        studentIdNumber: studentDoc.userId.studentIdNumber || studentDoc._id.toString().substring(0, 8).toUpperCase(), // Student ID number or shortened MongoDB ID.
        internshipPeriod: { // Object containing formatted start and end dates.
          startDate: studentDoc.startDate ? new Date(studentDoc.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A', // Format start date.
          endDate: studentDoc.endDate ? new Date(studentDoc.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' // Format end date.
        }, // Close internship period object.
        overallScore: overallScore, // Overall score for performance summary box.
        bestDepartment: bestDepartment, // Best performing department for display.
        departmentScores: departmentScores, // Array of department scores for reference.
        hrFeedback: hrGeneralFeedback || 'Completed internship successfully.', // HR feedback or default message.
        badges: badges, // Array of earned badges to display achievements.
        generatedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), // Today's date formatted.
        certificateId: `CERT-${studentDoc.userId.studentIdNumber || studentDoc._id.toString().substring(0, 8).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` // Unique certificate ID.
      }; // Close certificate data object.
      
      // Call generateCertificate function and await file path result.
      certificateUrl = await generateCertificate(certificateData); // Generate PDF and get file path.
      console.log('[Scores] Certificate generated successfully:', certificateUrl); // Log success with file path.
      
      // Send certificate ready email notification to student after successful generation.
      if (studentDoc && studentDoc.userId && studentDoc.userId.email) { // Check if email exists.
        await sendCertificateReadyEmail(studentDoc.userId.email, studentDoc.userId.fullName); // Send email notification.
      } // Close email check.
    } catch (certError) { // Catch certificate generation errors.
      console.error('[Scores] Certificate generation failed but continuing with result publishing:', certError); // Log error but don't block.
      certificateUrl = null; // Set certificate URL to null on failure.
    } // Close certificate generation try-catch.
    
    // Insert or replace FinalResult document in database collections with certificate and badges.
    const updatedResultDoc = await FinalResult.findOneAndUpdate(
      { studentId: studentId }, // Match criteria.
      {
        overallScore: overallScore, // Set overallScore attribute.
        bestDepartment: bestDepartment, // Set best department attribute.
        departmentFeedback: departmentFeedback, // Set array of feedback objects.
        hrGeneralFeedback: hrGeneralFeedback, // Set supervisor feedback statement.
        badges: badges, // Set array of earned badges.
        certificateUrl: certificateUrl, // Set certificate file path or null if generation failed.
        isPublished: true, // Mark published true.
        publishedAt: new Date() // Set current publication calendar date.
      },
      { new: true, upsert: true } // Return updated doc, create one if not existing.
    );
    
    // Create a notification for the student informing them their result has been published.
    if (studentDoc && studentDoc.userId) { // Check if student document and user ID exist.
      try { // Start error handling block.
        await createNotification(
          studentDoc.userId._id, // Send notification to the student user ID.
          'Result Published', // Set notification title.
          `Your internship result has been published. You can now view your scores and download your certificate.`, // Set result message.
          '/student/results', // Link to student results page.
          'result' // Set notification type as result.
        ); // Close createNotification call.
      } catch (notifErr) { // Catch notification errors.
        console.error('Failed to dispatch results publication notification:', notifErr); // Log error silently.
      } // Close try-catch block.
    } // Close student existence check.
    // Check if user and email properties are successfully populated.
    if (studentDoc && studentDoc.userId && studentDoc.userId.email) {
      // Dispatch result notification email alerts.
      await sendResultEmail(studentDoc.userId.email, studentDoc.userId.fullName);
    }
    // Return status 200 carrying success details.
    return res.status(200).json({
      message: "result published successfully",
      result: updatedResultDoc
    });
  } catch (err) {
    // Trace backend exceptions.
    console.error('Error publishing final results block:', err);
    // Return 500 server error status.
    return res.status(500).json({ message: "Could not publish final internship results" });
  }
});

// Export the scores route router configuration for root applications module injection.
module.exports = router;
