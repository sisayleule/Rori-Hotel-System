// This file defines the Mongoose database schema used to store internship application details of student users.
const mongoose = require('mongoose'); // Load mongoose module to establish our schema structure.
const studentSchema = new mongoose.Schema( // Instantiate schema for our Student database collection.
  { // Open fields object mapping.
    userId: { // Specify properties mapping to reference the parent user account of this student.
      type: mongoose.Schema.Types.ObjectId, // The data type for reference is a MongoDB ObjectId.
      ref: 'User', // Set model reference pointing to the registered User model collection.
      required: true // This is a mandatory reference link which must always be populated.
    }, // Close properties for userId.
    universityName: { // Specify properties for universityName where the student is studying - optional to prevent registration blocking.
      type: String, // String type to hold the academic institution's official title.
      required: false // Making this field optional so registration never fails due to missing university name.
    }, // Close properties for universityName.
    studentIdNumber: { // Specify student university identification number settings - optional to prevent registration blocking.
      type: String, // String format to hold numbers with potential dash or prefix structures.
      required: false // Making this field optional so registration never fails due to missing student ID.
    }, // Close properties for studentIdNumber.
    departmentPreference: { // Specify department preference choices - renamed to Primary Department Interest for informational purposes only, actual rotation managed by HR.
      type: String, // String format to match chosen department name.
      required: false, // Making this field optional so registration never fails due to missing department preference.
      enum: ['Front Office', 'Housekeeping', 'Kitchen', 'F&B Service'] // Restrict to these exact hotel department names when provided.
    }, // Close properties for departmentPreference.
    // NEW ROTATION SYSTEM FIELDS — Students now rotate through all 4 departments instead of being assigned to just one department.
    currentDepartment: { // The department the student is currently working in right now, set and updated by HR when approving or moving rotations.
      type: String, // String value holding current active department name.
      required: false, // Optional because it gets set only after HR approves the application.
      enum: ['Front Office', 'Housekeeping', 'Kitchen', 'F&B Service'] // Limit to valid department names matching rotation options.
    }, // Close properties for currentDepartment.
    completedDepartments: { // Array list of all departments the student has already finished working in during their internship rotation.
      type: [String], // Array of strings where each string is a department name that was completed.
      default: [] // Initialize as empty array since no departments are completed at registration time.
    }, // Close properties for completedDepartments.
    departmentRotationOrder: { // The specific order in which this student will rotate through all 4 departments, set by HR during approval process.
      type: [String], // Array of 4 department names in the exact sequence the student will work through them.
      default: [] // Initialize as empty array, gets populated when HR approves and sets rotation order.
    }, // Close properties for departmentRotationOrder.
    phoneNumber: { // Specify phone number of the trainee.
      type: String,
      required: false
    },
    profilePhoto: { // Specify image path destination properties.
      type: String // String format storage for file paths referencing uploaded profile photos.
    }, // Close properties for profilePhoto.
    idDocument: { // Specify passport or student ID doc scan location settings.
      type: String // String path linking to the scanned verification image file on server.
    }, // Close idDocument options.
    internshipLetter: { // Specify academic official permission letter document settings.
      type: String // String format path leading to saved document attachment.
    }, // Close internshipLetter options.
    status: { // Track state of review process for this internship candidate.
      type: String, // String value representing state indicators.
      default: 'pending', // Applications start automatically inside a pending state status.
      enum: ['pending', 'approved', 'rejected'] // Limit values to either pending, approved, or rejected tags.
    }, // Close status options.
    rejectionNote: { // Specify rejection reasons stored if applicant is turned down by HR.
      type: String // Text block storage detailing specific decision reasons.
    }, // Close rejectionNote options.
    startDate: { // Field mapping to record estimated start dates.
      type: Date // Date object format for proper calendar querying.
    }, // Close startDate options.
    endDate: { // Field mapping to record estimated end dates.
      type: Date // Date object format for proper calendar querying.
    }, // Close endDate options.
    assignedDepartment: { // Field storing actual department internship was granted towards.
      type: String // Department name string assigned after screening.
    }, // Close assignedDepartment properties.
    isApprovedForGrading: { // Boolean to lock supervisor score submissions until approved by HR.
      type: Boolean,
      default: false
    }
  }, // Close details mapping object.
  { // Open schema timestamp settings configuration object.
    timestamps: true // Track the precise registration and update date-time logs dynamically.
  } // Close schema options tracking block.
); // Close schema constructor declaration.
const Student = mongoose.model('Student', studentSchema); // Compile Student model representation.
module.exports = Student; // Make Student model export clear to application-wide modules.
