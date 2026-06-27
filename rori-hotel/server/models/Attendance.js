// This file defines the Attendance database schema which records daily clock-in checks for internship students.
const mongoose = require('mongoose'); // Import Mongoose library to create the database schema.
const attendanceSchema = new mongoose.Schema( // Define the structure mapping for the attendance record.
  { // Start of fields definition mapping object.
    studentId: { // Field linking back to the Student profile database collection.
      type: mongoose.Schema.Types.ObjectId, // Hold specific MongoDB ObjectId data.
      ref: 'Student', // Reference the student internship profile document.
      required: true // Marking student owner link as mandatory.
    }, // Close studentId field options.
    department: { // Department name where attendance happened that day.
      type: String, // Value stored as a department name string.
      required: true // Must be filled to log correct logs for department supervisors.
    }, // Close department field settings.
    date: { // Date string formatted precisely as YYYY-MM-DD.
      type: String, // String representation format to allow matching calendar dates easily.
      required: true // Calendar date tracking flag is mandatory.
    }, // Close date field settings.
    clockIn: { // Morning arrival execution time field.
      type: String // String holding precise 24-hour hour and minute tag like 08:00.
    }, // Close clockIn field configuration.
    clockOut: { // Afternoon departure execution time field.
      type: String // String holding departure time format tag like 17:00.
    }, // Close clockOut field configuration.
    isLate: { // Automatic late tracker evaluation.
      type: Boolean, // Store as conditional truth status.
      default: false // Base late flag starts natively as false.
    }, // Close isLate field settings.
    correctedByHR: { // Track if record has been edited manually.
      type: Boolean, // Store as conditional truth status.
      default: false // Starts as false indicating unedited natural log check.
    } // Close correctedByHR field settings.
  }, // Close fields configuration layout mapping.
  { // Start system config properties.
    timestamps: true // Track the precise modification and logging instances.
  } // Close system config properties.
); // Close attendanceSchema Constructor.
const Attendance = mongoose.model('Attendance', attendanceSchema); // Compile attendance mapping into database reference.
module.exports = Attendance; // Export Attendance schema module.
