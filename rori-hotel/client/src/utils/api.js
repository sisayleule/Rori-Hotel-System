// This file defines the global Axios API instance used for networking queries on the Rori Hotel platform.
// It configures base backend URLs and automatically appends authorization bearer tokens to every request header.

import axios from 'axios'; // Import the axios library dependency to initiate HTTP requests.

export const getApiBaseUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Instantiate a custom Axios instance configured with target base URLs matching endpoints environments.
const api = axios.create({ // Call the axios.create factory mapping options.
  // Set baseURL to backend server on port 5000 not frontend port 3000 - this points to the Express API server.
  baseURL: getApiBaseUrl() // Backend API server URL with fallback.
}); // Close Axios instance constructor.

// Append a request interceptor to query localStorage and dynamically attach active JWT credentials headers.
api.interceptors.request.use( // Initiate request interceptors registration.
  // Process outgoing request configuration parameters before they leave client applications.
  (configObject) => { // Define configuration mapping callback.
    // Query local browser storage requesting stored security validation roriToken strings.
    const activeTokenValue = localStorage.getItem('roriToken'); // Load saved user JWT on memory variable.
    // Check if a valid authorization token exists inside browser storage.
    if (activeTokenValue) { // Execute presence validation conditional check.
      // Append matching Authorization bearer header property directly to the outgoing request object.
      configObject.headers.Authorization = `Bearer ${activeTokenValue}`; // Format signature code.
    } // End verification conditional block.
    // Dispatch the updated outgoing request configurations to perform backend API connections.
    return configObject; // Return final configure map object.
  }, // Close request fulfillment callback.
  // Handle any potential connection issues or pre-request exceptions occurring on client setups.
  (interceptorError) => { // Setup error handling block.
    // Forward the captured pre-request connection error state to the calling module.
    return Promise.reject(interceptorError); // Reject promise payload.
  } // Terminate interceptor error mapping.
); // Close request interceptors chain configuration.

// Append a response interceptor to catch any 401 Unauthorized exceptions returned by backend servers.
api.interceptors.response.use( // Initiate response interceptors chain setup.
  // Pass standard successful server responses straight through to the query call site.
  (successResponseObject) => { // Declare fulfillment handler function.
    // Retain and return response parameters completely unmodified.
    return successResponseObject; // Return successful raw results.
  }, // Close fulfillment callback handler.
  // Intercept and evaluate transaction failures such as expired credentials.
  (networkErrorObject) => { // Declare error handler structure.
    // Inspect whether HTTP error status code matches authorization 401 exceptions.
    if (networkErrorObject.response && networkErrorObject.response.status === 401) { // Check unauthorized status.
      // If the request was to the login endpoint, let the component handle the error directly.
      const requestUrl = networkErrorObject.config?.url || '';
      if (requestUrl.includes('/auth/login')) {
        return Promise.reject(networkErrorObject);
      }

      // Clear only Rori auth cache instead of wiping unrelated browser storage.
      localStorage.removeItem('roriToken'); // Remove expired JWT from disk.
      localStorage.removeItem('roriUser'); // Remove cached user profile from disk.
      // Force immediate relocation redirects to standard sign-in index page.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'; // Shift browser location window pointers.
      }
      // Return a pending promise to prevent downstream code from executing and producing console errors.
      return new Promise(() => {});
    } // End specific security check blocks.
    // Return standard rejected Promise payloads carrying network error logs descriptor values.
    return Promise.reject(networkErrorObject); // Terminate transaction.
  } // Terminate response error interceptor.
); // Close response interceptors registration.

// Export the configured api axios instance module to perform uniform network client calls easily.
export default api; // Deliver api objects package.
