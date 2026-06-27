// This file defines the database schema storing unique QR code scan validation tokens for each department.
const mongoose = require('mongoose'); // Import Mongoose library to create the database schema.
const qrTokenSchema = new mongoose.Schema( // Begin schema mapping instantiation for department validation tokens.
  { // List properties.
    department: { // Store designated department identifier name.
      type: String, // Hold department name as a text string.
      required: true, // Department value input is required.
      unique: true // Prevent duplicate token declarations for identical departments.
    }, // Close department options.
    token: { // Unique UUID values associated with physical QR prints.
      type: String, // String value representing standard UUID format parameters.
      required: true, // Token tracking value input is mandatory.
      unique: true // Guarantee token uniqueness boundary limits across clusters.
    } // Close token option block.
  } // Close schema properties.
); // Close QR mapping constructor without including timestamps options.
const QRToken = mongoose.model('QRToken', qrTokenSchema); // Compile QR model instance.
module.exports = QRToken; // Export completed schema for routing and verification logic.
