// This file defines the Mongoose database schema used to store all inbox chat communication messages between students and HR.
const mongoose = require('mongoose'); // Require the mongoose library to create the database schema.
const messageSchema = new mongoose.Schema( // Construct a new mongoose Schema representation for database records.
  { // Open fields declaration block.
    senderId: { // Identify the author user entity properties.
      type: mongoose.Schema.Types.ObjectId, // Save as unique database identifier type.
      ref: 'User', // Refer to the user accounts collection.
      required: true // Author key is always mandatory for every message.
    }, // Close senderId definition.
    receiverId: { // Identify the recipient user entity properties.
      type: mongoose.Schema.Types.ObjectId, // Save as unique database identifier type.
      ref: 'User', // Connect securely to user accounts collection.
      required: true // Recipient key is always mandatory to dispatch messages correctly.
    }, // Close receiverId definition.
    applicationId: { // Identify parent application context properties.
      type: mongoose.Schema.Types.ObjectId, // Map relation back to the target internship profile if applicable.
      ref: 'Student' // Reference registered student records database collection.
    }, // Close applicationId definition.
    body: { // Define options for actual textual transmission.
      type: String, // Hold message texts as string structures.
      required: true // Disallow empty text characters to prevent empty chat logs.
    }, // Close body string properties.
    isRead: { // Define message read tracking options.
      type: Boolean, // Boolean flag variable representing read/unread status.
      default: false // Set base value state to unread upon creation.
    } // Close isRead field properties.
  }, // Close root fields dictionary.
  { // Begin system configuration options block.
    timestamps: true // Track accurate time instances for message delivery and inbox sorting.
  } // End options configuration.
); // Close schema function execution.
const Message = mongoose.model('Message', messageSchema); // Create schema collection interface.
module.exports = Message; // Export message interface module for message endpoints.
