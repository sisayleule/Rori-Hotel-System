// This file defines the User database model schema to store user login accounts.
const mongoose = require('mongoose'); // Import the mongoose module to create our database schema.
const userSchema = new mongoose.Schema( // Define the schema of fields for our User collection.
  { // Open the properties object definition.
    fullName: { // Specify properties for the full name of the user.
      type: String, // The full name must be stored as a string.
      required: true // This is a mandatory field that cannot be left blank.
    }, // Close properties for fullName.
    email: { // Specify properties for the unique login email address.
      type: String, // The email must be stored as a string.
      required: true, // This is a mandatory field.
      unique: true // Ensure that no two user accounts can share the same email address.
    }, // Close properties for email.
    password: { // Specify properties for the user hashed secure password.
      type: String, // The password must be stored as a string.
      required: true // This is a mandatory field.
    }, // Close properties for password.
    role: { // Specify properties for the user permission access role in the system.
      type: String, // The role must be stored as a string.
      required: true, // This is a mandatory field.
      enum: ['student', 'hr', 'supervisor_fo', 'supervisor_hk', 'supervisor_kt', 'supervisor_fb'] // Limit role to these exact allowed values.
    }, // Close properties for role.
    profilePhoto: { // Specify properties for the user's avatar.
      type: String,
      required: false
    },
    photoLocked: { // Specify whether the profile photo is locked - when true the profile photo cannot be changed until the user unlocks it.
      type: Boolean, // Boolean value true means locked, false means unlocked.
      default: false // Default to unlocked when user is created so they can upload their first photo.
    }, // Close properties for photoLocked.
    notifications: { // Specify notification preferences object to store user's toggle settings for various alerts.
      type: { // Define nested object structure with individual boolean fields for each notification type.
        emailNotifications: { type: Boolean, default: true }, // Toggle for receiving email notifications for important updates.
        messageAlerts: { type: Boolean, default: true }, // Toggle for getting notified when receiving a new message.
        applicationAlerts: { type: Boolean, default: true }, // Toggle for getting notified when application status changes - shown only for student role.
        newApplicationAlerts: { type: Boolean, default: true }, // Toggle for getting notified when a new student applies - shown only for hr role.
        scoreAlerts: { type: Boolean, default: true } // Toggle for getting notified when supervisors submit scores - shown only for hr role.
      }, // Close nested object type definition.
      default: {} // Initialize as empty object which will be populated with default true values from nested schema.
    } // Close properties for notifications.
  }, // Close the fields list object.
  { // Open schema options object.
    timestamps: true // Instruct mongoose to automatically handle and record createdAt and updatedAt date fields.
  } // Close schema options object.
); // Close mongoose Schema constructor.
const User = mongoose.model('User', userSchema); // Compile User schema into a Mongoose database model.
module.exports = User; // Export User model so it can be used for database query operations in other files.
