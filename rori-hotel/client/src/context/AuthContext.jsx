// This file implements the global React Authentication Context for the Rori Hotel Internship System.
// It securely manages the user login session parameters, reads localStorage cache, and exports helper logins state utilities.

import React, { createContext, useContext, useState, useEffect } from 'react'; // Import standard state hooks and context methods from the react library.

// Create the core AuthContext structure which stores standard user details, login triggers, and logout routines.
export const AuthContext = createContext(null); // Initialize context placeholder bound with default null properties.

// Build the AuthProvider high level state component that receives HTML children as a prop to hydrate subviews with logins parameters.
export const AuthProvider = ({ children }) => { // Initiate AuthProvider function component definition.
  // Declare the standard react user state variable by checking localStorage synchronously to prevent initial null state redirects.
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('roriToken'); // Load the saved JWT token from disk.
      const userData = localStorage.getItem('roriUser'); // Load user details cache.
      if (token && userData) {
        return JSON.parse(userData);
      }
    } catch (err) {
      console.error('Failed to parse cached user data:', err);
    }
    return null;
  }); // Bind user variables state hook accessor methods.

  // Declare login controller function accepting token and user profile payloads to persist running sessions.
  const login = (token, userData) => { // Setup login function parameters.
    // Write the authentication token string into localStorage under the predefined roriToken key.
    localStorage.setItem('roriToken', token); // Save authorization token directly on disk.
    // Transform user details object into a JSON text string and save it inside roriUser key.
    localStorage.setItem('roriUser', JSON.stringify(userData)); // Save user descriptors profile on disk.
    // Update the reactive user profile credentials state directly to trigger UI re-renders across views.
    setUser(userData); // Hydrate login values state.
  }; // End login session constructor.

  // Declare update user function to dynamically refresh profile details like photos or names
  const updateUser = (updatedUserData) => {
    localStorage.setItem('roriUser', JSON.stringify(updatedUserData));
    setUser(updatedUserData);
  };

  // Declare logout controller function to terminate active browser session scopes safely.
  const logout = () => { // Setup logout function parameters.
    // Wipe out all browser localStorage keys completely to dump all transient authentication records.
    localStorage.clear(); // Execute storage clear interface procedures.
    // Re-initialize active user reactive session states back to pristine empty null values.
    setUser(null); // Reset user state.
  }; // End logout session destructor.

  // Render original subview children inside our reactive Context Provider carrying current credentials.
  return ( // Dispatch components renderer.
    <AuthContext.Provider value={{ user, login, logout, updateUser }}> { /* Bind active states and handlers to context channel */ }
      {children} { /* Load nested dynamic layouts safely inside the auth provider container wrap */ }
    </AuthContext.Provider> // Stop Context Provider wrapper propagation.
  ); // Close elements layout.
}; // Close AuthProvider code block.

// Build custom React hook useAuth of the Context to easily inject authentication state into subcomponents.
export const useAuth = () => { // Initialize hook constructor function.
  // Retrieve current active auth context data using standard useContext hook utility methods.
  return useContext(AuthContext); // Return the derived useAuth connection details for the calling module.
}; // End hook utility builder.
