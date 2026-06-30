// This middleware file intercepts network client transactions to check and verify security JSON Web Tokens (JWT).
// It verifies that a student or staff member is logged in and authorized before granting route access.
const jwt = require('jsonwebtoken'); // Import jsonwebtoken library tool to parse and decode signature tokens.
const { getRequiredEnv } = require('../utils/env'); // Load required env helper.

// Define our standard protect authentication router interceptor middleware function.
const protect = (req, res, next) => { // Declare middleware function structure.
  // Declare a placeholder variable to safely extract our incoming validation token.
  let requestTokenString; // Temporary trace string holder.
  // Evaluate if authorization logs exist and start with proper Bearer prefixes.
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) { // Run signature parsing check.
    // Isolate token by splits operation dividing credentials on space character gaps.
    requestTokenString = req.headers.authorization.split(' ')[1]; // Extract token code key.
  } // End verification check logic.
  // Return early if authorization keys are completely missing from connection headers.
  if (!requestTokenString) { // Missing token validation evaluation.
    // Inform the client with 401 unauthorized status codes explaining missing credentials.
    return res.status(401).json({ message: "no token provided please log in" }); // Halt route middleware chain.
  } // Close missing credential handler block.
  // Process token evaluation matching using secure crypt verification loops.
  try { // Start error tracking context block.
    // Decrypt and confirm token properties validity withprocess local secret environment signature keys.
    const decodedTokenDataProperties = jwt.verify(requestTokenString, getRequiredEnv('JWT_SECRET')); // Decode payload credentials.
    // Bind token data parameters to req.user containing authenticated identification.
    req.user = decodedTokenDataProperties; // Register payload with server context arrays.
    if (req.user && req.user.userId && !req.user.id) {
      req.user.id = req.user.userId; // Normalize id for code paths expecting id.
    }
    // Call the express next function helper to resume processing route endpoint targets.
    next(); // Run next instruction.
  } catch (error) { // Trapping decryption errors context.
    // Handle specific expired token errors separately.
    if (error.name === 'TokenExpiredError') { // Target checking identifier tags.
      // Send 401 error code message explicitly indicating expired tokens session logs.
      return res.status(401).json({ message: "your session has expired please log in again" }); // Deliver response details.
    } // End specific check branch.
    // Handle standard token corruptions and forgery validation failures.
    return res.status(401).json({ message: "invalid token please log in again" }); // Deliver response details.
  } // Terminate try-catch block.
}; // End protect middleware declaration logic.

// Export the protect middleware controller object for application routing inclusion.
module.exports = { protect }; // Export protect method definition.
