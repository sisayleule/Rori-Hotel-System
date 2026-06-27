// This file defines the database schema storing grades assigned by supervisors of different departments with detailed breakdown.
const mongoose = require('mongoose'); // Load mongoose module to establish our schema structure.
const supervisorScoreSchema = new mongoose.Schema( // Begin supervisor score schema definition structure.
  { // Start listing fields.
    studentId: { // Identify the student being evaluated.
      type: mongoose.Schema.Types.ObjectId, // Hold specific reference database key.
      ref: 'Student', // Reference target student metadata profile.
      required: true // Student field link must be supplied for every score record.
    }, // Close studentId field options.
    supervisorId: { // Identify supervisor who gave the score.
      type: mongoose.Schema.Types.ObjectId, // Hold specific user reference database key.
      ref: 'User', // Reference target user account metadata.
      required: true // Supervisor field link must be supplied for trace checks.
    }, // Close supervisorId field options.
    department: { // Department name context where score is being registered.
      type: String, // Hold department name as a text string.
      required: true, // This field is required to specify department source.
      enum: ['Front Office', 'Housekeeping', 'Kitchen', 'F&B Service'] // Restrict department classification options exactly.
    }, // Close department field options.
    score: { // Overall value storing quantitative appraisal out of one hundred points (calculated from sub-scores).
      type: Number, // Number type to allow mathematical operations and average calculations.
      required: true, // Score value is required for grades check.
      min: 0, // Enforce lower threshold numeric score boundaries to zero.
      max: 100 // Enforce upper limit numeric score boundaries to one hundred.
    }, // Close score field options.
    // SUB-SCORE BREAKDOWN FIELDS - New detailed scoring system breaking down performance into 4 key areas.
    technicalSkills: { // Score for technical job skills and competency in department-specific tasks (out of 100).
      type: Number, // Store as number for calculations.
      min: 0, // Minimum score is 0.
      max: 100, // Maximum score is 100.
      default: 0 // Default to 0 if not provided for backward compatibility.
    }, // Close technicalSkills field options.
    communication: { // Score for communication skills including verbal, written, and interpersonal abilities (out of 100).
      type: Number, // Store as number for calculations.
      min: 0, // Minimum score is 0.
      max: 100, // Maximum score is 100.
      default: 0 // Default to 0 if not provided for backward compatibility.
    }, // Close communication field options.
    teamwork: { // Score for teamwork and collaboration with colleagues and other departments (out of 100).
      type: Number, // Store as number for calculations.
      min: 0, // Minimum score is 0.
      max: 100, // Maximum score is 100.
      default: 0 // Default to 0 if not provided for backward compatibility.
    }, // Close teamwork field options.
    professionalism: { // Score for professionalism including punctuality, attitude, dress code, and work ethic (out of 100).
      type: Number, // Store as number for calculations.
      min: 0, // Minimum score is 0.
      max: 100, // Maximum score is 100.
      default: 0 // Default to 0 if not provided for backward compatibility.
    }, // Close professionalism field options.
    comments: { // Text field for supervisor general comments and detailed feedback.
      type: String // Save reviewer free text comments string.
    }, // Close comments options.
    isSubmitted: { // Form state locking flag for submitted evaluations.
      type: Boolean, // Store state as digital true or false flag.
      default: false // Score starts editable as unsubmitted draft with log false.
    } // Close isSubmitted field options.
  }, // Close root fields mapping.
  { // Open schema options object.
    timestamps: true // Tracks the exact grading history and submission logs automatically.
  } // Close schema options object.
); // Close supervisor schema construction.

// Add pre-save middleware to automatically calculate overall score from sub-scores if sub-scores are provided.
supervisorScoreSchema.pre('save', function(next) { // Define pre-save hook that runs before document is saved to database.
  // Calculate overall score as average of 4 sub-scores if all sub-scores are provided (not default 0).
  if (this.technicalSkills > 0 || this.communication > 0 || this.teamwork > 0 || this.professionalism > 0) { // Check if any sub-score is set.
    // Calculate average of the 4 sub-scores and round to 1 decimal place.
    const avg = (this.technicalSkills + this.communication + this.teamwork + this.professionalism) / 4; // Sum and divide by 4.
    this.score = Number(avg.toFixed(1)); // Round to 1 decimal and save to main score field.
  } // Close sub-score check.
  next(); // Call next middleware or save operation.
}); // Close pre-save middleware.

const SupervisorScore = mongoose.model('SupervisorScore', supervisorScoreSchema); // Formulate supervisor model.
module.exports = SupervisorScore; // Publish model access across routing endpoints.
