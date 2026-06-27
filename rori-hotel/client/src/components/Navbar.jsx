// At the top add a comment block explaining what this component does. It is a navigation bar that sits at the top of every public page. It has a beautiful dark-luxury translucent look that matures into a gold-bordered header when the user scrolls down.
// This is the Navbar component for the Rori Hotel Internship Management Portals.
import React, { useState, useEffect } from 'react'; // Import state hooks and effect hooks from the default React library modules.
import { Link, useNavigate } from 'react-router-dom'; // Import Link routing components and useNavigate hooks from react-router-dom packages.
import { useAuth } from '../context/AuthContext'; // Import custom useAuth hooks from client context files to fetch currently authenticated user metrics.
import { Menu, X } from 'lucide-react'; // Import essential icons for mobile menu navigation toggle.

// Create a functional component called Navbar representing the main sticky navigations header elements.
const Navbar = () => { // Construct the Navbar functional component code block.
  // Contact details modal open state
  const [isContactOpen, setIsContactOpen] = useState(false);
  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Inside the component create a state variable called scrolled with initial value false. Add a comment explaining this tracks whether the user has scrolled down the page.
  const [scrolled, setScrolled] = useState(false); // Declare scrolled boolean state hooks tracking whether scroll position exceeds 50px offset thresholds.
  // Get the user from useAuth. Add a comment explaining this checks if someone is already logged in.
  const { user } = useAuth(); // Parse current active user profiles information from the custom authentication hooks channel.
  // Get navigate capability from routing controllers to programmatically direct the user.
  const navigate = useNavigate(); // Resolve navigate subroutine function from React Router packages.

  // Helper handling programmatic scroll or navigation to contact footer
  const handleContactClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Close mobile drawer if active
    
    const footerElement = document.getElementById('footer');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('footer');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  // Add a useEffect that runs once when the component mounts. Inside this useEffect add a scroll event listener to the window. Inside the event listener check if window.scrollY is greater than 50. If it is set scrolled to true. If it is not set scrolled to false. Return a cleanup function that removes the scroll event listener when the component unmounts. Add a comment on every single line inside this useEffect.
  useEffect(() => { // Mount useEffect hook targeting window events.
    const handleWindowScroll = () => { // Initialize user scrolling window listener subroutines.
      if (window.scrollY > 50) { // Check if window scroll distance along y-axis is greater than 50 pixels boundaries.
        setScrolled(true); // Alter scrolled boolean flag state parameters to true values.
      } else { // Handle cases when scroll offsets parameters are low.
        setScrolled(false); // Reset scrolled boolean flag state parameters back to false values.
      } // Complete scroll distance validation block.
    }; // Complete handleWindowScroll event listener callback.
    window.addEventListener('scroll', handleWindowScroll); // Register scroll event listeners targeting custom window scroll callbacks.
    return () => { // Formulate the hook cleaning function returning to unsubscribe window scroll listeners.
      window.removeEventListener('scroll', handleWindowScroll); // Detach registered handleWindowScroll callback listener safely.
    }; // Complete hook clean closures.
  }, []); // Pass an empty list array ensuring this hook executes exactly once during mounts frames.

  // Helper handling programmatic dashboard route matching and routing shifts.
  const handleDashboardRedirection = () => { // Setup helper function for dashboard routing redirections.
    if (!user) { // Check if user profiles data variables are completely missing.
      return; // Stop function execution from running further.
    } // Complete active user presence validations check templates.
    const userRoleValue = user.role ? user.role.toLowerCase() : ''; // Safely convert role key values to lowercase text formats.
    if (userRoleValue === 'hr') { // Inspect if parsed credentials matches human resources department levels.
      navigate('/hr/dashboard'); // Travel to human resources panel path.
    } else if (userRoleValue.includes('supervisor')) { // Check if role values include department supervisors labels.
      navigate('/supervisor/dashboard'); // Travel to supervisor panel path.
    } else { // Formulate fallback redirection routes for general system visitors.
      navigate('/student/dashboard'); // Travel to normal intern student placement panels dashboard paths.
    } // Terminate role check redirection branches.
  }; // Finalize dashboard redirect router helper modules.

  // Now build the JSX. Add a comment above every JSX section.
  return ( // Enter JSX rendering process returning code layouts blocks.
    <>
      {/* SECTION: Sticky Outer Navigation Wrapper Tag Frame. */}
      {/* The outer element is a nav tag. It is styled with an ultra-polished black-luxury background, matching our high-comfort master aesthetic. */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#12110e]/95 backdrop-blur-md border-b border-gold/30 shadow-2xl py-1.5' : 'bg-[#12110e]/50 backdrop-blur-xs py-2.5 border-b border-white/5'}`}> {/* Set up floating sticky nav containers with scroll-dependent background and padding classes */}
        {/* SECTION: Centered Inner Flex Layout Boundary Box */}
        {/* Inside the nav create an inner div with maximum width of 1200 pixels, auto horizontal margins, padding left and right of 24 pixels, height of 70 pixels, display flex, items centered, and space between for horizontal layout. */}
        <div className="max-w-[1200px] mx-auto px-6 h-[52px] flex items-center justify-between font-sans"> {/* Align branding nodes and route actions elements horizontally inside spacing boxes */}
          {/* SECTION: Left Branding Section Link Panel */}
          {/* On the left side of the nav create a Link that points to the home path /. Inside the Link show the logo image and the text Rori Hotel in Playfair Display font. Below the hotel name show the text Hawassa · Ethiopia in very small uppercase gold letters. Add a comment explaining this is the brand section. */}
          <Link to="/" className="flex items-center gap-3 select-none"> {/* Establish standard redirection links back to Home with custom logos */}
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOV-RLrXND8-FBpTC0iS97VkHPjm_Kjj5zuD2wcyXwyw&s=10" 
              alt="Rori Hotel Logo" 
              className="w-10 h-10 object-contain rounded-full border border-gold/40 bg-[#141414]" 
              referrerPolicy="no-referrer" 
            />
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold tracking-widest font-serif text-white">Rori Hotel</span> {/* Render hotel names with scroll adaptive contrast text colors */}
              <span className="text-[9px] font-bold text-gold tracking-[0.25em] uppercase mt-0.5">Hawassa · Ethiopia</span> {/* Subtitle indicating properties location coordinates */}
            </div>
          </Link> {/* Terminate outer branding Link element wrappers */}

          {/* SECTION: Right User Sign-in Actions Navigations Menu */}
          {/* On the right side create a div with flex display and a gap between items. */}
          <div className="flex items-center gap-4 sm:gap-6"> {/* Encompass standard controls panels within custom grid spacings layouts */}
            
            {/* Main Center-Right Nav Options: Home, QR Attendance, Contacts */}
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/" className="text-white/80 hover:text-gold text-xs font-bold uppercase tracking-widest transition-all duration-300">
                Home
              </Link>
              <Link to="/attend" className="text-white/80 hover:text-gold text-xs font-bold uppercase tracking-widest transition-all duration-300">
                QR Attendance
              </Link>
              <button 
                onClick={handleContactClick}
                className="text-white/80 hover:text-gold text-xs font-bold uppercase tracking-widest transition-all duration-300 bg-transparent border-none cursor-pointer"
              >
                Contacts
              </button>
            </div>

            <div className="w-[1px] h-5 bg-white/10 hidden lg:block"></div>

            {/* SECTION: User Session Conditional Dashboards Verification Button Links */}
            {user ? ( // Evaluate user presence dynamically using standard ternary conditional codes blocks.
              <button // Render interactive buttons enabling dashboard jumps.
                onClick={handleDashboardRedirection} // Hook button clicks events to help travel user back to role panels.
                className="bg-gold hover:bg-gold-light text-charcoal text-xs font-bold uppercase tracking-widest px-4 py-2 rounded shadow-md shadow-gold/10 transition-all duration-300 transform hover:-translate-y-0.5" // Formulate premium gold background visual structures.
              > {/* Open buttons wrappers tag elements */}
                Go to Dashboard {/* Declare active label text representing panel paths */}
              </button> // Finish interactive redirection buttons markings.
            ) : ( // Branch execution path to handle unauthorized user state visualizations.
              // SECTION: Anonymous Guest Actions Shortcut Elements
              // If user does not exist meaning nobody is logged in show two elements. The first is a Link to /login showing the text Login. If scrolled is true make this text charcoal. If scrolled is false make it white. The second is a Link to /register showing the text Apply Now styled as a gold background button with charcoal text. Add a comment explaining each element.
              <div className="flex items-center gap-4"> {/* Instantiate standard wrapper nodes grouping auth links */}
                {/* Element 1: Login Shortcut Link */}
                <Link // Generate router navigation links referencing secure login forms.
                  to="/login" // Route requests to the secure /login path.
                  className="text-white/80 hover:text-gold text-xs font-bold uppercase tracking-widest transition-colors duration-300" // Apply adaptive text foreground structures on logins navigation links.
                > {/* Open login route elements handles */}
                  Login {/* Label string specifying logins portal paths */}
                </Link> {/* Conclude interactive login links nodes */}
                {/* Element 2: Apply Now Shortcut Link */}
                <Link // Configure primary internship application submission anchors.
                  to="/register" // Route new trainees requests to the registration panels.
                  className="bg-gold hover:bg-gold-light text-charcoal text-xs font-bold uppercase tracking-widest px-3 sm:px-4 py-2 rounded shadow-md shadow-gold/10 transition-all duration-300 transform hover:-translate-y-0.5" // Build elegant action trigger themes.
                > {/* Expand apply portals buttons anchors tags */}
                  Apply Now {/* Signify visual actionable directions labels for new users */}
                </Link> {/* Terminate registrations triggers element panels */}
              </div> // Finish empty HTML layout markers blocks.
            )} {/* End conditional ternary auth statements */}

            {/* Hamburger Button for Mobile Devices */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white/80 hover:text-gold focus:outline-none p-1.5 transition-colors duration-300"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div> {/* Finish list boundaries wrappers of right alignment navigation menus */}
        </div> {/* Terminate grid layout flex containers */}

        {/* SECTION: Mobile Dropdown navigation menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-[52px] left-0 w-full bg-[#12110e]/98 backdrop-blur-xl border-b border-gold/30 shadow-2xl z-40 lg:hidden animate-fade-in py-5 px-6 flex flex-col space-y-3.5 font-sans text-left">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-white/90 hover:text-gold text-xs font-bold uppercase tracking-widest transition-colors duration-300 py-1.5 border-b border-white/5"
            >
              Home
            </Link>
            <Link 
              to="/attend" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-white/90 hover:text-gold text-xs font-bold uppercase tracking-widest transition-colors duration-300 py-1.5 border-b border-white/5"
            >
              QR Attendance
            </Link>
            <button 
              onClick={handleContactClick} 
              className="text-white/90 hover:text-gold text-xs font-bold uppercase tracking-widest text-left transition-colors duration-300 py-1.5 border-b border-white/5 bg-transparent border-none cursor-pointer w-full"
            >
              Contacts
            </button>
          </div>
        )}
      </nav> {/* Close sticking main navigation menu wrapper tags. */}

      {/* SECTION: Contacts Modal popup */}
      {isContactOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsContactOpen(false)}
          ></div>
          
          {/* Modal Container */}
          <div className="relative bg-[#161412] border border-gold/40 max-w-md w-full rounded-2xl p-8 shadow-2xl z-20 text-white text-left animate-revealed">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-gold/20 pb-4">
              <h3 className="text-xl font-bold font-serif text-gold-light tracking-wide">Liaison & Support</h3>
              <button 
                onClick={() => setIsContactOpen(false)}
                className="text-white/60 hover:text-white transition-colors duration-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="space-y-5 text-sm text-white/80">
              <p className="leading-relaxed">
                For questions regarding student placements, HR policy, and trainee shift coordinates, contact our hospitality apprentice desk.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-gold text-base">📍</span>
                  <div>
                    <strong className="block text-white text-xs uppercase tracking-wider mb-0.5">Hotel Address</strong>
                    <span className="text-xs text-white/70">Hawassa Lake Road, Hawassa, Sidama Region, Ethiopia</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-gold text-base">📞</span>
                  <div>
                    <strong className="block text-white text-xs uppercase tracking-wider mb-0.5">Telephone Desk</strong>
                    <span className="text-xs text-white/70">+251 462 214 343 / +251 462 121 212</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-gold text-base">✉️</span>
                  <div>
                    <strong className="block text-white text-xs uppercase tracking-wider mb-0.5">Apprentice Office</strong>
                    <span className="text-xs text-white/70">apprentice@rorihotel.com / careers@rorihotel.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-gold text-base">🕒</span>
                  <div>
                    <strong className="block text-white text-xs uppercase tracking-wider mb-0.5">HR Desk Hours</strong>
                    <span className="text-xs text-white/70">Monday – Friday: 8:00 AM – 5:30 PM (EAT)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gold/10 flex justify-end">
              <button 
                onClick={() => setIsContactOpen(false)}
                className="bg-gold hover:bg-gold-light text-charcoal text-xs font-bold uppercase tracking-widest py-2.5 px-6 rounded-md transition-all duration-300"
              >
                Close Desk Info
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  ); // Return completed UI layout blocks.
}; // Complete Navbar components.

export default Navbar; // Export Navbar as the default export of this module.
