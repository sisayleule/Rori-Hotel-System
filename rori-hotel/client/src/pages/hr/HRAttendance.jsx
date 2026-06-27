// This page lets HR view all student attendance records filtered by department and date, manually correct records, and print department QR Codes.
import React, { useState, useEffect } from 'react'; // Import React core along with standard state and lifecycle hooks.
import { QRCodeSVG as QRCode } from 'qrcode.react'; // Import QRCode SVG component from qrcode.react library to render vector QR images.
import DashboardLayout from '../../components/DashboardLayout'; // Import parent responsive layout framework wrapper.
import api from '../../utils/api'; // Import configured Axios networking handler instance.
// Create the HRAttendance functional component.
const HRAttendance = () => { // Begin component definitions.
  // Declare reactive state variables.
  const [records, setRecords] = useState([]); // Stores all matched attendance items from database endpoint queries.
  const [departmentFilter, setDepartmentFilter] = useState(''); // Reactive filter string variable tracking chosen department specifications.
  const [dateFilter, setDateFilter] = useState(''); // Reactive filter string variable tracking chosen calendar date.
  const [loading, setLoading] = useState(true); // Track loading state for attendance data records.
  const [error, setError] = useState(''); // State string maintaining diagnostic error description parameters.
  const [editingId, setEditingId] = useState(null); // Hold active record identifier key matching row currently under manual correction.
  const [editClockIn, setEditClockIn] = useState(''); // Input form value holding modified morning arrival time configurations.
  const [editClockOut, setEditClockOut] = useState(''); // Input form value holding modified afternoon departure time configurations.
  const [saving, setSaving] = useState(false); // Flag indicating background execution while manual corrections publish.
  const [showQRModal, setShowQRModal] = useState(false); // Add a state variable called showQRModal with initial value false.
  const [qrTokens, setQrTokens] = useState([]); // Add a state variable called qrTokens with initial value empty array.
  // Helper routine constructing URL filters query parameter string.
  const buildQueryString = () => { // Begin helper routine definition.
    const sections = []; // Collect active parameter criteria in temporary array storing filter segments.
    if (departmentFilter !== '') { // If department filter is spec-selected.
      sections.push(`department=${encodeURIComponent(departmentFilter)}`); // Append formatted query string parameter key and value pairing.
    } // End check.
    if (dateFilter !== '') { // If a valid date filter has been inputted.
      sections.push(`date=${encodeURIComponent(dateFilter)}`); // Append formatted query string parameters calendar date constraint block.
    } // End check.
    if (sections.length > 0) { // Check if any query criteria variables were assembled.
      return `?${sections.join('&')}`; // Return parameters combined behind a leading question mark symbol.
    } // End check.
    return ''; // Return empty string if no options are set.
  }; // Close buildQueryString definition.
  // Mount useEffect trigger hooking into filter parameter variables.
  useEffect(() => { // Begin first effect definition.
    const fetchRecords = async () => { // Declare async retrieval routine fetchRecords executing data fetch queries.
      try { // Build defensive try-catch exceptions handler wrapper.
        setLoading(true); // Activate full screen loader interface overlay.
        const querySuffix = buildQueryString(); // Obtain query suffix code by executing helper build function.
        const response = await api.get(`/attendance${querySuffix}`); // Query server asking for matching attendance roster.
        setRecords(response.data); // Swap core records data parameters state on success.
      } catch (err) { // Trap errors.
        console.error('Attendance fetch error:', err); // Log diagnostic details to console.
        setError('could not load attendance records'); // Assign warning label.
      } finally { // Run finally operations.
        setLoading(false); // Terminate active pending load tickers.
      } // End try-catch block.
    }; // End fetchRecords routine.
    fetchRecords(); // Initialize record pull routine.
  }, [departmentFilter, dateFilter]); // Listen to filter switches.
  // Add a useEffect in HRAttendance that runs when showQRModal becomes true.
  useEffect(() => { // Begin modal status monitoring effect hook.
    const fetchQR = async () => { // Create async function fetchQR.
      if (showQRModal) { // When showQRModal becomes true.
        try { // Start safety try-catch block wrapper.
          const response = await api.get('/qr'); // Send GET to /qr inside server route files.
          setQrTokens(response.data || []); // Set qrTokens to response.data.
        } catch (err) { // Trap connection exceptions.
          console.error('Error fetching QR tokens database:', err); // Log diagnostic details.
          setError('Could not load QR tokens database entries'); // Set error descriptions warning.
        } // End check.
      } // End modal visible checks.
    }; // End fetchQR definition.
    fetchQR(); // Call the fetchQR subroutine.
  }, [showQRModal]); // Listen to showQRModal.
  // Declare asynchronous manual correction form submission handler.
  const handleSaveEdit = async () => { // Begin manual edits database writer method.
    try { // Wrap database modifications inside defensive try-catch traps.
      setSaving(true); // Turn on saving state properties to block keyboard collisions.
      const response = await api.put(`/attendance/${editingId}`, { // Dispatch PUT request containing corrections payload directly to specific endpoint.
        clockIn: editClockIn, // Bind manual clockIn.
        clockOut: editClockOut // Bind manual clockOut.
      }); // End PUT execution.
      setRecords(records.map(recordItem => recordItem._id === editingId ? response.data : recordItem)); // Iterate existing state array replacing updated elements safely.
      setEditingId(null); // De-authenticate edit status pointer.
    } catch (err) { // Trap connection exceptions.
      console.error('Error saving manual attendance edit:', err); // Log message.
      setError('failed to save correction'); // Supply informative notifications inside display warning boxes.
    } finally { // Terminate operations.
      setSaving(false); // Turn off active writing operations.
    } // End try-catch block.
  }; // End handleSaveEdit definition.
  // Build reactive elements markup tree structure.
  return ( // Open main JSX return block coordinates.
    // Wrap entire page layout components elements inside custom Dashboard layout frame structure.
    <DashboardLayout role="hr" pageTitle="Attendance"> {/* Open Layout Wrapper. */}
      {/* Outer wrapper frame setting spacing alignments */}
      <div className="flex flex-col gap-6 font-sans select-none"> {/* Master structural page chassis. */}
        {/* LAUNCHER PANEL: view department QR codes actions trigger banner bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-150 shadow-xs"> {/* Alignment div block. */}
          <div className="flex flex-col"> {/* Details column. */}
            <h2 className="text-xl font-black text-gray-800 tracking-tight font-serif mb-1">Attendance Manager</h2> {/* Category heading. */}
            <p className="text-xs text-gray-400 font-semibold mb-0">Track student rotative working hours and compile attendance lists.</p> {/* Indicator labels. */}
          </div> {/* Close details wrap. */}
          {/* Add a button in the HRAttendance page above the filter row saying View and Print QR Codes. onClick sets showQRModal to true. */}
          <button
            onClick={() => setShowQRModal(true)} // Toggle on showQRModal status on click.
            className="bg-[#C9A84C] hover:bg-[#B7963A] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg border-0 cursor-pointer transition-colors" // Style with gold.
          > {/* Trigger button node. */}
            View and Print QR Codes {/* Label caption. */}
          </button> {/* Close launcher button. */}
        </div> {/* Close banner bar panel. */}
        {/* SECTION ONE: Dynamic data filters layout frame row */}
        <div className="bg-white p-5 rounded-xl border border-gray-150 flex flex-wrap items-end gap-4 shadow-xs"> {/* Filters box wrapper shape. */}
          {/* Form select wrapping containers tracking department options selection */}
          <div className="flex flex-col gap-1.5 shrink-0 min-w-[200px]"> {/* Selection container. */}
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filter by Department</label> {/* Styled title label text and parameters description. */}
            {/* Interactive selection dropdown holding dynamic choices */}
            <select
              value={departmentFilter} // Bind reactive storage state.
              onChange={(e) => setDepartmentFilter(e.target.value)} // Mutate choices upon selecting options.
              className="border border-gray-300 rounded px-3 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all bg-white" // Styling rules.
            > {/* Menu wraps. */}
              <option value="">All Departments</option> {/* Fallback default value representing all departments option. */}
              <option value="Front Office">Front Office</option> {/* Support Front Office. */}
              <option value="Housekeeping">Housekeeping</option> {/* Support Housekeeping. */}
              <option value="Kitchen">Kitchen</option> {/* Support Kitchen. */}
              <option value="F&B Service">F&B Service</option> {/* Support F&B Service. */}
            </select> {/* Terminate select. */}
          </div> {/* Close select wrap. */}
          {/* Form input calendar wrapper tracking specific days */}
          <div className="flex flex-col gap-1.5 shrink-0 min-w-[180px]"> {/* Calendar container alignment block. */}
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filter by Date</label> {/* Display title descriptor heading in uppercase. */}
            <input
              type="date" // Use date formats inputs.
              value={dateFilter} // Bind local reactive date specifications.
              onChange={(e) => setDateFilter(e.target.value)} // Track choice changes.
              className="border border-gray-300 rounded px-3 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all bg-white" // Styling.
            /> {/* Close input element tag. */}
          </div> {/* Close input wrap. */}
          {/* Neutral reset button clearing choices back to baseline layouts parameters */}
          <button
            onClick={() => { setDepartmentFilter(''); setDateFilter(''); }} // Clear filters states coordinates.
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded px-4 py-2 hover:border-[#C9A84C] transition-all cursor-pointer h-[38px] shrink-0" // Styling rules.
          > {/* Reset buttons wrap. */}
            Clear Filters {/* Simple literal label texts. */}
          </button> {/* Close buttons. */}
        </div> {/* Close Section one panel wrapper. */}
        {/* SECTION TWO: Table viewport displaying matches or loading indicators */}
        <div className="flex flex-col gap-4"> {/* Inner records wrapper shape list. */}
          {loading && ( // Conditional block representing active page loader.
            <p className="text-center text-sm text-gray-400 font-medium py-12 bg-white rounded-xl border border-gray-150">Loading attendance records...</p> // Output text.
          )} {/* End loaders check. */}
          {!loading && error && ( // Conditional block rendering explicit error warning alerts boxes.
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 font-medium"> {/* Alert container. */}
              {error} {/* Print current warning strings. */}
            </div> // Close div.
          )} {/* End error check. */}
          {!loading && records.length === 0 && ( // Conditional fallback explaining empty matches directories collections.
            <div className="text-center text-sm text-gray-400 font-semibold py-12 bg-white rounded-xl border border-gray-150"> {/* Empty warning shape. */}
              No attendance records found for the selected filters. {/* Feedback instruction strings. */}
            </div> // Close div.
          )} {/* End empty checks. */}
          {!loading && records.length > 0 && ( // Render records container list only when collections items length exceeds zero.
            <div className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-xs"> {/* Data viewport card frame chassis. */}
              <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-150 flex items-center justify-between"> {/* Telemetry metadata block displaying total matches metrics. */}
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Showing {records.length} {records.length === 1 ? 'record' : 'records'}</span> {/* Visual count labels. */}
              </div> {/* Close table header logs status panel. */}
              <div className="overflow-x-auto"> {/* Responsive table block wrapper. */}
                <table className="w-full text-left border-collapse"> {/* Master grid tables chassis. */}
                  <thead> {/* Table headers defining columns categories layout mapping. */}
                    <tr className="bg-[#FAF6EC] border-b border-gray-150 select-none"> {/* Row frame wrapper. */}
                      <th className="p-4 text-xs font-extrabold text-[#C9A84C] uppercase tracking-wider">Student Name</th> {/* Columns name headings. */}
                      <th className="p-4 text-xs font-extrabold text-[#C9A84C] uppercase tracking-wider">Department</th> {/* Columns department headings. */}
                      <th className="p-4 text-xs font-extrabold text-[#C9A84C] uppercase tracking-wider">Date</th> {/* Columns date headings. */}
                      <th className="p-4 text-xs font-extrabold text-[#C9A84C] uppercase tracking-wider">Clock In</th> {/* Columns clockIn. */}
                      <th className="p-4 text-xs font-extrabold text-[#C9A84C] uppercase tracking-wider">Clock Out</th> {/* Columns clockOut. */}
                      <th className="p-4 text-xs font-extrabold text-[#C9A84C] uppercase tracking-wider">Status</th> {/* Columns status badges. */}
                      <th className="p-4 text-sm font-extrabold text-[#C9A84C] text-right uppercase tracking-wider">Action</th> {/* Columns actions editing. */}
                    </tr> {/* Close headers rows frame. */}
                  </thead> {/* Close head details. */}
                  <tbody className="divide-y divide-gray-100"> {/* Table body generating looping rows. */}
                    {records.map((record) => { // Map array student attendance log items.
                      const matchRecordId = record._id; // Retrieve structural id from looped record document parameters.
                      const isEditingThisRow = editingId === matchRecordId; // Compute if this record is undergoing manual corrections editing.
                      const studentNameString = record.studentId && record.studentId.userId && record.studentId.userId.fullName // Safely resolve nested student account.
                        ? record.studentId.userId.fullName // Extract.
                        : "Unknown Student"; // Simple human literal string representation fallback.
                      if (isEditingThisRow) { // Conditionally choose row markup based on editing toggles.
                        return ( // Return interactive correction edit row parameters template representation.
                          <tr key={matchRecordId} className="bg-[#FAF9F6]/50"> {/* Row container body. */}
                            <td className="p-4 text-sm font-bold text-gray-800">{studentNameString}</td> {/* Student cell name details. */}
                            <td className="p-4 text-sm text-gray-600">{record.department}</td> {/* Student cell department. */}
                            <td className="p-4 text-sm text-gray-600">{record.date}</td> {/* Student date. */}
                            <td className="p-4 text-sm"> {/* Inputs container. */}
                              <input
                                type="time" // Specific hour format.
                                value={editClockIn} // Bind modified value.
                                onChange={(e) => setEditClockIn(e.target.value)} // Update typed changes.
                                className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]" // Styling.
                              /> {/* Input. */}
                            </td> {/* Exit cell. */}
                            <td className="p-4 text-sm"> {/* Output cells. */}
                              <input
                                type="time" // Specific hour format.
                                value={editClockOut} // Bind modified value.
                                onChange={(e) => setEditClockOut(e.target.value)} // Update typed changes.
                                className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]" // Styling.
                              /> {/* Input. */}
                            </td> {/* Exit cell. */}
                            <td className="p-4 text-xs font-semibold text-gray-400">Editing...</td> {/* Editor status banner indicators. */}
                            <td className="p-4 text-sm text-right"> {/* Operations interfaces buttons cells. */}
                              <div className="flex justify-end gap-2 items-center"> {/* Container flex row. */}
                                <button
                                  onClick={handleSaveEdit} // Trigger database manual corrections update.
                                  disabled={saving} // Lock button properties during execution.
                                  className="bg-[#C9A84C] hover:bg-[#B7963A] disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-all cursor-pointer border-0" // Style.
                                > {/* Interactive button. */}
                                  {saving ? 'Saving' : 'Save'} {/* Dynamic textual update while saving. */}
                                </button> {/* Close write buttons. */}
                                <button
                                  onClick={() => setEditingId(null)} // Restore idle state cancelling actions on click.
                                  className="border border-gray-300 hover:bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-all cursor-pointer" // Style.
                                > {/* Interactive cancel button. */}
                                  Cancel {/* Caption. */}
                                </button> {/* Close cancel. */}
                              </div> {/* Close block container alignment. */}
                            </td> {/* Close row actions td. */}
                          </tr> // Close row.
                        ); // End editing state templates render blocks.
                      } // Close nested check validations.
                      return ( // Return standard display-only row values when idle.
                        <tr key={matchRecordId} className="hover:bg-gray-50/50 transition-colors duration-100"> {/* Row frame wrapper. */}
                          <td className="p-4 text-sm font-bold text-gray-800">{studentNameString}</td> {/* Student full name cell display string. */}
                          <td className="p-4 text-sm text-gray-600">{record.department}</td> {/* Intern assigned hotel department cell display string. */}
                          <td className="p-4 text-sm text-gray-600">{record.date}</td> {/* Formatted calendar dates cell display string. */}
                          <td className="p-4 text-sm text-gray-600 font-semibold">{record.clockIn || '—'}</td> {/* Arrival clock log details cell display string. */}
                          <td className="p-4 text-sm text-gray-600 font-semibold">{record.clockOut || '—'}</td> {/* Departure clock log details cell display string. */}
                          <td className="p-4 text-xs"> {/* Badge layout visualizing status categories. */}
                            {record.clockIn ? ( // Check late arrival evaluate flags if clockIn logs exist.
                              record.isLate ? ( // Match boolean late attributes.
                                <span className="bg-yellow-50 text-yellow-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-yellow-100">Late</span> // Render warning badge.
                              ) : ( // Else not late.
                                <span className="bg-green-50 text-green-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-green-100">On Time</span> // Render on-time success badge.
                              ) // Outer evaluate block.
                            ) : ( // Absent.
                              <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-red-100">Absent</span> // Render absent threat indicator badge.
                            )} {/* End criteria block toggles. */}
                            {record.correctedByHR && ( // Render visual indicators when modified manually by admins.
                              <span className="text-[9px] text-gray-400 font-bold block mt-1 uppercase tracking-wider">corrected by HR</span> // Visual labels.
                            )} {/* Close indicators parameters flags checks. */}
                          </td> {/* Exit status display td. */}
                          <td className="p-4 text-sm text-right"> {/* Interactive action editing triggers cell layouts. */}
                            <button
                              onClick={() => { setEditingId(matchRecordId); setEditClockIn(record.clockIn || ''); setEditClockOut(record.clockOut || ''); }} // Persist target edit attributes upon click.
                              className="border border-gray-300 hover:border-[#C9A84C] text-[10px] font-bold text-gray-700 hover:text-[#C9A84C] uppercase tracking-widest px-3 py-1.5 rounded transition-all cursor-pointer bg-white" // Style with custom focus.
                            > {/* Action trigger editor button node templates. */}
                              Edit {/* Label. */}
                            </button> {/* Close edit actions button click controller widget. */}
                          </td> {/* Exit column cell. */}
                        </tr> // Close row tags.
                      ); // End display idle row layouts markup templates.
                    })} {/* Close mapping evaluations loops block. */}
                  </tbody> {/* Terminate table content wrapper. */}
                </table> {/* Terminate tabular layout. */}
              </div> {/* Close overflow layouts wrapper. */}
            </div> // Close grid cards framework container.
          )} {/* Close conditional checked lists parameters. */}
        </div> {/* Close Section two content grid framework block container list. */}
        {/* Evaluate modal toggle views checking showQRModal flag setting */}
        {showQRModal && ( // If showQRModal is true show a modal overlay.
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"> {/* fixed inset 0 bg black at 50 percent opacity z 50 flex items center justify center. */}
            <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto font-sans flex flex-col gap-6"> {/* Inside the overlay show a white card max width 600 pixels width full rounded xl shadow padding 32 pixels. */}
              <div> {/* Details content headings. */}
                <h3 className="text-xl font-black text-gray-800 font-serif mb-1 tracking-tight">Department QR Codes</h3> {/* Show a heading saying Department QR Codes in charcoal Playfair Display xl margin bottom 8 pixels. */}
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">Print these codes and attach one at each department entrance. Students scan them to record attendance</p> {/* Show a paragraph saying instructions in charcoal-light margin bottom 24 pixels. */}
              </div> {/* Close headings sections structure. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-2 print:grid-cols-2"> {/* Create a grid with 2 columns gap 24 pixels. */}
                {qrTokens.map(tokenItem => ( // Loop through qrTokens.
                  <div key={tokenItem._id} className="bg-white border border-gray-200 rounded-xl p-5 text-center flex flex-col items-center justify-center shadow-xs"> {/* For each token create a card with white background border rounded padding 20 pixels text centered. */}
                    <span className="text-sm font-bold text-gray-800 block mb-3 uppercase tracking-wider font-serif">{tokenItem.department}</span> {/* Show the department name in charcoal font weight 600 margin bottom 12 pixels. */}
                    <div className="border border-gray-100 p-2.5 rounded-lg bg-gray-50 mb-2"> {/* Container surrounding canvas graphics components. */}
                      <QRCode // Show a QRCode component with value set to http://localhost:3000/attend?token= followed by the token.token field. Set size to 150.
                        value={`https://${window.location.host}/attend?token=${tokenItem.token}`} // Bind target scans URL parameter values. Note that host is dynamic for AI Studio routing.
                        size={150} // Set size to 150.
                        level="H" // Set high density error correction rules.
                        includeMargin={false} // Disable margin padding frame grids inside code graphics.
                      /> {/* Close QRCode components canvas renderer element tag. */}
                      {/* Note: the QRCode component generates the actual QR image. */}
                    </div> {/* Close QR wrapping container box alignment block. */}
                    <span className="text-[9px] text-gray-400 font-black block uppercase tracking-widest select-all select-none mt-2">Token: {tokenItem.token.slice(0, 8)}...</span> {/* Visual subtexts token tracker values block. */}
                  </div> // Close card template block coords listings.
                ))} {/* Terminate department loop cards mappings maps list structures. */}
              </div> {/* Close responsive grid wrapper coordinate channels block lists. */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5 print:hidden"> {/* Action trigger print/close panels coordinates wrapper. */}
                <button
                  onClick={() => window.print()} // Show a Print button below the grid that calls window.print.
                  className="bg-[#C9A84C] hover:bg-[#B7963A] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg cursor-pointer transition-colors border-0" // Style with gold background charcoal text padding rounded.
                > {/* Print buttons triggers. */}
                  Print QR Codes {/* Label caption. */}
                </button> {/* Close print widgets. */}
                <button
                  onClick={() => setShowQRModal(false)} // Show a Close button that sets showQRModal to false.
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg cursor-pointer transition-colors focus:ring-1 focus:ring-gray-400 font-serif" // Style with charcoal border charcoal text padding rounded.
                > {/* Close actions coordinate buttons. */}
                  Close {/* Label caption. */}
                </button> {/* Close modal widgets button trigger. */}
              </div> {/* Close actions layout. */}
            </div> {/* Close modal body layout. */}
          </div> // Close overlays frame wrap.
        )} {/* Terminate conditional modal display. */}
      </div> {/* Close master wrap container. */}
    </DashboardLayout> // Close layout.
  ); // Close elements layout.
}; // Close HRAttendance functional component scope.
export default HRAttendance; // Export HRAttendance view default.
