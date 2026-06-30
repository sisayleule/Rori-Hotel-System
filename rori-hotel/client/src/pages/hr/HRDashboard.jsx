// This is the HR Dashboard home page that has 3 quick action cards pointing to other HR pages, as well as a student feedback viewer below.
import React, { useState, useEffect } from 'react'; // Import React standard hooks such as state and effects.
import { Link } from 'react-router-dom'; // Import Link navigation components from client browser routing packages.
import DashboardLayout from '../../components/DashboardLayout'; // Import primary responsive layout wrapper framework.
import api from '../../utils/api'; // Import central configured Axios API router helper module.
// Create the functional component named HRDashboard.
const HRDashboard = () => { // Begin component definitions.
  // Create these state variables with comments explaining each purpose in full.
  const [feedbacks, setFeedbacks] = useState([]); // empty array — list of all feedback items from the database.
  const [filterType, setFilterType] = useState(''); // empty string — active filter type (complaint, recommendation, or empty).
  const [filterDepartment, setFilterDepartment] = useState(''); // empty string — active department filter.
  const [loadingFeedback, setLoadingFeedback] = useState(true); // true — track loading state of feedback records from endpoint.
  const [errorFeedback, setErrorFeedback] = useState(''); // empty string — error message if retrieval fails from backend.
  // Add a useEffect that runs once on mount to fetch all feedback items.
  useEffect(() => { // Begin mount effect hook.
    const fetchFeedback = async () => { // Create an async function called fetchFeedback.
      try { // Start safety try-catch block wrapper.
        setLoadingFeedback(true); // Toggle on loader indicator.
        setErrorFeedback(''); // Reset prior warning messages.
        const response = await api.get('/feedback'); // Send GET to /feedback using api helper.
        setFeedbacks(response.data || []); // Set feedbacks to response.data.
      } catch (err) { // Trap connection exceptions.
        console.error('Error loading feedback logs:', err); // Log diagnostic details onto console block.
        setErrorFeedback('could not load student feedback please refresh'); // Set errorFeedback to could not load student feedback.
      } finally { // Finalize operations flow.
        setLoadingFeedback(false); // Toggle off loader indicator.
      } // End try-catch block.
    }; // End fetchFeedback helpers definition.
    fetchFeedback(); // Call fetchFeedback.
  }, []); // Run on mount strictly once.
  // Create a filtered list of feedback items.
  const filteredFeedbacks = feedbacks.filter(item => { // Run filter.
    const typeMatch = filterType === '' ? true : item.feedbackType === filterType; // Filter based on filterType.
    const deptMatch = filterDepartment === '' ? true : item.targetDepartment === filterDepartment; // Filter based on filterDepartment.
    return typeMatch && deptMatch; // Return matched booleans combination.
  }); // End filtered feedbacks collection.
  // Compute feedback view content variable to completely avoid nested JSX ternary syntax errors.
  let feedbackContentBlock; // Define variable placeholder.
  if (loadingFeedback) { // If loadingFeedback show loading text.
    feedbackContentBlock = ( // Assign element.
      <p className="text-center text-sm font-semibold text-gray-400 py-10 bg-white rounded-xl border border-gray-150" /* Loader text layout */>Loading feedback submissions...</p>
    ); // Close assignment.
  } else if (errorFeedback) { // If errorFeedback show error box.
    feedbackContentBlock = ( // Assign layout element.
      <div className="p-4 bg-red-50 text-red-600 border border-red-150 rounded-xl font-medium text-sm" /* Alert card shape */>
        {errorFeedback} {/* Print message. */}
      </div> // Close card shape wrapper.
    ); // Close assignment.
  } else if (filteredFeedbacks.length === 0) { // If filteredFeedbacks is empty show centered text saying No feedback found.
    feedbackContentBlock = ( // Assign empty notification block.
      <div className="text-center text-sm font-semibold text-gray-400 py-12 bg-white rounded-xl border border-gray-150 select-none font-sans" /* Empty panel layout */>
        No feedback found for the selected filters. {/* Guide instructions. */}
      </div> // Close container wrap.
    ); // Close assignment.
  } else { // Handle valid results listing.
    feedbackContentBlock = ( // Assign mapped items list.
      <div className="flex flex-col gap-4" /* List body chassis */>
        {filteredFeedbacks.map(item => ( // Loop through filteredFeedbacks. For each feedback create a white card.
          <div key={item._id} className="bg-white rounded-xl shadow-xs border border-gray-150 p-6 flex flex-col gap-4 font-sans hover:border-[#C9A84C]/50 transition-colors" /* Card viewport wrapper shape */>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" /* Top flex container alignment row */>
              <div className="flex flex-col" /* Student profiles details column block */>
                <span className="text-sm font-bold text-gray-800" /* Student name string text */>{item.studentName}</span>
                <span className="text-xs text-gray-400 font-medium" /* University details label pointer */>{item.universityName}</span>
                <span className="text-[10px] text-gray-400 font-black uppercase mt-1" /* Calendar datetime tracker value */>Submitted on: {new Date(item.createdAt).toLocaleDateString()}</span>
              </div> {/* Close column container. */}
              <div className="flex items-center gap-2 self-start sm:self-auto uppercase tracking-wider text-[9px] font-extrabold select-none" /* Categories badges lists wrapper block */>
                {item.feedbackType === 'complaint' ? ( // Check complaint types.
                  <span className="bg-red-50 text-red-650 border border-red-100 rounded px-2.5 py-1" /* Red badge tag indicators */>Complaint</span>
                ) : ( // Recommendation type.
                  <span className="bg-green-50 text-green-650 border border-green-100 rounded px-2.5 py-1" /* Green badge tag indicators */>Recommendation</span>
                )} {/* End checks. */}
                <span className="border border-gray-300 text-gray-500 rounded px-2.5 py-1 bg-white" /* Department tag container */>
                  {item.targetDepartment ? item.targetDepartment : 'General Hotel'}
                </span> {/* Output element. */}
              </div> {/* Close categories badge wrap. */}
            </div> {/* Close row wrap. */}
            <p className="border-t border-gray-100 pt-4 text-xs text-gray-600 leading-relaxed font-normal italic whitespace-pre-wrap" /* Content description paragraph */>
              "{item.message}"
            </p> {/* Close paragraph content holder layout. */}
          </div> // Close single card chassis wrapper.
        ))} {/* Close mapping. */}
      </div> // Close structural container block.
    ); // Close assignment.
  } // Terminate conditionals checks blocks.
  // Now return the main page layout template structure.
  return ( // Open main JSX return block coordinates.
    // Wrap entire page in DashboardLayout setting role to hr and pageTitle to Dashboard.
    <DashboardLayout role="hr" pageTitle="Dashboard"> {/* Render Layout Wrapper. */}
      {/* Outer container wrapper div box chassis */}
      <div className="flex flex-col gap-6 font-sans select-none"> {/* Master page grid canvas. */}
        {/* SECTION ONE — Quick operations layout grid. */}
        {/* Create a responsive grid layout with 3 columns gap 24 pixels. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Three columns layout panel boxes. */}
          {/* Card 1 — Intern Applications. */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-150 p-6 flex flex-col justify-between hover:border-[#C9A84C]/50 transition-colors"> {/* Card shape container block. */}
            <div className="mb-4"> {/* Spacing separator box. */}
              <span className="text-xl mb-2 block">📋</span> {/* Icon designator emoji. */}
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-2">Intern Applications</h3> {/* Card Title. */}
              <p className="text-xs text-gray-400 font-semibold mb-6">Review submitted registrations and approve internships.</p> {/* Card subtext description guidelines. */}
            </div> {/* Spacing wrappers close. */}
            {/* Link to /hr/applications styled as a small gold button with hover effects and rounded corners that looks beautiful. */}
            <Link to="/hr/applications" className="inline-block bg-[#C9A84C] hover:bg-[#B7963A] text-white text-[10px] font-extrabold uppercase tracking-widest text-center px-4 py-2 rounded-lg transition-colors border-0 shrink-0 cursor-pointer"> {/* Link redirections wrapper. */}
              Go to Applications {/* Caption label pointer. */}
            </Link> {/* Close redirect link. */}
          </div> {/* Close Card 1 block. */}
          {/* Card 2 — Evaluation Scores. */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-150 p-6 flex flex-col justify-between hover:border-[#C9A84C]/50 transition-colors"> {/* Card shape. */}
            <div className="mb-4"> {/* Spacing. */}
              <span className="text-xl mb-2 block">🏅</span> {/* Icon designator emoji. */}
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-2">Evaluation Scores</h3> {/* Card Title. */}
              <p className="text-xs text-gray-400 font-semibold mb-6">Review trainee performance scores and published results.</p> {/* Card subtext description guidelines. */}
            </div> {/* Spacing wrapper close. */}
            {/* Link to /hr/scores styled as a small gold button with hover effects. */}
            <Link to="/hr/scores" className="inline-block bg-[#C9A84C] hover:bg-[#B7963A] text-white text-[10px] font-extrabold uppercase tracking-widest text-center px-4 py-2 rounded-lg transition-colors border-0 shrink-0 cursor-pointer"> {/* Link. */}
              Go to Scores {/* Caption label pointer. */}
            </Link> {/* Close link. */}
          </div> {/* Close Card 2 block. */}
          {/* Card 3 — Intern Statistics. */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-150 p-6 flex flex-col justify-between hover:border-[#C9A84C]/50 transition-colors"> {/* Card shape. */}
            <div className="mb-4"> {/* Spacing. */}
              <span className="text-xl mb-2 block">📈</span> {/* Icon designator emoji. */}
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-2">Intern Statistics</h3> {/* Card Title. */}
              <p className="text-xs text-gray-400 font-semibold mb-6">View analytics and performance charts.</p> {/* Card subtext details instructions. */}
            </div> {/* Wrap close. */}
            {/* Link to /hr/statistics styled as a gold small button. */}
            <Link to="/hr/statistics" className="inline-block bg-[#C9A84C] hover:bg-[#B7963A] text-white text-[10px] font-extrabold uppercase tracking-widest text-center px-4 py-2 rounded-lg transition-colors border-0 shrink-0 cursor-pointer"> {/* Link. */}
              Go to Statistics {/* Caption. */}
            </Link> {/* Close link. */}
          </div> {/* Close Card 3 block. */}
        </div> {/* Close Quick operations layout grid block container. */}
        {/* SECTION TWO — Student Feedback viewer. */}
        <div className="mt-6 border-t border-gray-150 pt-8"> {/* Subsection anchor node. */}
          {/* Show a heading saying Student Feedback in Playfair Display charcoal xl margin bottom 12 pixels. */}
          <h3 className="text-xl font-black text-gray-800 font-serif mb-2 tracking-tight">Student Feedback</h3> {/* Section header block. */}
          {/* Show a paragraph saying Complaints and recommendations submitted by students in charcoal-light margin bottom 24 pixels. */}
          <p className="text-xs text-gray-400 font-semibold mb-6">Complaints and recommendations submitted by students</p> {/* Details guide label parameters. */}
          {/* Create a filter row with flex display gap 12 pixels margin bottom 20 pixels. */}
          <div className="flex flex-wrap items-center gap-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-150"> {/* Custom UI controls box. */}
            {/* Show a select for filterType parameter values matching complaints or recommendations checks. */}
            <select
              value={filterType} // Bind value onto filter state parameters.
              onChange={e => setFilterType(e.target.value)} // Handle selection updates events.
              className="border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C]" // Styling.
            > {/* Options selection drop maps. */}
              <option value="">All Types</option> {/* All Types default path. */}
              <option value="complaint">Complaint</option> {/* Complaint option with value complaint. */}
              <option value="recommendation">Recommendation</option> {/* Recommendation option with value recommendation. */}
            </select> {/* Close selection dropdown widget list. */}
            {/* Show a select for filterDepartment mappings checking target rotated department names. */}
            <select
              value={filterDepartment} // Bind value onto department filter state configurations.
              onChange={e => setFilterDepartment(e.target.value)} // Handle selection modifications.
              className="border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C]" // Styling.
            > {/* Drop options. */}
              <option value="">All Departments</option> {/* Option reflecting All Departments empty values fallback. */}
              <option value="Front Office">Front Office</option> {/* Specific rotation category. */}
              <option value="Housekeeping">Housekeeping</option> {/* Specific rotation category. */}
              <option value="Kitchen">Kitchen</option> {/* Specific rotation category. */}
              <option value="F&B Service">F&B Service</option> {/* Specific rotation category. */}
            </select> {/* Close select element card. */}
            {/* Show a button saying Clear Filters that sets both filter fields to empty string. */}
            <button
              onClick={() => { setFilterType(''); setFilterDepartment(''); }} // Reset options.
              className="bg-gray-250 hover:bg-gray-300 text-gray-700 text-xs font-bold px-4 py-1.5 rounded transition-colors cursor-pointer border-0" // Styling.
            > {/* Button. */}
              Clear Filters {/* Text. */}
            </button> {/* Close clear button widget component node. */}
          </div> {/* Close controls box mapping panels wrapper. */}
          {/* Show a small text saying showing filteredFeedbacks.length of feedbacks.length submissions in charcoal-light margin bottom 16 pixels. */}
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-4 select-none"> {/* Alignment div block. */}
            showing {filteredFeedbacks.length} of {feedbacks.length} submissions {/* Summary reports indicators metrics. */}
          </div> {/* Close div wrap. */}
          {/* Render our safely computed dynamic view contents. */}
          {feedbackContentBlock} {/* Mount the feedbackContent layout. */}
        </div> {/* Close Feedback subsection block framework container wrap. */}
      </div> {/* Close master wrap container coords list. */}
    </DashboardLayout> // Close layout.
  ); // Close elements layout.
}; // Close HRDashboard functional component scope.
export default HRDashboard; // Export HRDashboard component default.
