// This component provides the student journal interface with two sections: new entry form on left and journal history on right.
// Students can write daily reflections about their internship experiences, track their mood, and delete past entries.
import React, { useState, useEffect } from 'react'; // Import React core library and hooks for state management and side effects.
import { useAuth } from '../../context/AuthContext'; // Import authentication context to get current user information.
import DashboardLayout from '../../components/DashboardLayout'; // Import dashboard layout wrapper for consistent UI structure.
import api from '../../utils/api'; // Import configured axios instance for making authenticated API requests to backend.

// Define the main StudentJournal functional component.
const StudentJournal = () => { // Begin component definition.
  const { user } = useAuth(); // Extract user object from authentication context to get student details.
  
  // State variables for new journal entry form fields.
  const [title, setTitle] = useState(''); // State for journal entry title input with initial empty string.
  const [content, setContent] = useState(''); // State for journal entry content textarea with initial empty string.
  const [mood, setMood] = useState('okay'); // State for mood selection with default value "okay".
  const [department, setDepartment] = useState(''); // State for department field with initial empty string.
  const [date, setDate] = useState(''); // State for date field with initial empty string.
  
  // State variables for journal history and UI feedback.
  const [journals, setJournals] = useState([]); // State array to store list of journal entries with initial empty array.
  const [loading, setLoading] = useState(false); // State for submit button loading indicator with initial false.
  const [fetchingJournals, setFetchingJournals] = useState(true); // State for loading journals from API with initial true.
  const [error, setError] = useState(''); // State for error messages with initial empty string.
  const [success, setSuccess] = useState(''); // State for success messages with initial empty string.
  
  // Mood options array with emoji and text for dropdown selector.
  const moodOptions = [ // Define array of mood objects with value, emoji, and label.
    { value: 'great', emoji: '😄', label: 'Great' }, // Great mood option with happy emoji.
    { value: 'good', emoji: '🙂', label: 'Good' }, // Good mood option with smile emoji.
    { value: 'okay', emoji: '😐', label: 'Okay' }, // Okay mood option with neutral emoji.
    { value: 'tired', emoji: '😴', label: 'Tired' }, // Tired mood option with sleepy emoji.
    { value: 'difficult', emoji: '😞', label: 'Difficult' } // Difficult mood option with sad emoji.
  ]; // Close mood options array definition.
  
  // useEffect hook to set default date to today and fetch existing journal entries on component mount.
  useEffect(() => { // Define effect that runs once on mount.
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format by converting ISO string and splitting at T.
    setDate(today); // Set date state to today's date as default.
    fetchJournals(); // Call function to load existing journal entries from API.
  }, []); // Empty dependency array means this effect runs only once on component mount.
  
  // Async function to fetch all journal entries for current student from backend API.
  const fetchJournals = async () => { // Define async function to retrieve journals.
    try { // Start error handling block.
      setFetchingJournals(true); // Set loading state to true to show loading indicator.
      const response = await api.get('/journal/my-entries'); // Make GET request to fetch student's journal entries.
      setJournals(response.data.journals || []); // Update journals state with response data or empty array if no journals.
      console.log('[Journal] Fetched', response.data.journals?.length || 0, 'entries'); // Log number of entries retrieved.
    } catch (err) { // Catch any errors during fetch.
      console.error('[Journal] Error fetching entries:', err); // Log error to console.
      setError('Failed to load journal entries'); // Set error message for user.
    } finally { // Finally block runs regardless of success or error.
      setFetchingJournals(false); // Set loading state to false after fetch completes.
    } // End try-catch-finally.
  }; // Close fetchJournals function.
  
  // Function to handle new journal entry form submission.
  const handleSubmit = async (e) => { // Define async submit handler accepting event object.
    e.preventDefault(); // Prevent default form submission that would reload page.
    
    // Validate that title and content are not empty before submitting.
    if (!title.trim() || !content.trim()) { // Check if title or content is empty after trimming whitespace.
      setError('Title and content are required'); // Set validation error message.
      return; // Exit function early without submitting.
    } // End validation check.
    
    // Validate content length does not exceed 2000 characters.
    if (content.length > 2000) { // Check if content exceeds maximum length.
      setError('Content must be 2000 characters or less'); // Set length validation error.
      return; // Exit function without submitting.
    } // End length validation.
    
    setLoading(true); // Set loading state to true to disable submit button and show loading text.
    setError(''); // Clear any previous error messages.
    setSuccess(''); // Clear any previous success messages.
    
    try { // Start error handling for API request.
      const response = await api.post('/journal', { // Make POST request to create new journal entry.
        title: title.trim(), // Send trimmed title to remove extra whitespace.
        content: content.trim(), // Send trimmed content.
        department: department || '', // Send department or empty string if not filled.
        mood: mood, // Send selected mood value.
        date: date // Send selected date in YYYY-MM-DD format.
      }); // Close request body.
      
      setSuccess('Journal entry saved successfully! ✅'); // Set success message with checkmark emoji.
      console.log('[Journal] Entry created:', response.data.journal); // Log created entry details.
      
      // Clear form fields after successful submission.
      setTitle(''); // Reset title to empty string.
      setContent(''); // Reset content to empty string.
      setMood('okay'); // Reset mood to default okay value.
      setDepartment(''); // Reset department to empty string.
      const today = new Date().toISOString().split('T')[0]; // Get today's date again.
      setDate(today); // Reset date to today.
      
      fetchJournals(); // Refresh journal list to show newly created entry.
      
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds automatically.
    } catch (err) { // Catch any errors during submission.
      console.error('[Journal] Error creating entry:', err); // Log error to console.
      setError(err.response?.data?.message || 'Failed to save journal entry'); // Set error message from server or default message.
    } finally { // Finally block runs after try or catch.
      setLoading(false); // Set loading back to false to re-enable submit button.
    } // End try-catch-finally.
  }; // Close handleSubmit function.

  // Function to handle deleting a journal entry with confirmation.
  const handleDelete = async (entryId) => { // Define async delete handler accepting entry ID.
    const confirmed = window.confirm('Are you sure you want to delete this journal entry? This cannot be undone.'); // Show browser confirmation dialog.
    if (!confirmed) return; // Exit function if user cancels deletion.
    
    try { // Start error handling for delete request.
      await api.delete(`/journal/${entryId}`); // Make DELETE request to remove entry by ID.
      setSuccess('Journal entry deleted successfully'); // Set success message.
      fetchJournals(); // Refresh journal list to remove deleted entry from UI.
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds.
    } catch (err) { // Catch delete errors.
      console.error('[Journal] Error deleting entry:', err); // Log error.
      setError(err.response?.data?.message || 'Failed to delete journal entry'); // Set error message.
    } // End try-catch.
  }; // Close handleDelete function.
  
  // Function to format date string from YYYY-MM-DD to readable format like "January 15, 2024".
  const formatDate = (dateString) => { // Define date formatter accepting date string.
    const date = new Date(dateString + 'T00:00:00'); // Create Date object with time to avoid timezone issues.
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); // Return formatted date string.
  }; // Close formatDate function.
  
  // Render the component JSX with two-column layout: form on left, history on right.
  return ( // Start return statement for component JSX.
    <DashboardLayout role="student" pageTitle="My Journal"> {/* Wrap content in dashboard layout with student role and page title */}
      <div className="max-w-7xl mx-auto p-6"> {/* Main container with max width and padding */}
        
        {/* Page header with title and subtitle */}
        <div className="mb-8"> {/* Header container with bottom margin */}
          <h1 className="text-3xl font-serif font-black text-gray-900 mb-2">📓 Daily Journal</h1> {/* Page title with notebook emoji and serif font */}
          <p className="text-sm text-gray-500">Document your daily experiences, learnings, and reflections during your internship</p> {/* Subtitle explaining page purpose */}
        </div>
        
        {/* Success message alert - shown when entry is saved or deleted */}
        {success && ( // Conditional rendering - only show if success message exists.
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium"> {/* Green success alert box */}
            {success} {/* Display success message text */}
          </div> // Close success alert.
        )} {/* Close conditional rendering */}
        
        {/* Error message alert - shown when validation fails or API error occurs */}
        {error && ( // Conditional rendering - only show if error message exists.
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium"> {/* Red error alert box */}
            {error} {/* Display error message text */}
          </div> // Close error alert.
        )} {/* Close conditional rendering */}
        
        {/* Two-column grid layout: form on left, history on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> {/* Responsive grid - 1 column mobile, 2 columns desktop with gap between */}
          
          {/* LEFT COLUMN: New Journal Entry Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"> {/* White card with rounded corners and padding */}
            <h2 className="text-xl font-semibold text-gray-900 mb-6">✏️ Write New Entry</h2> {/* Form section title with pencil emoji */}
            
            <form onSubmit={handleSubmit} className="space-y-4"> {/* Form with submit handler and spacing between fields */}
              
              {/* Title input field */}
              <div> {/* Field container */}
                <label className="block text-sm font-medium text-gray-700 mb-2">Entry Title</label> {/* Label for title input */}
                <input
                  type="text"
                  value={title} // Bind to title state.
                  onChange={(e) => setTitle(e.target.value)} // Update title state on input change.
                  maxLength={100} // Enforce 100 character limit.
                  placeholder="e.g., My first day at Front Office" // Placeholder text as example.
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent" // Styled input with gold focus ring.
                />
                <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p> {/* Character counter showing current length */}
              </div> {/* Close title field container */}
              
              {/* Date input field */}
              <div> {/* Field container */}
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label> {/* Label for date input */}
                <input
                  type="date"
                  value={date} // Bind to date state.
                  onChange={(e) => setDate(e.target.value)} // Update date state on change.
                  max={new Date().toISOString().split('T')[0]} // Set max to today to prevent future dates.
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent" // Styled date input.
                />
              </div> {/* Close date field container */}
              
              {/* Mood selector dropdown */}
              <div> {/* Field container */}
                <label className="block text-sm font-medium text-gray-700 mb-2">How was your day?</label> {/* Label asking about mood */}
                <select
                  value={mood} // Bind to mood state.
                  onChange={(e) => setMood(e.target.value)} // Update mood state on selection change.
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent" // Styled select dropdown.
                >
                  {moodOptions.map((option) => ( // Map over mood options array to create option elements.
                    <option key={option.value} value={option.value}> {/* Option element with value */}
                      {option.emoji} {option.label} {/* Display emoji and label text */}
                    </option>
                  ))}
                </select>
              </div> {/* Close mood field container */}
              
              {/* Department input field */}
              <div> {/* Field container */}
                <label className="block text-sm font-medium text-gray-700 mb-2">Department (Optional)</label> {/* Label for optional department field */}
                <input
                  type="text"
                  value={department} // Bind to department state.
                  onChange={(e) => setDepartment(e.target.value)} // Update department on change.
                  placeholder="e.g., Front Office, Housekeeping" // Placeholder with examples.
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent" // Styled input.
                />
              </div> {/* Close department field container */}
              
              {/* Content textarea field */}
              <div> {/* Field container */}
                <label className="block text-sm font-medium text-gray-700 mb-2">Journal Entry</label> {/* Label for main content textarea */}
                <textarea
                  value={content} // Bind to content state.
                  onChange={(e) => setContent(e.target.value)} // Update content on change.
                  maxLength={2000} // Enforce 2000 character limit.
                  rows={10} // Set textarea height to 10 rows.
                  placeholder="Write about your experiences, what you learned, challenges you faced, or any reflections..." // Helpful placeholder text.
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent resize-none" // Styled textarea without resize handle.
                />
                <p className="text-xs text-gray-500 mt-1">{content.length}/2000 characters</p> {/* Character counter for content */}
              </div> {/* Close content field container */}
              
              {/* Submit button */}
              <button
                type="submit"
                disabled={loading} // Disable button while submitting.
                className="w-full px-6 py-3 text-sm font-semibold text-gray-900 bg-[#C9A84C] rounded-lg hover:bg-[#b59540] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" // Gold button with hover and disabled states.
              >
                {loading ? '⏳ Saving...' : '💾 Save Entry'} {/* Show loading text with hourglass or save text with disk emoji */}
              </button>
            </form> {/* Close form */}
          </div> {/* Close left column card */}

          {/* RIGHT COLUMN: Journal History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"> {/* White card for journal history */}
            <h2 className="text-xl font-semibold text-gray-900 mb-6">📚 Your Journal History</h2> {/* History section title with books emoji */}
            
            {/* Loading state while fetching journals */}
            {fetchingJournals ? ( // Conditional rendering for loading state.
              <div className="text-center py-12"> {/* Centered loading container */}
                <div className="text-4xl mb-4">⏳</div> {/* Loading hourglass emoji */}
                <p className="text-gray-500">Loading your journal entries...</p> {/* Loading text */}
              </div>
            ) : journals.length === 0 ? ( // Else if no journals exist show empty state.
              <div className="text-center py-12"> {/* Centered empty state container */}
                <div className="text-6xl mb-4">📝</div> {/* Large memo emoji */}
                <p className="text-gray-500 mb-2">No journal entries yet</p> {/* Empty state message */}
                <p className="text-sm text-gray-400">Start documenting your internship journey by writing your first entry!</p> {/* Encouragement text */}
              </div>
            ) : ( // Else show list of journal entries.
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2"> {/* Scrollable container for journal entries with max height */}
                {journals.map((journal) => ( // Map over journals array to render each entry.
                  <div key={journal._id} className="border border-gray-200 rounded-lg p-4 hover:border-[#C9A84C] transition-colors"> {/* Individual journal entry card with hover effect */}
                    
                    {/* Entry header with date and mood */}
                    <div className="flex items-center justify-between mb-3"> {/* Flex container for header elements */}
                      <div className="flex items-center gap-2"> {/* Date and mood container */}
                        <span className="text-xs font-semibold text-gray-500">{formatDate(journal.date)}</span> {/* Formatted date */}
                        {journal.mood && ( // If mood exists show mood emoji.
                          <span className="text-lg"> {/* Mood emoji container */}
                            {moodOptions.find(m => m.value === journal.mood)?.emoji || '😐'} {/* Find and display mood emoji or default neutral */}
                          </span>
                        )}
                      </div> {/* Close date and mood container */}
                      
                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(journal._id)} // Call delete handler with entry ID.
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors" // Red delete button.
                        title="Delete entry" // Tooltip on hover.
                      >
                        🗑️ Delete {/* Trash can emoji with delete text */}
                      </button>
                    </div> {/* Close entry header */}
                    
                    {/* Entry title */}
                    <h3 className="font-semibold text-gray-900 mb-2">{journal.title}</h3> {/* Journal title in bold */}
                    
                    {/* Department badge if exists */}
                    {journal.department && ( // Conditional rendering if department field has value.
                      <span className="inline-block px-2 py-1 text-xs font-medium text-[#C9A84C] bg-[#FFF8E7] rounded mb-2"> {/* Gold badge */}
                        {journal.department} {/* Department name */}
                      </span>
                    )}
                    
                    {/* Entry content with character limit */}
                    <p className="text-sm text-gray-600 line-clamp-4"> {/* Content paragraph with line clamp to show max 4 lines */}
                      {journal.content} {/* Journal entry text content */}
                    </p>
                    
                    {/* Show "Read more" if content is long */}
                    {journal.content && journal.content.length > 200 && ( // If content exceeds 200 characters show read more.
                      <button className="text-xs text-[#C9A84C] hover:underline mt-2"> {/* Small read more link */}
                        Read full entry... {/* Read more text */}
                      </button>
                    )}
                    
                    {/* Entry metadata footer */}
                    <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400"> {/* Footer with top border */}
                      Saved {new Date(journal.createdAt).toLocaleDateString()} {/* Show when entry was created */}
                    </div>
                  </div> // Close journal entry card.
                ))}
              </div> // Close scrollable entries container.
            )}
          </div> {/* Close right column card */}
          
        </div> {/* Close two-column grid */}
      </div> {/* Close main container */}
    </DashboardLayout> // Close dashboard layout wrapper.
  ); // Close return statement.
}; // Close StudentJournal component definition.

// Export StudentJournal component as default export for importing in other files.
export default StudentJournal; // Export component.
