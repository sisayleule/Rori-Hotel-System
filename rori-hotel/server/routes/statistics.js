// This file handles all statistics and analytics data for the HR dashboard. Only HR can access these routes.
const express = require('express'); // Import express framework module to initialize routing middleware.
const router = express.Router(); // Create a new express Router constructor instance.
const { protect } = require('../middleware/authMiddleware'); // Import protect helper to require active auth tokens.
const { requireRole } = require('../middleware/roleMiddleware'); // Import requireRole helper to enforce privilege restrictions.
const Student = require('../models/Student'); // Import Student database model.
const SupervisorScore = require('../models/SupervisorScore'); // Import SupervisorScore database model.
const FinalResult = require('../models/FinalResult'); // Import FinalResult database model.
const User = require('../models/User'); // Import User database model.
// Create a GET route at path /overview. Use protect and requireRole with hr.
router.get('/overview', protect, requireRole('hr'), async (req, res) => { // Setup GET /overview path with protections.
  try { // Start safety try block wrapper.
    const totalStudents = await Student.countDocuments({}); // Count total number of Student documents ever created with empty filter.
    const activeStudents = await Student.countDocuments({ status: 'approved' }); // Count students where status is approved.
    const pendingStudents = await Student.countDocuments({ status: 'pending' }); // Count students where status is pending.
    const rejectedStudents = await Student.countDocuments({ status: 'rejected' }); // Count students where status is rejected.
    const firstDayOfMonth = new Date(); // Create a new Date object representing today.
    firstDayOfMonth.setDate(1); // Set its date day to the first of the month.
    firstDayOfMonth.setHours(0, 0, 0, 0); // Set its hours, minutes, seconds, milliseconds all to 0 to find start of month.
    const thisMonthStudents = await Student.countDocuments({ createdAt: { $gte: firstDayOfMonth } }); // Count students created since the first day of this month.
    const perDepartment = await Student.aggregate([ // Begin aggregation pipeline on Student collection.
      { // Filter for approved candidates stage.
        $match: { status: 'approved' } // Keep only approved candidate records.
      }, // End match stage of pipeline.
      { // Group by department and compute count stage.
        $group: { // Group parameters definition.
          _id: '$assignedDepartment', // Group files by the assignedDepartment attribute.
          count: { $sum: 1 } // Sum up counts of entries inside each group.
        } // End group attributes.
      } // End group stage.
    ]); // End aggregation query.
    const publishedResults = await FinalResult.find({ isPublished: true }); // Query for all published final internship outcomes.
    let overallAverage = 0; // Initialize average tracker as zero by default.
    if (publishedResults.length > 0) { // Check if any reports were published.
      const sumOfScores = publishedResults.reduce((sum, resDoc) => sum + (resDoc.overallScore || 0), 0); // Sum up all overallScore values.
      overallAverage = Number((sumOfScores / publishedResults.length).toFixed(1)); // Calculate average and round to 1 decimal.
    } // End calculation check block.
    return res.status(200).json({ // Return status 200 carrying metrics outputs.
      totalStudents, // Pass total registration count.
      activeStudents, // Pass approved interns count.
      pendingStudents, // Pass pending applications count.
      rejectedStudents, // Pass rejected files count.
      thisMonthStudents, // Pass current month registration count.
      perDepartment, // Pass active counts grouped per division.
      overallAverage // Pass aggregated average rating.
    }); // Close JSON execution return.
  } catch (err) { // Trap execution errors.
    console.error('Error calculating overall metrics:', err); // Log error to the console.
    return res.status(500).json({ message: 'could not compute overview statistics' }); // Return code 500 error indicator.
  } // Terminate try-catch block.
}); // Close GET /overview route path.
// Create a GET route at path /scores. Use protect and requireRole with hr.
router.get('/scores', protect, requireRole('hr'), async (req, res) => { // Setup GET /scores path with protections.
  try { // Start try block.
    const departmentScores = await SupervisorScore.aggregate([ // Begin aggregation pipeline on SupervisorScore.
      { // Match stage.
        $match: { isSubmitted: true } // Filter scores where isSubmitted flag is set to true.
      }, // End match stage block.
      { // Group stage.
        $group: { // Group parameter settings.
          _id: '$department', // Group elements by department key.
          averageScore: { $avg: '$score' } // Average score field values.
        } // End group properties.
      }, // End group stage block.
      { // Project stage.
        $project: { // Project criteria.
          department: '$_id', // Set department name to the grouped _id value.
          averageScore: { $round: ['$averageScore', 1] }, // Round the average rating to 1 decimal.
          _id: 0 // Suppress Mongoose _id parameter.
        } // End project configurations.
      } // End project stage block.
    ]); // End aggregation statement.
    return res.status(200).json(departmentScores); // Return 200 with resolved department ratings list.
  } catch (err) { // Trap errors.
    console.error('Error fetching scores aggregations:', err); // Log exception details.
    return res.status(500).json({ message: 'failed to resolve scores per department' }); // Return status 150 code.
  } // Terminate try-catch block.
}); // Close GET /scores route path.
// Create a GET route at path /monthly. Use protect and requireRole with hr.
router.get('/monthly', protect, requireRole('hr'), async (req, res) => { // Setup GET /monthly path with protections.
  try { // Start try block.
    const rawMonthlyData = await Student.aggregate([ // Begin aggregation pipeline on Student.
      { // Group stage.
        $group: { // Group configurations.
          _id: { // Specify group identity.
            year: { $year: '$createdAt' }, // Extract year from createdAt timestamp.
            month: { $month: '$createdAt' } // Extract month from createdAt timestamp.
          }, // End group identity parameters.
          count: { $sum: 1 } // Count registrations per year and month.
        } // End group configuration.
      }, // End group stage.
      { // Sort stage.
        $sort: { // Sort parameters.
          '_id.year': 1, // Sort year ascending.
          '_id.month': 1 // Sort month ascending.
        } // End sort definitions.
      } // End sort stage.
    ]); // End aggregation statement.
    const monthlyData = rawMonthlyData.slice(-12); // Slice to retain exclusive registration data from last 12 months.
    const monthNames = [ // Set list of readable months names.
      'January', 'February', 'March', 'April', 'May', 'June', // Store months names.
      'July', 'August', 'September', 'October', 'November', 'December' // Store remains months names.
    ]; // Close array definition.
    const formattedMonthlyData = monthlyData.map(item => { // Format into readable data objects map.
      const monthIdx = item._id.month - 1; // Calculate month list index.
      const label = `${monthNames[monthIdx]} ${item._id.year}`; // Join text name and year calendar details.
      return { // Return mapped element.
        month: label, // Set readable label string.
        count: item.count // Set registration count parameter.
      }; // Close element.
    }); // End formatter loop.
    return res.status(200).json(formattedMonthlyData); // Return 200 with formatted monthly registration data.
  } catch (err) { // Trap errors.
    console.error('Error aggregating monthly registration data:', err); // Log exception report.
    return res.status(500).json({ message: 'could not compute monthly analytics' }); // Return 150 code.
  } // Terminate try-catch block.
}); // Close GET /monthly route path.
// Create a GET route at path /top-students. Use protect and requireRole with hr.
router.get('/top-students', protect, requireRole('hr'), async (req, res) => { // Setup GET /top-students path with protections.
  try { // Start try block.
    const topResults = await FinalResult.find({ isPublished: true }) // Find all published FinalResult documents.
      .sort({ overallScore: -1 }) // Sort by overallScore in descending sequence.
      .limit(3) // Restrict to top 3 performing interns.
      .populate('studentId'); // Populate related Student profiles details.
    const topStudentsFormatted = []; // Initialize array to hold formatted student list.
    for (let i = 0; i < topResults.length; i++) { // Loop active topResults items list.
      const resDoc = topResults[i]; // Retain current item reference.
      const studentDoc = resDoc.studentId; // Extract populated student profile content.
      let studentName = 'Academic Intern'; // Establish base name fallback.
      if (studentDoc && studentDoc.userId) { // Check if student profile maps user links.
        const userDoc = await User.findById(studentDoc.userId); // Fetch matching User database record using userId.
        if (userDoc) { // Check if user database entry was found.
          studentName = userDoc.fullName; // Grab full name metadata.
        } // Close nested check.
      } // Close outer check.
      topStudentsFormatted.push({ // Push formatted object into list.
        rank: i + 1, // Store leaderboard rank.
        studentName: studentName, // Store resolved name.
        universityName: studentDoc ? studentDoc.universityName : 'University', // Store university credentials.
        overallScore: resDoc.overallScore, // Store average grade.
        bestDepartment: resDoc.bestDepartment // Store leading rotation department.
      }); // End array append.
    } // End loop.
    return res.status(200).json(topStudentsFormatted); // Return 200 with formatted top students array.
  } catch (err) { // Trap errors.
    console.error('Error fetching leaderboard performance list:', err); // Print exception indicators.
    return res.status(500).json({ message: 'failed to resolve student leaderboard statistics' }); // Return status 500 error code.
  } // Terminate try-catch block.
}); // Close GET /top-students route path.
module.exports = router; // Export the router database collection.
