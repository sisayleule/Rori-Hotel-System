// This is the main Javascript entry point file for our Vite frontend application.
// It retrieves the root DOM node and mounts our React App component cleanly inside it.

import React from 'react'; // Import React key utilities.
import ReactDOM from 'react-dom/client'; // Import React client DOM renderer packages to mount components.
import App from './App'; // Import our main App component containing routes and authentication state context.
import './index.css'; // Import the main global stylesheet including Tailwind and typography configurations.

// Query the browser page to resolve the target container DIV element possessing the unique ID identifier "root".
const targetRootElement = document.getElementById('root'); // Create memory bind reference to root mount point.

// Initialize the React DOM virtual engine instance mapping target HTML browser mount coordinates.
const initializedRootNode = ReactDOM.createRoot(targetRootElement); // Setup react document mount.

// Trigger elements output stream rendering inside StrictMode boundaries for deep runtime diagnostics checking.
initializedRootNode.render( // Fire system renderer process.
  <React.StrictMode> { /* Wrap UI inside strict diagnostics check cycles */ }
    <App /> { /* Mount App layout */ }
  </React.StrictMode> // Terminate debug strict boundaries.
); // Close execution instructions scope.
