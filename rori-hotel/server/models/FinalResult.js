// This file defines the FinalResult database schema containing overall grade compiled results for internship completion.
const mongoose = require('mongoose'); // Load mongoose module to establish our schema structure.
const finalResultSchema = new mongoose.Schema( // Begin final results schema mapping construction.
  { // Start of fields definition mapping object.
    studentId: { // Record key referencing student profile collection.
      type: mongoose.Schema.Types.ObjectId, // Match standard reference key type.
      ref: 'Student', // Map relationship path pointing toward student records.
      required: true, // Identify student reference key as mandatory input value.
      unique: true // Restrict to keep single compiled outcome per candidate.
    }, // Close studentId configurations.
    overallScore: { // Numeric sum averaging all department ratings.
      type: Number // Store average as floating value under number formats.
    }, // Close overallScore configuration.
    bestDepartment: { // Best performing department title indicator.
      type: String // Department name string where performance peaked.
    }, // Close bestDepartment configurations.
    departmentFeedback: { // List storing feedback from every department rotation.
      type: Array // Store as array of feedback objects.
    }, // Close departmentFeedback configurations.
    hrGeneralFeedback: { // HR manager's final written recommendation message field.
      type: String // Custom text feedback block on internship completion.
    }, // Close hrGeneralFeedback configurations.
    isPublished: { // Flag controls student access and authorization check visibility.
      type: Boolean, // Save as binary true state when completed output is published.
      default: false // Start visibility mode as unpublished draft view state.
    }, // Close isPublished options.
    publishedAt: { // Timestamp documenting successful publications on server.
      type: Date // Save publishing calendar date.
    }, // Close publishedAt options.
    certificateUrl: { // Track PDF attachment reference.
      type: String // File system storage path referencing certificate PDF.
    }, // Close certificateUrl options.
    badges: { // Array of achievement badges earned by student based on performance and participation.
      type: Array, // Store as array of badge objects containing name, emoji, description, and color.
      default: [] // Initialize as empty array with no badges by default.
    } // Close badges field configuration.
  }, // Close standard fields properties layout object.
  { // Begin system configuration options block.
    timestamps: true // Tracks the exact grading history and submission logs automatically.
  } // Close schema options tracking block.
); // Close schema constructor declaration.
const FinalResult = mongoose.model('FinalResult', finalResultSchema); // Compile FinalResult representation.
module.exports = FinalResult; // Export compiled final result data management schema.
