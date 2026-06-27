// This file handles routing for HR retrieving department QR tokens to display and print. Only HR can access these.
const express = require('express'); // Import express framework module to initialize routing middleware.
const router = express.Router(); // Create a new express Router constructor instance.
const { protect } = require('../middleware/authMiddleware'); // Import protect helper to require active auth tokens.
const { requireRole } = require('../middleware/roleMiddleware'); // Import requireRole helper to enforce privilege restrictions.
const QRToken = require('../models/QRToken'); // Import QRToken database model to query department unique tokens.
// Create a GET route at path / using protect and requireRole with hr.
router.get('/', protect, requireRole('hr'), async (req, res) => { // Setup GET / path with permissions controls.
  try { // Start safety try-catch block wrapper.
    const tokens = await QRToken.find({}); // Find all QRToken documents inside the MongoDB collection.
    return res.status(200).json(tokens); // Return 200 with the tokens array.
  } catch (err) { // Trap retrieval exceptions.
    console.error('Error fetching department QR tokens:', err); // Log diagnostic tracers.
    return res.status(500).json({ message: 'could not retrieve QR codes' }); // Return status 500 error code.
  } // Terminate try-catch block.
}); // Close GET / route path coordinates wrapper.
module.exports = router; // Export router database configurations list.
