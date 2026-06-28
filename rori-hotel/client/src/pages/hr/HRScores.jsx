// This page shows HR all supervisor evaluation scores for a selected approved student.
import React, { useState, useEffect } from 'react'; // Import React along with basic hooks variables.
import DashboardLayout from '../../components/DashboardLayout'; // Import parent responsive layout framework wrapper.
import api from '../../utils/api'; // Import configured Axios networking handler instance.

// Create the HRScores functional component.
const HRScores = () => {
  // Reactive list storing approved students query outputs.
  const [students, setStudents] = useState([]); // Stores all active approved candidates.
  // Track selected student database identification string key.
  const [selectedStudentId, setSelectedStudentId] = useState(''); // Selected ID in select dropdown.
  // Reactive state containing scores logs and metrics from database queries.
  const [scoresData, setScoresData] = useState(null); // Holds scores list, average, and final result record.
  // Reactive state containing pre-filled or edited department comments compilation lists.
  const [departmentFeedback, setDepartmentFeedback] = useState([
    { department: "Front Office", comments: "" }, // Entry for Front Office rotation.
    { department: "Housekeeping", comments: "" }, // Entry for Housekeeping rotation.
    { department: "Kitchen", comments: "" }, // Entry for Kitchen rotation.
    { department: "F&B Service", comments: "" } // Entry for F&B Service rotation.
  ]);
  // Input form value holding compiled general HR manager recommendations comments.
  const [hrGeneralActivityComments, setHrGeneralActivityComments] = useState(''); // Character remarks value.
  // State indicating background student list loading state.
  const [loadingStudents, setLoadingStudents] = useState(true); // Default loading true.
  // State indicating active selected student evaluation scores query loaders.
  const [loadingScores, setLoadingScores] = useState(false); // Default false.
  // State monitoring background publishing operations.
  const [submittingResult, setSubmittingResult] = useState(false); // Disable form submittals during writes.
  // State monitoring certificate regeneration operations.
  const [regeneratingCert, setRegeneratingCert] = useState(false); // Disable regenerate button during API call.
  // String state containing backend transaction error descriptions.
  const [error, setError] = useState(''); // Diagnostic error alert flag.
  // String state maintaining successful transaction alerts.
  const [success, setSuccess] = useState(''); // Form success alert flag.

  // Run a useEffect on mount to pull all approved students for selector dropdown.
  useEffect(() => {
    // Declare async function to query student files.
    const fetchApprovedStudents = async () => {
      // Implement protective try-catch loop wrapper.
      try {
        // Activate full screen loader interface overlay.
        setLoadingStudents(true); // Toggle loader true.
        // Retrieve whole applications ledger.
        const response = await api.get('/applications'); // Execute GET API.
        // Filter application records on frontend to exclusively keep approved interns.
        const approvedOnly = response.data.filter(appItem => appItem.status === 'approved'); // Apply filter.
        // Hydrate local selection array list state.
        setStudents(approvedOnly); // Save filtered list.
      } catch (err) {
        // Feed warnings onto diagnostic state string.
        setError('failed to load approved student list'); // Display warning labels.
      } finally {
        // Turn off active spinners.
        setLoadingStudents(false); // Toggle loader off.
      }
    };
    // Initialize student file retriever.
    fetchApprovedStudents(); // Execute call.
  }, []); // Run exactly once on mount.

  // Monitor selected student switches to load evaluations logs dynamically.
  useEffect(() => {
    // Check if the selection dropdown represents an empty fallback.
    if (!selectedStudentId) {
      // Reset scores logs state.
      setScoresData(null); // De-populate reviews records.
      // Re-establish pristine department comments draft objects.
      setDepartmentFeedback([
        { department: "Front Office", comments: "" },
        { department: "Housekeeping", comments: "" },
        { department: "Kitchen", comments: "" },
        { department: "F&B Service", comments: "" }
      ]);
      // Clear general remarks text box buffers.
      setHrGeneralActivityComments(''); // Clear inputs.
      // Clear alert banners state.
      setSuccess(''); // Reset success text.
      // Halt logic cascade.
      return; // Stop.
    }
    // Declare async query scores history routine.
    const fetchScores = async () => {
      // Apply try catch safety boundaries.
      try {
        // Clear old alert messages.
        setSuccess(''); // Reset static flags.
        setError(''); // Reset error traces.
        // Turn on loading indicator.
        setLoadingScores(true); // Toggle loader true.
        // Dispatch request requesting student evaluations overview metrics.
        const response = await api.get(`/scores/student/${selectedStudentId}`); // Initiate HTTP GET call.
        // Map resolved data onto local state object.
        setScoresData(response.data); // Save results.
        
        // Assemble matching supervisor draft comments.
        const scoresList = response.data.scores || []; // Retain array safely.
        // Build updated template comments mirroring supervisor comments if available.
        const updatedFeedback = [
          { department: "Front Office", comments: "" },
          { department: "Housekeeping", comments: "" },
          { department: "Kitchen", comments: "" },
          { department: "F&B Service", comments: "" }
        ].map(item => {
          // Look up if any score document matches this department.
          const matchedDeptScore = scoresList.find(scoreDoc => scoreDoc.department === item.department);
          // Return item enriched with supervisor remarks if found.
          return {
            department: item.department, // Preserve department label.
            comments: matchedDeptScore && matchedDeptScore.comments ? matchedDeptScore.comments : "" // Assign supervisor notes.
          };
        });
        // Populate tracking feedback state arrays with synchronized remarks.
        setDepartmentFeedback(updatedFeedback); // Save comments profiles.

        // If a published final result already exists.
        if (response.data.finalResult) {
          // Load published general feedback comments in edit box.
          setHrGeneralActivityComments(response.data.finalResult.hrGeneralFeedback || ''); // Populate input.
          // Populate department feedbacks from stored outputs if matching list matches.
          if (Array.isArray(response.data.finalResult.departmentFeedback)) {
            // Overwrite feedback layout comments details.
            setDepartmentFeedback(response.data.finalResult.departmentFeedback); // Save values.
          }
        }
      } catch (err) {
        // Record communications exceptions.
        setError('could not load scores detailed data'); // Set error message.
      } finally {
        // Toggle off active loading trackers.
        setLoadingScores(false); // Toggle loader off.
      }
    };
    // Initialize.
    fetchScores(); // Run fetch routine.
  }, [selectedStudentId]); // Register dependency tracking hook.

  // Handler making adjustments for specific department comments fields inside loop.
  const handleFeedbackChange = (index, commentsValue) => {
    // Copy the existing draft comment map array.
    const updated = [...departmentFeedback]; // Duplicate array list.
    // Modify target item comments string.
    updated[index].comments = commentsValue; // Update value.
    // Mutate reactive draft states.
    setDepartmentFeedback(updated); // Save update.
  };

  // Declare asynchronous publish results execution handler.
  const handlePublish = async () => {
    // Wrap database write tasks inside safety parameters.
    try {
      // Clear alert banners before triggering.
      setError(''); // Clear error.
      setSuccess(''); // Clear success.
      // Flag background writing block state.
      setSubmittingResult(true); // Inhibit clicking.
      // Dispatch results compilations payload directly onto target endpoint.
      await api.post(`/scores/results/${selectedStudentId}`, {
        departmentFeedback: departmentFeedback, // Pass compiled department comments.
        hrGeneralFeedback: hrGeneralActivityComments // Pass HR general comments.
      });
      // Set success feedback notices labels.
      setSuccess('Result compiled and published successfully!'); // Assign alerts.
      // Re-query database to obtain latest updated status locking fields.
      const response = await api.get(`/scores/student/${selectedStudentId}`); // Initiate GET.
      // Refresh scores statistics parameters.
      setScoresData(response.data); // Hydrate local state list.
    } catch (err) {
      // Extract available error explanations.
      const alertMsg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'failed to publish compiled result'; // Fallback text.
      // Push string onto error logs state.
      setError(alertMsg); // Populate alerts.
    } finally {
      // Toggle off active sending operations.
      setSubmittingResult(false); // Enable interactive widgets.
    }
  };

  // Declare asynchronous certificate regeneration handler.
  const handleRegenerateCertificate = async () => {
    // Wrap API call in try-catch for error handling.
    try {
      // Clear previous alerts.
      setError(''); // Clear error.
      setSuccess(''); // Clear success.
      // Set regenerating state to disable button.
      setRegeneratingCert(true); // Disable button.
      // Call regenerate certificate API endpoint.
      await api.post(`/results/${selectedStudentId}/regenerate-certificate`);
      // Show success message.
      setSuccess('Certificate regenerated successfully! Student can now download it.'); // Success alert.
    } catch (err) {
      // Extract error message from response.
      const alertMsg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Failed to regenerate certificate'; // Fallback text.
      // Set error state.
      setError(alertMsg); // Error alert.
    } finally {
      // Re-enable button.
      setRegeneratingCert(false); // Enable button.
    }
  };

  // Assemble visual template layouts markup.
  return (
    // Wrap whole page coordinates within standard layout.
    <DashboardLayout role="hr" pageTitle="Scores & Evaluation">
      {/* Outer grid layout container */}
      <div className="flex flex-col gap-6 font-sans select-none pb-12">
        
        {/* SECTION ONE: Approved Student Selection card layout container */}
        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex flex-col gap-3">
          {/* Label Title text descriptions in uppercase */}
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Select Student Intern</h3>
          {/* Main selection input dropdown list wrapper */}
          <div className="flex items-center gap-4 max-w-md">
            {/* Conditional checks showing student loader status */}
            {loadingStudents ? (
              // Print loading information notifications.
              <p className="text-xs text-gray-500 font-semibold">Loading student directory...</p>
            ) : (
              // Deploy custom select box layout.
              <select
                value={selectedStudentId} // Bind active student tracking key.
                onChange={(e) => setSelectedStudentId(e.target.value)} // Handle selection events.
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all bg-white"
              >
                {/* Visual empty picker prompt item */}
                <option value="">Select a student...</option>
                {/* Loop approved students list files rendering items */}
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {/* Access deep populated user fullName metadata descriptors */}
                    {student.userId && student.userId.fullName ? student.userId.fullName : 'Academic Intern'} ({student.universityName || 'University'})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Diagnostic alert message blocks wrapper */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 font-medium">
            {error} {/* Outputs warning label messages */}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 text-sm p-4 rounded-xl border border-green-100 font-medium">
            {success} {/* Print success notifications */}
          </div>
        )}

        {/* SECTION TWO: Details evaluation scores pane rendered once student exists */}
        {!selectedStudentId ? (
          // Center baseline placeholder alignment.
          <div className="text-center text-sm text-gray-400 font-semibold py-12 bg-white rounded-xl border border-gray-150">
            Please select a student intern from the list to view their evaluations.
          </div>
        ) : (
          // Render data subviews panel.
          <div className="flex flex-col gap-6">
            {/* Conditional check reflecting scores loader activities */}
            {loadingScores && (
              <p className="text-center text-sm text-gray-400 font-medium py-12 bg-white rounded-xl border border-gray-150">Loading evaluation criteria scores...</p>
            )}

            {/* Print scores dashboard layout after information resolves */}
            {!loadingScores && scoresData && (
              <div className="flex flex-col gap-6">
                
                {/* Heading indicator row */}
                <div className="flex items-center justify-between">
                  {/* Headline descriptor tag titles */}
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Department Rotations Evaluations</h4>
                </div>

                {/* Score Cards Grid layout dividing columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Map through the four rigid target hotel department rotation categories */}
                  {['Front Office', 'Housekeeping', 'Kitchen', 'F&B Service'].map((deptName) => {
                    // Search if score record exists in scores array.
                    const matchedScore = scoresData.scores.find(s => s.department === deptName); // Locate matched documents.
                    // Choose rendering design depending on existence of scores records.
                    if (matchedScore) {
                      return (
                        <div key={deptName} className="bg-white p-5 rounded-xl border-l-4 border-green-500 border border-gray-150 shadow-xs flex flex-col gap-3 justify-between">
                          {/* Top header details container */}
                          <div>
                            {/* Department name label title */}
                            <div className="text-xs font-extrabold text-[#C9A84C] uppercase tracking-wider">{deptName}</div>
                            {/* Supervisor Name details indicator block */}
                            <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                              By: {matchedScore.supervisorId && matchedScore.supervisorId.fullName ? matchedScore.supervisorId.fullName : 'Supervisor'}
                            </div>
                          </div>
                          {/* Score Numeric index indicator */}
                          <div className="text-2xl font-black text-gray-800 font-serif my-1">
                            {matchedScore.score} <span className="text-xs text-gray-400 font-sans font-normal">/ 100</span>
                          </div>
                          {/* Inner supervisor feedback comments lines */}
                          <p className="text-xs text-gray-500 italic mt-1 line-clamp-3 bg-gray-50/50 p-2 rounded border border-gray-100">
                            "{matchedScore.comments || 'No written comment details logged.'}"
                          </p>
                        </div>
                      );
                    }

                    // Return Pending evaluations design layout.
                    return (
                      <div key={deptName} className="bg-white p-5 rounded-xl border-l-4 border-gray-300 border border-gray-150 shadow-xs flex flex-col gap-3 justify-between">
                        {/* Header details */}
                        <div>
                          {/* Department labels */}
                          <div className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">{deptName}</div>
                          {/* Role subtitle descriptions */}
                          <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">Department Rotation</div>
                        </div>
                        {/* Empty pending badge markup indicator */}
                        <div className="my-2">
                          <span className="bg-yellow-50 text-yellow-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-yellow-100 select-none">
                            Pending
                          </span>
                        </div>
                        {/* Brief explanation */}
                        <p className="text-[11px] text-gray-400 font-normal">
                          Waiting for department supervisor to submit evaluation.
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* SECTION THREE: Results compiler form or published statistics */}
                <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-xs select-none">
                  {/* Conditional logic evaluating pending supervisor grading statuses */}
                  {!scoresData.allSubmitted ? (
                    // Incomplete block panel layout alerting users to pending submissions.
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      {/* Detailed explanatory warnings statement */}
                      <p className="text-sm text-gray-500 font-semibold mb-2">Evaluations compilation currently locked</p>
                      <p className="text-xs text-gray-400 max-w-md">
                        Please ensure all four department supervisors have logged and locked their evaluations. Currently, only {scoresData.scores.length} out of 4 ratings are recorded.
                      </p>
                    </div>
                  ) : (
                    // Yield compiler results console.
                    <div className="flex flex-col gap-6">
                      
                      {/* Overall Compiled statistics presentation banners */}
                      <div className="bg-[#FAF6EC] p-5 rounded-xl border border-gray-150 flex flex-wrap items-center justify-between gap-4">
                        {/* Left statistics display layout wrapper heading */}
                        <div>
                          {/* Score subtitle descriptors in gold */}
                          <div className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-1 select-none">Internship Score</div>
                          {/* Bold Average Grade presentation */}
                          <div className="text-3xl font-black text-gray-850 font-serif">
                            {scoresData.averageScore} <span className="text-sm text-gray-500 font-sans font-normal">overall average rating</span>
                          </div>
                        </div>
                        {/* Right best department highlighter tag */}
                        {scoresData.finalResult && scoresData.finalResult.isPublished && (
                          <div className="bg-[#white] px-4 py-2 rounded-lg border border-[#C9A84C]/30 select-none">
                            <span className="text-[9px] text-[#C9A84C] uppercase tracking-widest font-extrabold block">Top Specialization</span>
                            <span className="text-xs font-extrabold text-gray-800 font-sans uppercase">
                              {scoresData.finalResult.bestDepartment || 'General Specialization'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Decide rendering paths based on publication checkpoints */}
                      {scoresData.finalResult && scoresData.finalResult.isPublished ? (
                        // READ ONLY: Render published summary block layout.
                        <div className="flex flex-col gap-6 border-t border-gray-150 pt-6">
                          {/* Success publication check status labels */}
                          <div className="flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                              {/* Checkmark circle graphic vectors */}
                              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                                <span className="text-white text-xs font-bold">✓</span>
                              </div>
                              {/* Publication validation notice */}
                              <span className="text-sm font-bold text-green-600 uppercase tracking-wider select-none">
                                Final Result Published & Shared with Student
                              </span>
                            </div>
                            {/* Regenerate Certificate Button */}
                            <button
                              onClick={handleRegenerateCertificate}
                              disabled={regeneratingCert}
                              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg transition-colors border-0 cursor-pointer shadow-sm flex items-center gap-2"
                            >
                              {regeneratingCert ? (
                                <>
                                  <span className="animate-spin">⟳</span>
                                  <span>Regenerating...</span>
                                </>
                              ) : (
                                <>
                                  <span>🔄</span>
                                  <span>Regenerate Certificate</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Render compiled comments overview log sheets */}
                          <div className="flex flex-col gap-4">
                            {/* Title labels */}
                            <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Department Rotation Summaries Shared</h5>
                            {/* Loop published feedbacks */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {scoresData.finalResult.departmentFeedback.map((f, i) => (
                                <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-150">
                                  {/* Department labels */}
                                  <div className="text-xs font-bold text-gray-700 uppercase">{f.department}</div>
                                  {/* Feedback comments */}
                                  <p className="text-xs text-gray-500 mt-2 leading-relaxed italic">
                                    "{f.comments || 'No specialized remarks recorded.'}"
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* HR General Comments Shared view log box */}
                          <div className="flex flex-col gap-2 pt-2">
                            {/* Display titles */}
                            <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest">HR General Recommendation</h5>
                            {/* General compiled comments blocks */}
                            <p className="p-4 rounded-xl bg-gray-50 border border-gray-150 text-xs text-gray-600 leading-relaxed italic whitespace-pre-wrap">
                              "{scoresData.finalResult.hrGeneralFeedback || 'No compiled comments submitted.'}"
                            </p>
                          </div>
                        </div>
                      ) : (
                        // INTERACTIVE BUILDER: Render editable form allowing rating publishing.
                        <div className="flex flex-col gap-6 border-t border-gray-150 pt-6">
                          {/* Subheading titles */}
                          <h4 className="text-sm font-bold text-gray-850 uppercase tracking-wider font-serif">Compile Final Feedback Report</h4>

                          {/* Input groups compiling department rotation feedback remarks */}
                          <div className="flex flex-col gap-4">
                            {/* Text labels instructions */}
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Rotation Feedback Notes:</label>
                            {/* Grid aligning input blocks */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {departmentFeedback.map((item, index) => (
                                <div key={item.department} className="flex flex-col gap-1.5 p-4 rounded-xl bg-gray-50/50 border border-gray-150">
                                  {/* Department description labels */}
                                  <span className="text-xs font-bold text-gray-700 uppercase">{item.department}</span>
                                  {/* Textbox capture typing comments */}
                                  <input
                                    type="text" // Input field.
                                    value={item.comments} // Value binder.
                                    onChange={(e) => handleFeedbackChange(index, e.target.value)} // Update typed letter changes.
                                    placeholder={`Enter tailored remarks for ${item.department} rotation...`} // Picker guides.
                                    className="border border-gray-350 rounded px-3 py-2 text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Textarea capturing overall human resources reviews feedback */}
                          <div className="flex flex-col gap-1.5 mt-2">
                            {/* Subtitle instructions headings */}
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">General HR recommendation </label>
                            {/* Narrative comments textareas node */}
                            <textarea
                              value={hrGeneralActivityComments} // Form variable link.
                              onChange={(e) => setHrGeneralActivityComments(e.target.value)} // Mutate reactive text keys.
                              rows={4} // Sizing bounds.
                              placeholder="Describe student's compliance with hotel standards, professionalism, dress code, behavior, and final recommendations..." // Placeholder tutorial.
                              className="w-full text-xs text-gray-800 border border-gray-350 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all"
                            />
                          </div>

                          {/* Complete action block launching results onto student accounts */}
                          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                            {/* Submit and compile button executing publish calls */}
                            <button
                              onClick={handlePublish} // Invoke publishing sequences.
                              disabled={submittingResult} // Disable interactions while loading.
                              className="bg-[#C9A84C] hover:bg-[#B7963A] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-lg transition-colors border-0 cursor-pointer shadow-sm"
                            >
                              {/* Swapping titles dynamically */}
                              {submittingResult ? 'Publishing...' : 'Compile & Publish Result'}
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default HRScores; // Export HRScores view default.
