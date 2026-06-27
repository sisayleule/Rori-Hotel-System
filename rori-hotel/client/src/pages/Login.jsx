// This file implements the real Login page which allows all 6 users roles to sign in to the platform.
// This page manages local fields state, interacts with AuthContext to sign in sessions, and redirects users to dashboards.
import React, { useState } from 'react'; // Import state management hooks from the core React package library.
import { useNavigate, Link } from 'react-router-dom'; // Import router navigation utilities to execute URL path transition redirects.
import { useAuth } from '../context/AuthContext'; // Import custom Auth Context hooks to access the session login updater controller.
import api from '../utils/api'; // Import our preconfigured Axios networking client to process transactional backend requests.
const Login = () => { // Construct the main stateless functional component declaration for the Login page view.
  const [email, setEmail] = useState(''); // Initialize reactive react state string container to hold the typed email address value.
  const [password, setPassword] = useState(''); // Initialize reactive react state string container to keep the typed password descriptor.
  const [loading, setLoading] = useState(false); // Initialize numeric boolean state to monitor and control backend transactional load cycles.
  const [error, setError] = useState(''); // Initialize diagnostic state string variable to cache server error codes or warning messages.
  const { login } = useAuth(); // Extract global Auth Context login modifier routine to serialize user caching metrics.
  const navigate = useNavigate(); // Store the active react-router navigation transition callback pointer locally.
  const handleSubmit = async (event) => { // Setup form submission delegate callback triggered upon click activities.
    event.preventDefault(); // Stop default browser form refresh triggers to prevent structural page breakdowns.
    setLoading(true); // Fire up the waiting state variable by mapping loading to boolean true flags.
    setError(''); // Clear any stale residual error logs cached inside the reactive state.
    try { // Deploy defensive try catch wrapper block to intercept remote network transaction issues.
      const response = await api.post('/auth/login', { email, password }); // Dispatch secure axios POST transfer protocol to login endpoints.
      const data = response.data; // Retrieve database query execution outputs from Axios transmission packages.
      // Pass ALL user fields to login function including photoLocked and notifications for Settings feature support.
      login(data.token, { 
        id: data.userId, // User unique identifier.
        role: data.role, // User permission role.
        fullName: data.fullName, // User display name.
        email: data.email, // User email address.
        profilePhoto: data.profilePhoto, // User profile photo URL.
        photoLocked: data.photoLocked, // Photo lock status for Settings.
        notifications: data.notifications, // Notification preferences for Settings.
        createdAt: data.createdAt // Account creation date for Settings display.
      }); // Persist session profiles locally by running Context login handlers with complete user data.
      if (data.role === 'student') { // Match role properties to detect incoming student intern credentials.
        navigate('/student/dashboard'); // Shift router context paths over to the secure student workspace dashboard.
      } else if (data.role === 'hr') { // Match role properties to pinpoint Human Resources corporate staff logins.
        navigate('/hr/dashboard'); // Shift router context address paths over to HR operations central dashboards.
      } else if (data.role && data.role.includes('supervisor')) { // Evaluate general string search matching for supervisor personnel roles.
        navigate('/supervisor/dashboard'); // Relocate supervisor session paths cleanly to departmental cockpit portals.
      } // Terminate identity checking conditional route redirects structures.
    } catch (err) { // Capture and bind active transaction issues or credentials exceptions.
      const message = err.response && err.response.data && (err.response.data.message || err.response.data.error) ? (err.response.data.message || err.response.data.error) : 'login failed please try again'; // Pick available server message parameters or trigger default fallbacks.
      setError(message); // Supply custom informative warnings output into our local screen error states.
    } finally { // Run structural cleanup scripts irrespective of operational errors occurrence.
      setLoading(false); // Switch off active loading indicator toggles to draw interactive form inputs.
    } // Terminate overall defensive validation transaction blocks.
  }; // Complete async login submission callback definitions.
  return ( // Return the primary styled visual markup tags code blocks.
    <div className="min-h-screen bg-warm-beige flex items-center justify-center p-6 font-sans"> { /* Main layout container offering full screen layout */ }
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center border border-gray-100 flex flex-col items-center justify-center"> { /* White background floating card wrapper */ }
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOV-RLrXND8-FBpTC0iS97VkHPjm_Kjj5zuD2wcyXwyw&s=10" 
          alt="Rori Hotel Logo" 
          className="w-16 h-16 object-contain rounded-full border border-gold/30 p-1 mb-4 shadow-sm" 
          referrerPolicy="no-referrer"
        />
        <h1 className="text-3xl font-bold text-charcoal mb-2 font-serif">Rori Hotel</h1> { /* Large hotel branding typography header */ }
        <div className="text-xs font-semibold text-gold tracking-widest uppercase mb-4">Internship Portal</div> { /* Gold-tinted tracked utility subtitle tag */ }
        <div className="w-16 h-1 bg-gold mx-auto mb-6 rounded-full"></div> { /* Elegant golden horizontal separator rules vector decoration */ }
        {error && ( // Perform reactive evaluation checks against current inner error state logs.
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4 border border-red-100 text-left"> { /* Error alert visual notification boxes */ }
            {error} { /* Render current error text string dynamically */ }
          </div> // Close error alert container boxes.
        )} { /* Terminate error notification state block checks */ }
        <form onSubmit={handleSubmit} className="w-full text-left space-y-4"> { /* Start core interactive inputs parameters registry fields */ }
          <div> { /* Form field wrapper block container */ }
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">Email Address</label> { /* Form input label for email values */ }
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all" placeholder="Enter your email address" /> { /* Input field taking dynamic keyboard interactions */ }
          </div> { /* End input field wrapper block container */ }
          <div> { /* Form field password wrap block container */ }
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">Password</label> { /* Form input label for passwords values */ }
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all" placeholder="Enter your system password" /> { /* Security masked input field capturing key credentials */ }
          </div> { /* End form field password wrap block container */ }
          <button type="submit" disabled={loading} className="w-full bg-gold hover:bg-gold-light text-charcoal font-bold uppercase tracking-widest text-xs py-3 px-4 rounded transition-colors duration-300 shadow disabled:opacity-50 mt-2 cursor-pointer"> { /* Submit transaction processing execution button interface triggers */ }
            {loading ? 'Signing in...' : 'Sign In'} { /* Switch display texts depending on current active network execution states */ }
          </button> { /* End form submittals actionable button toggler indicators */ }
        </form> { /* Terminate form parameters boundaries controls */ }
        <div className="w-full mt-6 pt-6 border-t border-gray-100 text-xs space-y-2"> { /* Footnotes navigation shortcuts layout container block */ }
          <div className="text-charcoal-light">Don't have an account? <Link to="/register" className="text-gold font-bold hover:underline transition-all">Register here</Link></div> { /* Shortcut link redirecting to Register views */ }
          <div className="text-charcoal-light"><Link to="/" className="text-charcoal hover:text-gold font-medium transition-all hover:underline">Back to Home</Link></div> { /* Navigational anchor redirecting back to main Home Landing dashboard */ }
        </div> { /* Close core footnotes wrapper layouts tags */ }
      </div> { /* Close floating card container boxes tag elements */ }
    </div> // Close overall screen flex alignment layouts wrappers.
  ); // Terminate JSX renderer dispatch code block routines.
}; // Terminate Login functional component definitions.
export default Login; // Export our custom programmed Login component as the default export of this module.
