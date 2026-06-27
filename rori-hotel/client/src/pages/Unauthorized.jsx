// This file represents the Unauthorized Access restriction page page view component.

import React from 'react'; // Import the default React library to construct functional components.

const Unauthorized = () => { // Begin functional component declaration for Unauthorized Page.
  return ( // Start returning JSX markup structure.
    <div className="min-h-screen bg-warm-beige flex items-center justify-center p-6"> { /* Container holding content centered with responsive padding styles */ }
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center"> { /* Outer card container */ }
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1> { /* Title heading */ }
        <p className="text-charcoal-light mb-6">Unauthorized Page - You do not have permissions to access this screen</p> { /* Description paragraph */ }
      </div> { /* Close card block */ }
    </div> // Close parent center layout container.
  ); // Close elements layout.
}; // Close Unauthorized functional component scope.

export default Unauthorized; // Export Unauthorized component default.
