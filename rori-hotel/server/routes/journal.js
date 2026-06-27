// This file defines all API routes for the student journal feature allowing students to write daily entries and HR to review them.
// Journal entries help track student experiences, challenges, and growth throughout their internship.
const express = require('express'); // Import express framework for routing and middleware.
const router = express.Router(); // Create new Express router instance for journal-related endpoints.
const { protect } = require('../middleware/authMiddleware'); // Import authentication middleware to secure routes with JWT verification.
const Journal = require('../models/Journal'); // Import Journal model for database operations on journal entries.
const Student = require('../models/Student'); // Import Student model to verify student ownership and retrieve student data.

// POST route at / to create a new journal entry - only accessible to authenticated students.
router.post('/', protect, async (req, res) => { // Define POST endpoint with protect middleware for JWT authentication.
  try { // Start error handling block to catch any database or validation errors.
    const { title, content, department, mood, date } = req.body; // Extract journal entry fields from request body.
    const userId = req.user.id || req.user.userId; // Get authenticated user ID from JWT token attached by protect middleware.
    
    // Validate that required fields are provided by checking title and content.
    if (!title || !content || !date) { // Check if any required field is missing or empty.
      return res.status(400).json({ message: 'Title, content, and date are required' }); // Return 400 bad request with validation error message.
    } // End validation check.
    
    // Find the student record associated with this authenticated user to get studentId.
    const student = await Student.findOne({ userId: userId }); // Query Student collection for document where userId matches logged-in user.
    if (!student) { // Check if no student record was found.
      return res.status(404).json({ message: 'Student profile not found' }); // Return 404 error if user is not a registered student.
    } // End student existence check.
    
    // Create new journal entry document with all provided data and student reference.
    const newJournal = new Journal({ // Instantiate new Journal document with field values.
      studentId: student._id, // Set student reference using found student document ID.
      date: date, // Set entry date from request body in YYYY-MM-DD format.
      title: title, // Set entry title from request body.
      content: content, // Set entry content text from request body.
      department: department || student.currentDepartment || '', // Set department from body or use student's current department or empty string.
      mood: mood || 'okay' // Set mood from body or default to "okay" if not provided.
    }); // Close Journal document creation.
    
    await newJournal.save(); // Save new journal entry to MongoDB database.
    console.log('[Journal] New entry created for student:', student._id, 'on date:', date); // Log successful journal creation with student ID and date.
    
    return res.status(201).json({ // Return 201 Created status for successful resource creation.
      message: 'Journal entry created successfully', // Success message.
      journal: newJournal // Return the created journal document with all fields including generated _id.
    }); // Close response.
  } catch (error) { // Catch any errors during journal creation process.
    console.error('[Journal] Error creating entry:', error.message); // Log error message to console for debugging.
    return res.status(500).json({ message: 'Server error creating journal entry' }); // Return 500 server error response.
  } // End try-catch block.
}); // Close POST / route.

// GET route at /my-entries to retrieve all journal entries for the authenticated student sorted by date.
router.get('/my-entries', protect, async (req, res) => { // Define GET endpoint with authentication middleware.
  try { // Start error handling block.
    const userId = req.user.id || req.user.userId; // Get authenticated user ID from JWT token.
    
    // Find student record for this user to get studentId for querying journals.
    const student = await Student.findOne({ userId: userId }); // Query Student collection by userId.
    if (!student) { // Check if student record exists.
      return res.status(404).json({ message: 'Student profile not found' }); // Return 404 if no student found.
    } // End student check.
    
    // Query all journal entries for this student sorted by date descending (newest first).
    const journals = await Journal.find({ studentId: student._id }) // Find all journals where studentId matches.
      .sort({ date: -1, createdAt: -1 }) // Sort by date descending then by createdAt descending for consistent ordering.
      .lean(); // Convert to plain JavaScript objects for better performance.
    
    console.log('[Journal] Retrieved', journals.length, 'entries for student:', student._id); // Log number of entries retrieved.
    return res.status(200).json({ journals }); // Return 200 OK with array of journal entries.
  } catch (error) { // Catch any errors during retrieval.
    console.error('[Journal] Error retrieving entries:', error.message); // Log error.
    return res.status(500).json({ message: 'Server error retrieving journal entries' }); // Return 500 error.
  } // End try-catch.
}); // Close GET /my-entries route.

// GET route at /student/:studentId to retrieve all journal entries for a specific student - HR only.
router.get('/student/:studentId', protect, async (req, res) => { // Define GET endpoint with authentication and student ID parameter.
  try { // Start error handling block.
    const { studentId } = req.params; // Extract studentId from URL parameters.
    const userRole = req.user.role; // Get authenticated user's role from JWT token.
    
    // Verify that only HR users can access other students' journal entries.
    if (userRole !== 'hr') { // Check if user role is not HR.
      return res.status(403).json({ message: 'Only HR can view student journal entries' }); // Return 403 Forbidden if not HR.
    } // End role verification.
    
    // Query all journal entries for the specified student sorted by date descending.
    const journals = await Journal.find({ studentId: studentId }) // Find journals matching the provided studentId.
      .sort({ date: -1, createdAt: -1 }) // Sort by date newest first for chronological review.
      .populate('studentId', 'fullName universityName') // Populate student reference to get name and university.
      .lean(); // Convert to plain objects.
    
    console.log('[Journal] HR retrieved', journals.length, 'entries for student:', studentId); // Log HR access to student journals.
    return res.status(200).json({ journals }); // Return 200 OK with journal entries array.
  } catch (error) { // Catch errors.
    console.error('[Journal] Error retrieving student entries:', error.message); // Log error.
    return res.status(500).json({ message: 'Server error retrieving journal entries' }); // Return 500 error.
  } // End try-catch.
}); // Close GET /student/:studentId route.

// DELETE route at /:entryId to delete a specific journal entry - students can only delete their own entries.
router.delete('/:entryId', protect, async (req, res) => { // Define DELETE endpoint with authentication and entry ID parameter.
  try { // Start error handling block.
    const { entryId } = req.params; // Extract journal entry ID from URL parameters.
    const userId = req.user.id || req.user.userId; // Get authenticated user ID.
    
    // Find the journal entry by ID to check ownership before deletion.
    const journal = await Journal.findById(entryId); // Query Journal collection by entry ID.
    if (!journal) { // Check if journal entry exists.
      return res.status(404).json({ message: 'Journal entry not found' }); // Return 404 if entry doesn't exist.
    } // End existence check.
    
    // Find student record for ownership verification.
    const student = await Student.findOne({ userId: userId }); // Query Student by userId.
    if (!student) { // Check if student exists.
      return res.status(404).json({ message: 'Student profile not found' }); // Return 404 if no student.
    } // End student check.
    
    // Verify that the journal entry belongs to the authenticated student before allowing deletion.
    if (journal.studentId.toString() !== student._id.toString()) { // Compare studentId from journal with authenticated student's ID.
      return res.status(403).json({ message: 'You can only delete your own journal entries' }); // Return 403 Forbidden if ownership check fails.
    } // End ownership verification.
    
    // Delete the journal entry from database using findByIdAndDelete method.
    await Journal.findByIdAndDelete(entryId); // Remove journal document from collection.
    console.log('[Journal] Entry deleted:', entryId, 'by student:', student._id); // Log successful deletion.
    
    return res.status(200).json({ message: 'Journal entry deleted successfully' }); // Return 200 OK with success message.
  } catch (error) { // Catch any errors during deletion.
    console.error('[Journal] Error deleting entry:', error.message); // Log error.
    return res.status(500).json({ message: 'Server error deleting journal entry' }); // Return 500 error.
  } // End try-catch.
}); // Close DELETE /:entryId route.

// Export the journal router to be registered in main server file.
module.exports = router; // Export router for use in server.js.
