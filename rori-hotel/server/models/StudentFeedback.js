// This file defines the StudentFeedback database schema to record student complaints or recommendations.
const mongoose = require('mongoose'); // Require mongoose package to establish database link structures.
const studentFeedbackSchema = new mongoose.Schema( // Begin schema mapping instantiation for client student submissions.
  { // List properties for schema elements.
    studentId: { // Record key referencing student profile collection.
      type: mongoose.Schema.Types.ObjectId, // Match standard reference key type.
      ref: 'Student', // Target the student internship profile document.
      required: true // Student link must be provided for every submission trace.
    }, // Close studentId properties.
    targetDepartment: { // Target department code field for feedback categorization.
      type: String // Optional text string showing target department like "Kitchen".
    }, // Close targetDepartment details.
    feedbackType: { // Specify category selection rules.
      type: String, // Value stored as category name identifier.
      required: true, // This field is required to route complaints or feedback properly.
      enum: ['complaint', 'recommendation'] // Limit category selection choices strictly to complaint or recommendation.
    }, // Close feedbackType properties.
    message: { // Actual detailed textual content provided by student.
      type: String, // Hold message texts as string structures.
      required: true // Content text block from user is fully mandatory.
    } // Close message options block.
  }, // Close standard fields properties layout object.
  { // Begin system configuration options block.
    timestamps: true // Track accurate time instances for message delivery and inbox sorting.
  } // Close schema options block.
); // Close schema builder statement.
const StudentFeedback = mongoose.model('StudentFeedback', studentFeedbackSchema); // Formulate StudentFeedback model.
module.exports = StudentFeedback; // Publish database model access across routing endpoints.
