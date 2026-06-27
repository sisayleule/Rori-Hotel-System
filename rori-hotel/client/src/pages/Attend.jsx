// This page opens when a student scans the QR code at a department. It is designed for mobile phones and must work without any complicated navigation.
import React, { useState, useEffect } from 'react'; // Import React standard hooks such as state and effects.
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom'; // Import useSearchParams, useNavigate, useLocation, and Link from react-router-dom.
import { useAuth } from '../context/AuthContext'; // Import useAuth custom hook from AuthContext container.
import api from '../utils/api'; // Import configured central Axios api helper.
// Create the functional component named Attend.
const Attend = () => { // Begin component definitions.
  const [searchParams] = useSearchParams(); // Get searchParams from useSearchParams to read query parameters from URL.
  const navigate = useNavigate(); // Get navigate from useNavigate.
  const location = useLocation(); // Get current browser location state information via react-router-dom hook.
  const { user } = useAuth(); // Get user from useAuth.
  const token = searchParams.get('token'); // Read the token value from URL query parameters (e.g., ?token=SOME_UUID).
  // Create these state variables with comments explaining each purpose in full.
  const [department, setDepartment] = useState(''); // empty string — the department name fetched using the token.
  const [currentTime, setCurrentTime] = useState(''); // empty string — the current time displayed and updated every second.
  const [currentDate, setCurrentDate] = useState(''); // empty string — today's date displayed on the page.
  const [verifying, setVerifying] = useState(true); // true — true while verifying the QR token with the backend.
  const [verified, setVerified] = useState(false); // false — true when the token is confirmed valid.
  const [actionLoading, setActionLoading] = useState(false); // false — true while clock in or clock out is being processed.
  const [message, setMessage] = useState(''); // empty string — the success or error message shown after scanning.
  const [messageType, setMessageType] = useState(''); // empty string — either success or error to determine the message color.
  const [invalidToken, setInvalidToken] = useState(false); // false — true when the token is not found in the database.
  // Add a useEffect that runs once on mount.
  useEffect(() => { // Begin mount effect hook.
    // First: set up clock ticking interval.
    const clockInterval = setInterval(() => { // Create an interval that runs every 1000 milliseconds.
      const now = new Date(); // Create a new Date instance.
      const hrs = String(now.getHours()).padStart(2, '0'); // Pad hours with zero prefix.
      const mins = String(now.getMinutes()).padStart(2, '0'); // Pad minutes with zero prefix.
      const secs = String(now.getSeconds()).padStart(2, '0'); // Pad seconds each with padStart 2 zeros.
      setCurrentTime(`${hrs}:${mins}:${secs}`); // Set currentTime to the formatted string.
      const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }; // Specify formatting specifications.
      setCurrentDate(now.toLocaleDateString('en-US', dateOptions)); // Set currentDate to this formatted string.
    }, 1000); // Close clock ticking interval loop.
    // Second: verify the QR token with backend.
    const verifyTokenSpec = async () => { // Declare async helper verify routine.
      if (!token) { // If token is empty or missing.
        setInvalidToken(true); // Set invalidToken to true.
        setVerifying(false); // Set verifying to false.
        return; // Return and abort.
      } // End check.
      try { // Wrap network operations inside try-catch block.
        const response = await api.get('/attendance/verify', { params: { token } }); // Send GET to /attendance/verify with query param token.
        setDepartment(response.data.department); // Set department to response.data.department.
        setVerified(true); // Set verified to true.
      } catch (err) { // Trap connection exceptions.
        console.error('Error verifying attendance QR token:', err); // Log diagnostic details onto console block.
        setInvalidToken(true); // Set invalidToken to true.
      } finally { // Terminate check sequence.
        setVerifying(false); // Set verifying to false.
      } // End try-catch block.
    }; // End verifyTokenSpec function.
    verifyTokenSpec(); // Call verifyToken function defined above.
    return () => { // Return a cleanup function.
      clearInterval(clockInterval); // Call clearInterval with the interval id to release memory cleanly.
    }; // End cleanup function payload.
  }, [token]); // Bind listener updates to token parameters.
  // Create an async function called handleAttendance to submit scans.
  const handleAttendance = async (type) => { // It accepts a type argument which is either the string clockIn or the string clockOut.
    if (!user) { // Check if user is null meaning the student is not logged in.
      navigate('/login', { state: { from: location.pathname + location.search } }); // If not logged in navigate to /login with a state object containing from set to current URL path + search.
      return; // Return and abort execution flow.
    } // End verification validation check.
    setActionLoading(true); // Set actionLoading to true.
    setMessage(''); // Reset messages to empty string.
    try { // Start safety try-catch block wrapper.
      const bodyPayload = { token, type }; // Construct request body schema.
      const response = await api.post('/attendance/scan', bodyPayload); // Send POST to /attendance/scan with body containing token and type.
      setMessage(response.data.message || 'attendance recorded successfully'); // Set message to the success message from response.data.message.
      setMessageType('success'); // Set messageType to success.
    } catch (err) { // Trap connection glitches or error states.
      console.error('Attendance scanning failure:', err); // Log diagnostic details onto output debugger panel.
      const errMsg = err.response && err.response.data && err.response.data.message // Examine error details payload.
        ? err.response.data.message // Take error from API.
        : 'failed to record attendance please try again'; // Set message to a fallback string saying failed to record attendance.
      setMessage(errMsg); // Set error message.
      setMessageType('error'); // Set messageType to error.
    } finally { // Terminate processes.
      setActionLoading(false); // Set actionLoading to false when transaction completes.
    } // End try-catch-finally block.
  }; // End handleAttendance helper block definition.
  // Now build the visual output templates.
  return ( // Open main JSX return block coordinates.
    <div className="min-h-screen bg-[#111827] flex flex-col items-center justify-center p-6 text-white font-sans select-none"> {/* Full page container with dark charcoal background. */}
      {/* Evaluate verifying indicator blocks */}
      {verifying ? ( // Check if verifying state is currently true.
        // If verifying show a centered paragraph saying Verifying QR code in white.
        <div className="text-center font-sans"> {/* Simple layout. */}
          <p className="text-lg font-bold animate-pulse text-white">Verifying QR code...</p> {/* Main caption. */}
          <p className="text-xs text-gray-400 mt-2 font-semibold">Confirming department security credentials...</p> {/* Subheading text coordinate. */}
        </div> // Close div wrap.
      ) : invalidToken ? ( // Evaluate invalidToken parameter state.
        // If invalidToken show a red error box centered.
        <div className="max-w-md w-full bg-red-950/40 border border-red-500/30 p-8 rounded-2xl text-center flex flex-col items-center space-y-6"> {/* Container shape. */}
          <span className="text-4xl block">⚠️</span> {/* Error warning system emoji indicator. */}
          <h2 className="text-2xl font-black tracking-tight text-white font-serif">Invalid QR Code</h2> {/* Show a heading saying Invalid QR Code in white size 2xl. */}
          <p className="text-sm text-red-200 leading-relaxed font-sans font-medium">This QR code is not valid or has expired. Please ask HR for the correct QR code.</p> {/* Show a paragraph saying invalid or expired error instruction. */}
          <Link to="/login" className="bg-[#C9A84C] hover:bg-[#B7963A] text-gray-900 text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-lg w-full transition-colors text-center cursor-pointer border-0"> {/* Styled link. */}
            Go to Login {/* Link to /login saying Go to Login styled as gold button. */}
          </Link> {/* Close link. */}
        </div> // Close invalidToken widget container layout wrap.
      ) : ( // Show the valid attendance visual templates interface.
        // If verified show the main attendance interface.
        <div className="max-w-md w-full bg-gray-900/60 border border-white/5 p-8 rounded-2xl flex flex-col items-center space-y-8 shadow-2xl"> {/* Panel design. */}
          {/* Header branding details block */}
          <div className="text-center"> {/* Container. */}
            {/* Show a small paragraph saying Rori Hotel in gold uppercase tracked letters margin bottom 8 pixels. */}
            <span className="text-[#C9A84C] text-[10px] font-black uppercase tracking-[0.25em] block mb-2">Rori Hotel</span> {/* Brand watermark. */}
            {/* Show an h1 with the department name in white Playfair Display size 4xl text center margin bottom 4 pixels. */}
            <h1 className="text-4xl font-black text-white font-serif tracking-tight mb-2 text-center">{department}</h1> {/* Department name heading. */}
            {/* Show the currentDate in white at 50 percent opacity small font margin bottom 4 pixels. */}
            <span className="text-xs text-white/50 font-semibold block mb-1">{currentDate}</span> {/* Current calendar date display block. */}
            {/* Show the currentTime in white Playfair Display size 2xl margin bottom 48 pixels. This updates every second. */}
            <span className="text-2xl font-black font-serif text-white tracking-widest block">{currentTime}</span> {/* Running ticking clock display. */}
          </div> {/* Close header block wrap. */}
          {/* User authentication states reports block */}
          <div className="w-full text-center border-t border-b border-white/5 py-4"> {/* Boundary frame coords. */}
            {user ? ( // If user is not null.
              // Show the logged in user name in small white at 70 percent opacity.
              <span className="text-xs text-white/70 font-semibold block">Logged in as {user.fullName}</span> // Logged in accounts labels list indicators.
            ) : ( // Else show warnings instructions.
              // If user is null show a small paragraph in gold saying Please log in first.
              <p className="text-xs text-[#C9A84C] font-bold uppercase tracking-widest">Please log in first to record attendance.</p> // Prompt block warning indicators.
            )} {/* Close conditional authentication states checks. */}
          </div> {/* Close user authentication states wrap. */}
          {/* Action trigger scan button controls layout panel wrapper */}
          <div className="w-full flex flex-col space-y-3"> {/* Inner flex-column. */}
            {/* Clock In button. onClick calls handleAttendance with 'clockIn'. */}
            <button
              onClick={() => handleAttendance('clockIn')} // Click operations handler.
              disabled={actionLoading} // If actionLoading disable the button.
              className="bg-[#C9A84C] hover:bg-[#B7963A] disabled:bg-gray-700 disabled:text-gray-400 text-gray-900 text-sm font-bold uppercase tracking-widest px-6 py-4 rounded-xl w-full transition-colors border-0 cursor-pointer text-center" // Style with gold background charcoal text full width max width 300 pixels padding y 16 pixels font size lg font weight 600 rounded xl hover gold-light transition.
            > {/* Button. */}
              Clock In {/* Caption. */}
            </button> {/* Close clock in button component. */}
            {/* Clock Out button below it. onClick calls handleAttendance with 'clockOut'. */}
            <button
              onClick={() => handleAttendance('clockOut')} // Click operations handler.
              disabled={actionLoading} // If actionLoading disable.
              className="bg-transparent hover:bg-white/10 text-white text-sm font-bold uppercase tracking-widest px-6 py-4 rounded-xl w-full border border-white/20 hover:border-white transition-colors cursor-pointer text-center" // Style with transparent background white border full width max width 300 pixels same padding rounded xl hover white background at 10 percent text white.
            > {/* Button. */}
              Clock Out {/* Caption. */}
            </button> {/* Close clock out button component. */}
          </div> {/* Close buttons panel. */}
          {/* Transaction messages reports display box */}
          {message && ( // If message is not empty show the message below the buttons.
            <div className={`p-4 rounded-xl w-full border text-xs font-bold leading-relaxed text-center ${messageType === 'success' ? 'bg-green-950/30 border-green-500/30 text-green-400' : 'bg-red-950/30 border-red-500/30 text-red-400'}`}> {/* Shape. */}
              {message} {/* Print transaction logs success or error message string details. */}
            </div> // Close report widget element.
          )} {/* End message condition wrappers. */}
          {/* Bottom navigation auxiliary quick actions links */}
          <div className="w-full flex flex-col items-center"> {/* Alignment wrap. */}
            <div className="w-full border-t border-white/5 my-4" /> {/* Show a small divider line. */}
            {/* Link to the student dashboard saying Go to Dashboard in small white at 50 percent opacity. */}
            <Link to="/student" className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer font-semibold underline decoration-dotted"> {/* Backlink to home dashboard. */}
              Go to Dashboard {/* Link label text pointer template. */}
            </Link> {/* Close backlink. */}
          </div> {/* Close child align wrap. */}
        </div> // Close unified verified display panel.
      )} {/* Close conditional check statements blocks. */}
    </div> // Finish fullscreen mobile layouts.
  ); // Terminate JSX master block execution codes.
}; // Terminate Attend functional code definitions.
export default Attend; // Export Attend as default.
