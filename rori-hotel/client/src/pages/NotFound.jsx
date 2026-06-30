import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-warm-beige flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-charcoal mb-4">Page Not Found</h1>
        <p className="text-charcoal-light mb-6">
          The page you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center bg-gold hover:bg-gold-light text-charcoal text-xs font-bold uppercase tracking-widest px-5 py-3 rounded transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
