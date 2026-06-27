// This page lets the student submit a complaint or recommendation about the hotel or a specific department.
// It contains a fully responsive form with dynamic state validations and clear success/error visual blocks.
import React, { useState } from 'react'; // Import React key states management hooks.
// Import the standard custom layout wrapper component.
import DashboardLayout from '../../components/DashboardLayout'; // Fetch common nested dashboard parent layout components.
// Import the preconfigured Axios network client instance.
import api from '../../utils/api'; // Load unified client-side network querying driver instances.

// Create the StudentFeedback functional component.
const StudentFeedback = () => { // Begin functional component declaration.
  // targetDepartment state stores which specific hotel department this message is targeted at.
  const [targetDepartment, setTargetDepartment] = useState(''); // Initialize with empty string for general hotel.
  // feedbackType state stores whether the student's message represents a complaint or a recommendation.
  const [feedbackType, setFeedbackType] = useState(''); // Set initial selection value to empty string.
  // message state stores the actual textual string comments inputted by students.
  const [message, setMessage] = useState(''); // Set initial comment input value to empty string.
  // loading state locks the dispatcher button and form selectors during outgoing post requests.
  const [loading, setLoading] = useState(false); // Set initial execution progress to false.
  // error state saves failure alert messages from database or connection limits.
  const [error, setError] = useState(''); // Keep target fallback message string empty initially.
  // success state saves positive validation metrics after storing records inside database.
  const [success, setSuccess] = useState(''); // Keep success confirmation message empty initially.

  // Create an async function called handleSubmit to dispatch feedback records to our Express server.
  const handleSubmit = async (e) => { // Setup event triggered function.
    if (e && e.preventDefault) { // Evaluate whether browser default navigation events are present.
      e.preventDefault(); // Suspend page redirection triggers.
    } // End verification validation check.

    // Validate that critical fields feedbackType and messaging content are not empty.
    if (!feedbackType || !message.trim()) { // Verify basic inputs parameters presence.
      setError('please select a feedback type and write your message.'); // Set user error state message.
      return; // Return early halting submission sequence.
    } // End check.

    setLoading(true); // Lock buttons and fields with standard true flag.
    setError(''); // Flush previous error messages out.
    setSuccess(''); // Flush previous success messages out.

    try { // Start error trapping sequence to capture database or network failures.
      await api.post('/feedback', { // Fire HTTP POST request using api server helper.
        targetDepartment: targetDepartment, // Map selected department name string values.
        feedbackType: feedbackType, // Map targeted complaint/recommendation enum values.
        message: message.trim() // Trim redundant space padding from text parameters.
      }); // Terminate post request call.

      setSuccess('thank you for your feedback. Your message has been sent to HR.'); // Populate success confirmation metric.
      setTargetDepartment(''); // Clear selected department selector value back to general flag.
      setFeedbackType(''); // Clear selected feedback categorizer selector value back to empty.
      setMessage(''); // Clear text feedback draft inputs in textarea.
    } catch (err) { // Trap execution failure.
      console.error('Failed to submit feedback documents:', err); // Log details onto diagnostic console.
      setError('failed to submit feedback please try again.'); // Update user error state message.
    } finally { // Finalize operations sequence.
      setLoading(false); // Unlock dispatcher button and input states.
    } // Complete try catch block.
  }; // Close handleSubmit function.

  return ( // Start returning JSX layout.
    <DashboardLayout role="student" pageTitle="Feedback"> 
      
      {/* Scrollable grid centered container mapping standard negative margins */}
      <div className="max-w-3xl mx-auto flex flex-col font-sans select-none"> 
        
        {/* Main section typography header */}
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2"> 
          Share Your Feedback 
        </h2> 
        
        {/* Subtitle brief caption */}
        <p className="text-sm text-gray-400 mb-8 block leading-relaxed font-semibold"> 
          Your feedback helps Rori Hotel improve the internship experience for future students. 
        </p> 

        {/* Option: Green success indicators box */}
        {success && ( // Check if success metrics are set.
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-xl mb-6 text-center shadow-xs"> 
            {success} 
          </div> // Close success block.
        )} 

        {/* Option: Red failure indicators box */}
        {error && ( // Check if error messages exist.
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl mb-6 text-center shadow-xs"> 
            {error} 
          </div> // Close error block.
        )} 

        {/* Form panel container styled as safe white floating card */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 md:p-8 flex flex-col space-y-6"> 
          
          {/* FIELD ONE — Associated Department Selector Block */}
          <div className="flex flex-col"> 
            <label className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2 block select-none"> 
              This feedback is about 
            </label> 
            <select 
              value={targetDepartment} // Hook value property to active targetDepartment state.
              onChange={(e) => setTargetDepartment(e.target.value)} // Bind update reactions to setTargetDepartment state setting setter.
              disabled={loading} // Lock element selection when submit is in progress.
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none transition-all duration-300 disabled:opacity-50 text-gray-700" 
            > 
              <option value="">General Hotel</option> { /* Option default representing general feedback */ }
              <option value="Front Office">Front Office</option> { /* Option Front Office department tracking */ }
              <option value="Housekeeping">Housekeeping</option> { /* Option Housekeeping department tracking */ }
              <option value="Kitchen">Kitchen</option> { /* Option Kitchen cooking operations department tracking */ }
              <option value="F&B Service">F&B Service</option> { /* Option Food and Beverage service department tracking */ }
            </select> 
          </div> 

          {/* FIELD TWO — Complaint or Recommendation Categorizer Block */}
          <div className="flex flex-col"> 
            <label className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2 block select-none"> 
              Type of Feedback 
            </label> 
            <select 
              value={feedbackType} // Hook value property to active feedbackType state.
              onChange={(e) => setFeedbackType(e.target.value)} // Bind update reactions to setFeedbackType state setting setter.
              disabled={loading} // Lock element selection when submit is in progress.
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none transition-all duration-300 disabled:opacity-50 text-gray-700" 
            > 
              <option value="" disabled>Select type</option> { /* Selector base default helper */ }
              <option value="complaint">Complaint</option> { /* Option complaint tracking path */ }
              <option value="recommendation">Recommendation</option> { /* Option recommendation tracking path */ }
            </select> 
          </div> 

          {/* FIELD THREE — Written Comments Paragraph draft Block */}
          <div className="flex flex-col"> 
            <label className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2 block select-none"> 
              Your Message 
            </label> 
            <textarea 
              value={message} // Hook value property to active message state string.
              onChange={(e) => setMessage(e.target.value)} // Bind update reactions to setMessage state setter.
              rows={6} // Render rich lines blocks.
              placeholder="Write your feedback here. Be specific so HR can take action." // Friendly helpful message instructions.
              disabled={loading} // Disable text edits during submissions.
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none transition-all duration-300 disabled:opacity-50 text-gray-700 resize-none" 
            /> 
            
            {/* Realtime letter counting metric panel */}
            <span className="text-[10px] text-gray-400 mt-1.5 text-right font-bold uppercase tracking-wider block select-none"> 
              {message.length} characters 
            </span> 
          </div> 

          {/* SUBMIT BUTTON — Action dispatcher click handler trigger */}
          <button 
            onClick={handleSubmit} // Bind dispatcher submission callback trigger click.
            disabled={loading || !feedbackType || !message.trim()} // Suspend buttons triggers if criteria are empty or locked.
            className="w-full bg-[#C9A84C] hover:bg-[#b59540] disabled:bg-gray-100 text-[#12110e] disabled:text-gray-400 text-xs font-extrabold uppercase tracking-widest py-4 rounded-xl transition-all duration-305 shadow-sm hover:shadow-md cursor-pointer disabled:cursor-not-allowed select-none block" 
          > 
            {loading ? 'Submitting' : 'Submit Feedback'} 
          </button> 

        </div> 

        {/* BOTTOM EXPLANATORY INFO SECTION CARD */}
        <div className="bg-[#faf8f5] rounded-xl p-5 border border-gray-150 mt-6 select-none shadow-2xs"> 
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-2"> 
            How We Use Your Feedback 
          </h4> 
          <p className="text-xs text-gray-500 leading-relaxed font-medium"> 
            All feedback is reviewed by the HR team and used to improve the internship program. Specific department feedback is shared with the relevant supervisor. Your identity is not shared unless you choose to include your name in the message. 
          </p> 
        </div> 

      </div> 

    </DashboardLayout> 
  ); // Terminate JSX returns.
}; // Close functional component.

export default StudentFeedback; // Export feedback page module default.
