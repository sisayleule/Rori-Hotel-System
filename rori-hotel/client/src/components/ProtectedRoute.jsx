// This component acts as a security route guard wrapper for React Router.
// It verifies whether a user is authenticated and possesses the required role privilege before serving private dashboards.

import React from 'react'; // Import React helper features.
import { useAuth } from '../context/AuthContext'; // Import custom useAuth hook to read the global authentication state credentials.
import { Navigate } from 'react-router-dom'; // Import standard Navigate route relocator component from react-router-dom.

// Declare the ProtectedRoute component. Accept the subview children layout and allowedRoles permissions array.
const ProtectedRoute = ({ children, allowedRoles }) => { // Initiate ProtectedRoute component arguments parser.
  // Retrieve current active user profile metrics using our custom useAuth context hook.
  const { user } = useAuth(); // Destruct session user object values.

  // To prevent React async state batching/propagation delays immediately after login,
  // we check localStorage as an absolute synchronous source of truth fallback.
  let currentUser = user;
  if (!currentUser) {
    try {
      const storedUser = localStorage.getItem('roriUser');
      const storedToken = localStorage.getItem('roriToken');
      if (storedUser && storedToken) {
        currentUser = JSON.parse(storedUser);
      }
    } catch (err) {
      console.error('Failed to parse user session in route protection fallback:', err);
    }
  }

  // Check if there is no logged-in user at all.
  if (!currentUser) { // If user context yields null or undefined checks.
    // Relocate the unauthenticated request back to the secure /login sign-in page interface.
    return <Navigate to="/login" replace />; // Trigger redirect using Replace option.
  } // Terminate identity authentication checkpoint.

  // Check if the authenticated user's role is not included in the allowedRoles array block.
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) { // Compare permissions.
    // Relocate the authenticated but unauthorized request over to the standard /unauthorized warning page.
    return <Navigate to="/unauthorized" replace />; // Trigger redirect to permission warnings.
  } // Terminate role authorization checkpoint.

  // Render the requested core page layout cleanly if all security parameters successfully validate.
  return children; // Deliver nested children layouts output.
}; // End ProtectedRoute functional block definition.

// Export the ProtectedRoute helper as default module.
export default ProtectedRoute; // Publish guard.
