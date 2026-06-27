// This file implements role-based authorization security middlewares for the Rori Hotel platform.
// It verifies that authenticated users possess the exact required privileges before accessing staff endpoints.
// There are exactly 6 possible system authorization permissions role levels:
// 1. student - Dynamic internship learner profiles
// 2. hr - Human resources administrative supervisors
// 3. supervisor_fo - Front Office department evaluators
// 4. supervisor_hk - Housekeeping department quality controls
// 5. supervisor_kt - Cooking operations supervisor accounts
// 6. supervisor_fb - F&B Service team managers

// Declare the role-based route guard constructor matching rest arguments parameters.
const requireRole = (...allowedRolesInEndpoints) => { // Setup variable arguments collection handler.
  // Return the standard signature Express middleware functional interface.
  return (req, res, next) => { // Declare req, res, next endpoints handler.
    // Ensure that preceding authentication middleware verified credentials successfully.
    if (!req.user) { // If authenticated user context does not exist.
      // Abort connection returning 401 unauthenticated code response arrays.
      return res.status(401).json({ message: "not authenticated" }); // Deliver response details.
    } // End null context checker block.
    // Compare registered users level keys on req.user against endpoints allowed keys lists.
    const isUserRoleAllowedForAction = allowedRolesInEndpoints.includes(req.user.role); // Evaluate permission conditions.
    // Block connections if matching credentials evaluation indicators are false.
    if (!isUserRoleAllowedForAction) { // Unallowed client validation blocks.
      // Deny routing access by delivering explicit 403 Forbidden permission error status code statements.
      return res.status(403).json({ message: "access denied your role does not have permission for this action" }); // Halt routing flow.
    } // End security checking conditional branch.
    // Deliver executing connection towards next matching endpoint targets.
    next(); // Run next instruction.
  }; // Close modular middleware router function.
}; // Close requireRole builder function wrapper.

// Export the requireRole guard builder module for security mapping inside route modules.
module.exports = { requireRole }; // Publish requireRole.
