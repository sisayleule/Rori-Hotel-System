// This file defines the Mongoose database schema for storing user notifications triggered by important system events and actions.
// Notifications appear in the bell icon dropdown and help users stay informed about messages, approvals, scores, and other updates.
const mongoose = require('mongoose'); // Import mongoose library to create schema structure and model definitions.

// Create the notification schema defining the structure of notification documents stored in the database.
const notificationSchema = new mongoose.Schema(
  { // Open schema fields definition object.
    userId: { // Define the user who receives and owns this notification document.
      type: mongoose.Schema.Types.ObjectId, // Store as MongoDB ObjectId reference type for efficient lookups.
      ref: 'User', // Reference points to the User model collection to link notifications to user accounts.
      required: true // This field is mandatory because every notification must belong to a specific user.
    }, // Close userId field definition.
    title: { // Define the short heading text shown at the top of the notification card.
      type: String, // Store as text string value for the notification headline.
      required: true // This field is mandatory to provide a clear notification subject.
    }, // Close title field definition.
    message: { // Define the full descriptive text explaining what happened and why the user received this notification.
      type: String, // Store as text string value for detailed notification content.
      required: true // This field is mandatory to provide complete notification information.
    }, // Close message field definition.
    type: { // Define the notification category used to display appropriate icons and styling.
      type: String, // Store as text string representing the notification category.
      required: true, // This field is mandatory to categorize notifications properly.
      enum: ['message', 'application', 'approval', 'rejection', 'score', 'result', 'feedback', 'attendance'] // Restrict to these exact notification types.
    }, // Close type field definition.
    isRead: { // Define boolean flag tracking whether the user has viewed this notification.
      type: Boolean, // Store as true or false value.
      default: false // New notifications start as unread automatically.
    }, // Close isRead field definition.
    link: { // Define the URL path to navigate to when the user clicks this notification.
      type: String // Store as text string representing the internal application route path.
      // This field is optional because some notifications may not have a specific destination link.
    }, // Close link field definition.
    createdAt: { // Define the timestamp recording when this notification was created.
      type: Date, // Store as Date object for proper time-based sorting and filtering.
      default: Date.now // Automatically set to current server time when notification is created.
    } // Close createdAt field definition.
  }, // Close schema fields object.
  { // Open schema options configuration object.
    timestamps: false // Disable automatic Mongoose timestamps because we manually handle createdAt field.
  } // Close schema options object.
); // Close schema constructor call.

// Compile the notification schema into a Mongoose model for database operations.
const Notification = mongoose.model('Notification', notificationSchema); // Create model named Notification.

// Export the Notification model so it can be imported and used in routes and services.
module.exports = Notification; // Make Notification model available to other files.
