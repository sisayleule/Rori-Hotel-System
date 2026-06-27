// This file handles QR attendance scanning and HR attendance management.
const express = require('express'); // Import express framework module to initialize routing middleware.
const router = express.Router(); // Create a new express Router constructor instance.
const { protect } = require('../middleware/authMiddleware'); // Import the protect token-validation middleware.
const { requireRole } = require('../middleware/roleMiddleware'); // Import requireRole middleware to validate user permissions.
const Attendance = require('../models/Attendance'); // Import the Attendance database model.
const Student = require('../models/Student'); // Import the Student model to manage profiles.
const QRToken = require('../models/QRToken'); // Import QRToken schema to query unique UUID department tokens.
const User = require('../models/User'); // Import User model to retrieve student names for notifications.
const { notifyAllWithRole } = require('../utils/notifications'); // Import notification broadcast utility.

// Create a GET route at path /verify which is public for initial QR code confirmation.
router.get('/verify', async (req, res) => {
  // Try-catch block to contain background errors safely.
  try {
    // Read the query parameter token containing QR identification code.
    const token = req.query.token;
    // Check if the parameter token is actually empty or missing.
    if (!token) {
      // Respond with a 400 bad request status stating missing token details.
      return res.status(400).json({ message: "no token provided" });
    }
    // Search the QRToken collections matching target token parameter.
    const qrDoc = await QRToken.findOne({ token: token });
    // If no matching token record resides in database storage.
    if (!qrDoc) {
      // Respond to customer returning a 404 code with invalid message.
      return res.status(404).json({ message: "invalid QR code" });
    }
    // Return a 200 success response containing the department name verified.
    return res.status(200).json({ department: qrDoc.department });
  } catch (err) {
    // Write out diagnostic trace onto terminal console logs.
    console.error('Error verifying token:', err);
    // Return standard status 500 error code indicating system fault.
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Create a POST route at path /scan allowing approved students to record shifts logins.
router.post('/scan', protect, requireRole('student'), async (req, res) => {
  // Wrap core scan checking algorithms inside safety try-catch block.
  try {
    // Isolate token values and types (clockIn or clockOut strings) directly from request body.
    const token = req.body.token;
    const type = req.body.type;
    // Resolve caller student user identifier key.
    const currentUserId = req.user.id || req.user.userId;
    // Search for verification keys matching decoded inputs.
    const qrDoc = await QRToken.findOne({ token: token });
    // Block actions if incoming tokens are not validated.
    if (!qrDoc) {
      // Respond with a 404 code signaling invalid scan actions.
      return res.status(404).json({ message: "invalid QR code" });
    }
    // Isolate confirmed department name value from matching token document.
    const targetDepartmentNameValue = qrDoc.department;
    // Look up the calling person's Student profile using currentUserId key.
    const studentProfile = await Student.findOne({ userId: currentUserId });
    // Abort if no student profile records match identity.
    if (!studentProfile) {
      // Respond stating missing information data error.
      return res.status(404).json({ message: "student profile not found" });
    }
    // Format calendar dates string exactly as YYYY-MM-DD.
    const todayISOString = new Date().toISOString(); // Obtain ISO timestamp.
    const currentDateFormattedString = todayISOString.split('T')[0]; // Extract calendar portion.
    // Build hourly minutes string formatted exactly as HH:MM with zero-padded prefixes.
    const currentClockTime = new Date(); // Construct date.
    const clockHoursStringValue = String(currentClockTime.getHours()).padStart(2, '0'); // Pad hours.
    const clockMinutesStringValue = String(currentClockTime.getMinutes()).padStart(2, '0'); // Pad minutes.
    const formattedTimeString = `${clockHoursStringValue}:${clockMinutesStringValue}`; // Join elements.
    // Query database seeking prior existing attendance logs matching key attributes.
    const existingRecord = await Attendance.findOne({
      studentId: studentProfile._id, // Filter for student profile identifier key.
      date: currentDateFormattedString, // Filter for today's date format tracker.
      department: targetDepartmentNameValue // Filter for matching department.
    });
    // Check if the student wishes to register an arrival clockIn operation.
    if (type === 'clockIn') {
      // Check if they have already registered arrival logs today.
      if (existingRecord && existingRecord.clockIn) {
        // Return 400 bad request error blocking repeated clock-in actions.
        return res.status(400).json({ message: "you have already clocked in today for this department" });
      }
      // Evaluate if the student arrived late by comparing formattedTimeString value against 08:00 threshold.
      const isLate = formattedTimeString > '08:00'; // Set boolean state.
      // If there is an existing record created for this date (e.g. empty check is present).
      if (existingRecord) {
        // Supply arrival records directly on the existing entry.
        existingRecord.clockIn = formattedTimeString; // Assign time.
        existingRecord.isLate = isLate; // Assign evaluation flag.
        await existingRecord.save(); // Direct record saves.
      } else {
        // Create a completely new Attendance document.
        await Attendance.create({
          studentId: studentProfile._id, // Link student profile.
          department: targetDepartmentNameValue, // Link scanning department.
          date: currentDateFormattedString, // Link formatted calendar date.
          clockIn: formattedTimeString, // Set clockIn logs.
          isLate: isLate // Set late status evaluation flag.
        });
      }
      
      // Create a notification for all HR users informing them that a student has clocked in.
      const userDoc = await User.findById(currentUserId); // Retrieve user document to get student name.
      if (userDoc) { // Check if user document exists.
        await notifyAllWithRole(
          'hr', // Send notification to all users with HR role.
          'Attendance Recorded', // Set notification title.
          `${userDoc.fullName} has clocked in at ${targetDepartmentNameValue}`, // Set clock-in message with student name and department.
          '/hr/attendance', // Link to HR attendance page.
          'attendance' // Set notification type as attendance.
        ); // Close notifyAllWithRole call.
      } // Close user existence check.
      
      // Respond with a 200 success response.
      return res.status(200).json({ message: `Attendance recorded: ${formattedTimeString} (${targetDepartmentNameValue})` });
    }
    // Implement logical flow evaluating clockOut departure submissions.
    if (type === 'clockOut') {
      // Throw 400 error in case no attendance logs were initialized yet today.
      if (!existingRecord) {
        // Respond stating need for clockIn logs.
        return res.status(400).json({ message: "you must clock in before clocking out" });
      }
      // Inspect if clockIn values exist on the retrieved record.
      if (!existingRecord.clockIn) {
        // Respond with a 400 code indicating failure.
        return res.status(400).json({ message: "you have not clocked in yet today" });
      }
      // Apply departure details to today's active attendance log.
      existingRecord.clockOut = formattedTimeString; // Assign time.
      await existingRecord.save(); // Commit record changes safely.
      
      // Create a notification for all HR users informing them that a student has clocked out.
      const userDoc = await User.findById(currentUserId); // Retrieve user document to get student name.
      if (userDoc) { // Check if user document exists.
        await notifyAllWithRole(
          'hr', // Send notification to all users with HR role.
          'Attendance Recorded', // Set notification title.
          `${userDoc.fullName} has clocked out at ${targetDepartmentNameValue}`, // Set clock-out message with student name and department.
          '/hr/attendance', // Link to HR attendance page.
          'attendance' // Set notification type as attendance.
        ); // Close notifyAllWithRole call.
      } // Close user existence check.
      
      // Respond stating clockOut saved successfully.
      return res.status(200).json({ message: `Clock out recorded: ${formattedTimeString}` });
    }
    // Fallback response for unhandled types.
    return res.status(400).json({ message: "invalid scan action type" });
  } catch (err) {
    // Print stack trace.
    console.error('Error scanning attendance block:', err);
    // Respond with a 500 server error status.
    return res.status(500).json({ message: "Could not record attendance" });
  }
});

// Create a GET routes path at / for HR to retrieve all attendance records.
router.get('/', protect, requireRole('hr'), async (req, res) => {
  // Wrap operations within Standard check.
  try {
    // Resolve optional query parameters filters.
    const departmentFilter = req.query.department;
    const dateFilter = req.query.date;
    // Construct database query criteria object.
    const queryCriteria = {};
    // If department filter is supplied.
    if (departmentFilter) {
      // Add department restriction properties mapping values.
      queryCriteria.department = departmentFilter;
    }
    // If date filter is supplied.
    if (dateFilter) {
      // Add date restriction properties mapping values.
      queryCriteria.date = dateFilter;
    }
    // Retrieve all Attendance documents matching criteria filters.
    const listRecords = await Attendance.find(queryCriteria)
      // Populate foreign student references.
      .populate({
        path: 'studentId', // Target path to populate.
        populate: {
          path: 'userId', // Deep populate nested user record to display fullName.
          select: 'fullName email' // Restrict fields payload.
        }
      })
      .sort({ date: -1, clockIn: 1 }); // Sort chronologically descending, then by clockIn ascending.
    // Respond carrying resolved records dataset.
    return res.status(200).json(listRecords);
  } catch (err) {
    // Output error tracers.
    console.error('Error fetching HR logs:', err);
    // Return status 500 error code.
    return res.status(500).json({ message: "Could not retrieve records" });
  }
});

// Create a PUT route at path /:id for HR manual corrections.
router.put('/:id', protect, requireRole('hr'), async (req, res) => {
  // Catch errors safely inside logical sequences.
  try {
    // Isolate target identifier from parameters.
    const recordId = req.params.id;
    // Extract manual adjustments inputs from body values.
    const incomingClockIn = req.body.clockIn;
    const incomingClockOut = req.body.clockOut;
    // Query database selecting attendance record matching parameter ID.
    const targetRecord = await Attendance.findById(recordId);
    // If target record was not found.
    if (!targetRecord) {
      // Abort returning 404 code error.
      return res.status(404).json({ message: "Attendance record not found" });
    }
    // Assign manual clockIn override value if provided.
    if (incomingClockIn !== undefined) {
      // Overwrite property.
      targetRecord.clockIn = incomingClockIn;
    }
    // Assign manual clockOut override value if provided.
    if (incomingClockOut !== undefined) {
      // Overwrite property.
      targetRecord.clockOut = incomingClockOut;
    }
    // Set correctedByHR status indicator flag to true.
    targetRecord.correctedByHR = true;
    // Save record.
    await targetRecord.save();
    // Re-populate and query updated records.
    const populatedRecord = await Attendance.findById(recordId).populate({
      path: 'studentId',
      populate: { path: 'userId', select: 'fullName' }
    });
    // Respond back to client with HTTP status 200 carrying updated record.
    return res.status(200).json(populatedRecord);
  } catch (err) {
    // Trace diagnostic info.
    console.error('Error editing attendance details:', err);
    // Respond 500 server error.
    return res.status(500).json({ message: "Could not save manual correction" });
  }
});

// Export the completed attendance router module block.
module.exports = router;
