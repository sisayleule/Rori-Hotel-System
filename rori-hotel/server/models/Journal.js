// This file defines the Journal mongoose schema for storing student daily journal entries during their internship.
// Students write journal entries about their daily experiences, learnings, and reflections which HR can review.
const mongoose = require('mongoose'); // Import mongoose library for MongoDB object modeling and schema definitions.

// Create the Journal schema with all required fields for daily journal entry documentation.
const journalSchema = new mongoose.Schema({ // Define new schema using mongoose Schema constructor.
  studentId: { // Reference to the student who wrote this journal entry.
    type: mongoose.Schema.Types.ObjectId, // Use MongoDB ObjectId type for referencing other documents.
    ref: 'Student', // Reference points to Student model for population.
    required: true // This field is mandatory - every journal entry must belong to a student.
  }, // Close studentId field definition.
  
  date: { // The date this journal entry is for in YYYY-MM-DD string format for easy sorting and querying.
    type: String, // Store as string in YYYY-MM-DD format like "2024-01-15".
    required: true // Date is mandatory - every entry must have a date.
  }, // Close date field definition.
  
  title: { // Short title or headline for the journal entry summarizing the day's main focus.
    type: String, // Store as text string.
    required: true, // Title is mandatory for context.
    maxlength: 100 // Limit to 100 characters to keep titles concise and readable.
  }, // Close title field definition.
  
  content: { // The main journal entry text where student writes detailed reflections and experiences.
    type: String, // Store as text string for long-form writing.
    required: true, // Content is mandatory - journal entry cannot be empty.
    maxlength: 2000 // Limit to 2000 characters to encourage focused writing while allowing detail.
  }, // Close content field definition.
  
  department: { // The department the student was working in on this date for context.
    type: String, // Store as text string.
    default: '' // Optional field - defaults to empty string if not provided.
  }, // Close department field definition.
  
  mood: { // Student's emotional state or mood during that day to track wellbeing.
    type: String, // Store as text string.
    enum: ['great', 'good', 'okay', 'tired', 'difficult'], // Restrict to these 5 predefined mood options for consistency.
    default: 'okay' // Default to neutral "okay" mood if not specified.
  }, // Close mood field definition.
  
  createdAt: { // Timestamp of when this journal entry was created in the system.
    type: Date, // Store as JavaScript Date object.
    default: Date.now // Automatically set to current date/time when entry is created.
  } // Close createdAt field definition.
}); // Close schema definition.

// Create index on studentId and date combination for efficient querying of entries by student and date.
journalSchema.index({ studentId: 1, date: -1 }); // Compound index with studentId ascending and date descending for sorted queries.

// Export the Journal model for use in route handlers and controllers.
module.exports = mongoose.model('Journal', journalSchema); // Create and export mongoose model named 'Journal' with journalSchema definition.
