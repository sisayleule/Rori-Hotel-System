// At the top add a comment block explaining this is the sidebar navigation used inside every dashboard.
// It shows different links depending on the role of the logged in user to direct them safely.
import React from 'react'; // Import React standard engine libraries.
// Import NavLink from react-router-dom which automatically adds an active class when URL matches.
import { NavLink } from 'react-router-dom'; // Load NavLink elements from routing packages.
// Import X icon for mobile close button
import { X } from 'lucide-react'; // Load close icon.

// Create a functional component called Sidebar accepting role, user, and mobile props.
const Sidebar = ({ role, user, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  // role is the active string code representing authorization tier permission levels.
  // user is the active nested structure containing current account profiles.

  // Create a variable called navLinks with initial default value as an empty array.
  let navLinks = []; // Track link configurations lists.

  // Check if role is student to select specific student-themed links maps.
  if (role === 'student') {
    // If student, populate navLinks with standard dashboard links blocks.
    navLinks = [
      // Link 1: Redirection back toward student home profile data summaries.
      { to: '/student/dashboard', label: 'My Application' }, // Map My Application page path.
      // Link 2: Redirection targeting chat inbox message flows with HR.
      { to: '/student/messages', label: 'Messages' }, // Map Messages workspace path.
      // REMOVED Link 3: Attendance - attendance system completely removed in Phase 8.
      // Link 4: Redirection targeting official transcripts evaluation outputs.
      { to: '/student/results', label: 'My Results' }, // Map My Results records path.
      // Link 5: Redirection targeting feedback logs and forms.
      { to: '/student/feedback', label: 'Feedback' }, // Map Feedbacks records path.
      // Link 6: Redirection to daily journal page for internship reflections.
      { to: '/student/journal', label: 'Journal' }, // Map Journal documentation path.
      // Link 7: Settings page for account management.
      { to: '/student/settings', label: 'Settings' } // Map Settings configuration path.
    ]; // Complete student array lists.
  } // Terminate student role block.

  // Check if role is hr to select specific human resources links maps.
  if (role === 'hr') {
    // If HR, populate navLinks with target administrative operations routes.
    navLinks = [
      // Link 1: View incoming internship request registry grids.
      { to: '/hr/applications', label: 'Applications' }, // Map Applications index page path.
      // Link 2: Access direct message portals with students.
      { to: '/hr/messages', label: 'Messages' }, // Map Messages center path.
      // REMOVED Link 3: Attendance - attendance system completely removed in Phase 8.
      // Link 4: Review supervisor score submissions records.
      { to: '/hr/scores', label: 'Scores' }, // Map Scores checklist path.
      // Link 5: Map stats records and application conversion scales.
      { to: '/hr/statistics', label: 'Statistics' }, // Map Statistics review boards.
      // Link 6: Access feedback summaries collected from students.
      { to: '/hr/dashboard', label: 'Student Feedback' }, // Map Feedbacks page path.
      // Link 7: Settings page for account management.
      { to: '/hr/settings', label: 'Settings' } // Map Settings configuration path.
    ]; // Complete HR link arrays details.
  } // Terminate HR role block.

  // Check if the role contains the word supervisor for designated guides.
  if (role && role.includes('supervisor')) {
    // If supervisor, set navLinks to supervisee metrics and scores inputs.
    navLinks = [
      // Link 1: Monitor assigned interns profiles details.
      { to: '/supervisor/dashboard', label: 'My Students' }, // Map My Students monitoring track.
      // Link 2: Submit evaluation files for department grade processing.
      { to: '/supervisor/dashboard', label: 'Submit Scores' }, // Map Submit Scores form pathways.
      // Link 3: Settings page for account management.
      { to: '/supervisor/settings', label: 'Settings' } // Map Settings configuration path.
    ]; // Complete supervisor array links details.
  } // Terminate supervisor role configurations block.

  // Render sidebar layout tags structures.
  return (
    <>
      {/* Mobile overlay backdrop - only visible when menu is open */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar - slides in on mobile, always visible on desktop */}
      <div className={`
        fixed lg:relative
        w-[280px] lg:w-[240px]
        min-h-screen
        bg-[#12110e]
        flex flex-col
        flex-shrink-0
        border-r border-white/5
        select-none font-sans
        z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Mobile close button - only visible on mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
        >
          <X size={20} />
        </button>
      
      {/* Top logo branding wrapper component with subtle border dividers */}
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOV-RLrXND8-FBpTC0iS97VkHPjm_Kjj5zuD2wcyXwyw&s=10" 
          alt="Rori Hotel Logo" 
          className="w-10 h-10 object-contain rounded-full border border-white/10 shrink-0 p-0.5 bg-white bg-opacity-95 shadow-sm" 
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col">
          {/* Rori Hotel trademark badge title */}
          <span className="text-sm font-serif font-bold text-white tracking-wider uppercase leading-none">
            Rori Hotel
          </span>
          {/* Subtitle labels clarifying ERP systems scope */}
          <span className="text-[9px] uppercase tracking-wider text-white/40 font-semibold mt-1">
            Intern System
          </span>
        </div>
      </div>
      
      {/* User profile capsule component containing current active session details */}
      <div className="px-4 py-3.5 border-b border-white/10 bg-white/2 flex items-center gap-3">
        {/* Circle avatar icon image at sidebar top with lock badge if photo is locked */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
          {user && user.profilePhoto ? ( // Check if user profile photo exists in database.
            <img 
              src={user.profilePhoto} // Use Cloudinary HTTPS URL directly from user object without modification or localhost prefix.
              alt={user.fullName || 'User'} // Set accessibility alt text to user full name or fallback.
              referrerPolicy="no-referrer" // Prevent referrer header leaks for security.
              className="w-full h-full object-cover" // Apply full size cover styling.
            />
          ) : ( // If no profile photo exists show initials fallback.
            <span className="text-[#C9A84C] font-serif font-black text-sm">
              {(user?.fullName || 'U').charAt(0).toUpperCase()}
            </span>
          )}
          {/* Show lock badge if profile photo is locked */}
          {user && user.photoLocked && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#C9A84C] flex items-center justify-center border border-[#12110e]">
              <span className="text-[8px]">🔒</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Paragraph outlining current logged in user display name */}
          <p className="text-xs font-extrabold text-[#C9A84C] truncate uppercase tracking-wider">
            {user && user.fullName ? user.fullName : 'Guest Profile'}
          </p>
          
          {/* Span clarifying current platform permissions authorization code */}
          <span className="text-[9px] text-white/30 truncate uppercase tracking-widest font-semibold block mt-0.5">
            {role ? role.replace('supervisor_', 'sup ').replace('_', ' ') : 'Visitor'}
          </span>
        </div>
      </div>
      
      {/* Middle nav area comprising loop-rendered redirection blocks */}
      <div className="pt-2 flex-1 flex flex-col space-y-1">
        
        {/* Map each nav link entry to react router nav link tags */}
        {navLinks.map((link, index) => (
          // Link element container matching structural keys
          <NavLink
            key={index}
            to={link.to}
            // Dynamic className handler evaluating active router tracks
            className={({ isActive }) => {
              // Return styled golden highlights classes if active route match is true
              if (isActive) {
                return "flex items-center px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#C9A84C] bg-white/5 border-l-4 border-[#C9A84C] transition-all duration-300";
              }
              // Return standard opaque styling if route match is false
              return "flex items-center px-6 py-3 text-xs font-bold uppercase tracking-widest text-white/60 border-l-4 border-transparent hover:text-white hover:bg-white/5 transition-all duration-300";
            }}
          >
            {/* Display raw navigation labels */}
            {link.label}
          </NavLink>
        ))}
        
      </div>
      
      {/* Bottom copyright segment tracking system versions */}
      <div className="p-6 border-t border-white/10 flex flex-col space-y-1">
        
        {/* Enterprise logo trace labels */}
        <span className="text-[9px] uppercase tracking-widest text-white/30">
          Rori Hotel
        </span>
        
        {/* Current calendar date extraction string */}
        <span className="text-[9px] text-white/20">
          &copy; {new Date().getFullYear()}
        </span>
        
      </div>
      
    </div>
    </>
  );
};

// Export Sidebar as default module
export default Sidebar;
