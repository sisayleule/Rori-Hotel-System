// This page is used by all 4 department supervisors. The system automatically shows only the students assigned to their department based on their login role.
import React, { useState, useEffect } from 'react'; // Import React standard hooks such as state and effects.
import { useAuth } from '../../context/AuthContext'; // Import custom AuthContext to read supervisor credentials.
import DashboardLayout from '../../components/DashboardLayout'; // Import primary responsive layout wrapper framework.
import api from '../../utils/api'; // Import central configured Axios API router helper module.
// Create the functional component named SupervisorDashboard.
const SupervisorDashboard = () => { // Begin component definitions.
  const { user } = useAuth(); // Get user from useAuth. We use the role to display which department this supervisor manages.
  // Create these state variables with comments explaining each purpose in full.
  const [department, setDepartment] = useState(''); // empty string — the department name this supervisor manages.
  const [students, setStudents] = useState([]); // empty array — list of students assigned to this department.
  const [scoreForm, setScoreForm] = useState({}); // initial value an empty object — stores the score and comments being entered for each student keyed by student id.
  const [submitting, setSubmitting] = useState({}); // initial value an empty object — tracks which student's score is being submitted keyed by student id.
  const [submitSuccess, setSubmitSuccess] = useState({}); // initial value an empty object — tracks which students have been successfully scored keyed by student id.
  const [loading, setLoading] = useState(true); // true by default when component mounts to database layer.
  const [error, setError] = useState(''); // empty string to catch and display backend exception details.
  // Add a useEffect that runs once on mount to fetch departmental active candidates.
  useEffect(() => { // Begin effect definition.
    const fetchMyStudents = async () => { // Create async function fetchMyStudents.
      try { // Start safety try block wrapper.
        setLoading(true); // Toggle on page loaders indicator.
        setError(''); // Reset error reporting trackers.
        const response = await api.get('/scores/my-students'); // Send GET to /scores/my-students using api.
        setDepartment(response.data.department || ''); // Set department to response.data.department.
        const studentList = response.data.students || []; // Create working handle for student list.
        setStudents(studentList); // Set students to response.data.students.
        const initialForm = {}; // Initialize the scoreForm object.
        studentList.forEach(item => { // Loop through the returned students directory.
          if (item.studentData && !item.scoreSubmitted) { // For each student that has scoreSubmitted as false.
            initialForm[item.studentData._id] = { // Create an entry in the scoreForm object using the student underscore id as the key.
              score: '', // Overall score (calculated automatically from sub-scores).
              technicalSkills: '', // Sub-score for technical skills.
              communication: '', // Sub-score for communication.
              teamwork: '', // Sub-score for teamwork.
              professionalism: '', // Sub-score for professionalism.
              comments: '' // General comments field.
            }; // Close form initialization object.
          } // End condition block checks.
        }); // End array loop operations.
        setScoreForm(initialForm); // Save generated defaults mapping onto scoreForm hook.
      } catch (err) { // Trap connection exceptions.
        console.error('Error fetching department students:', err); // Log diagnostic tracers.
        setError('could not load your students please refresh'); // Set error to could not load your students please refresh.
      } finally { // Finalize operations.
        setLoading(false); // Toggle off active page loading spinner variable.
      } // End try-catch block.
    }; // End fetchMyStudents helper.
    fetchMyStudents(); // Call fetchMyStudents.
  }, []); // Run exact single mount routine.
  // Create a function called handleFormChange to update state properties.
  const handleFormChange = (studentId, field, value) => { // Accept studentId, field, and value as arguments.
    const newForm = { ...scoreForm }; // Create a new copy of the scoreForm object using spread operator.
    const currentStudentForm = newForm[studentId] || { score: '', technicalSkills: '', communication: '', teamwork: '', professionalism: '', comments: '' }; // Retrieve nested object or assign defaults with all sub-scores.
    newForm[studentId] = { ...currentStudentForm, [field]: value }; // Update the nested object at studentId by spreading its current value and setting the given field to value.
    setScoreForm(newForm); // Set scoreForm to the new object.
  }; // Close handleFormChange method.
  // Create an async function called handleSubmitScore.
  const handleSubmitScore = async (studentId) => { // Accept studentId as an argument.
    const formData = scoreForm[studentId] || { score: '', technicalSkills: '', communication: '', teamwork: '', professionalism: '', comments: '' }; // Inside get the form data for this student from scoreForm using studentId. Store in a variable called formData.
    
    // Validate that all 4 sub-scores are provided (technical skills, communication, teamwork, professionalism).
    if (!formData.technicalSkills || !formData.communication || !formData.teamwork || !formData.professionalism) { // Check if any sub-score is empty.
      setError('please enter all 4 sub-scores (technical skills, communication, teamwork, professionalism)'); // Set error message.
      return; // Return and abort submission.
    } // End sub-scores validation.
    
    // Convert all sub-scores to numbers and validate they are between 0 and 100.
    const technicalSkills = Number(formData.technicalSkills); // Convert technical skills to number.
    const communication = Number(formData.communication); // Convert communication to number.
    const teamwork = Number(formData.teamwork); // Convert teamwork to number.
    const professionalism = Number(formData.professionalism); // Convert professionalism to number.
    
    // Validate all sub-scores are numbers and within 0-100 range.
    if (isNaN(technicalSkills) || technicalSkills < 0 || technicalSkills > 100) { // Validate technical skills.
      setError('technical skills score must be between 0 and 100'); // Set error.
      return; // Abort.
    } // Close validation.
    if (isNaN(communication) || communication < 0 || communication > 100) { // Validate communication.
      setError('communication score must be between 0 and 100'); // Set error.
      return; // Abort.
    } // Close validation.
    if (isNaN(teamwork) || teamwork < 0 || teamwork > 100) { // Validate teamwork.
      setError('teamwork score must be between 0 and 100'); // Set error.
      return; // Abort.
    } // Close validation.
    if (isNaN(professionalism) || professionalism < 0 || professionalism > 100) { // Validate professionalism.
      setError('professionalism score must be between 0 and 100'); // Set error.
      return; // Abort.
    } // Close validation.
    
    // Calculate overall score as average of 4 sub-scores.
    const overallScore = Number(((technicalSkills + communication + teamwork + professionalism) / 4).toFixed(1)); // Calculate average and round to 1 decimal.
    
    setError(''); // Clear error state to permit database write.
    setSubmitting(prev => ({ ...prev, [studentId]: true })); // Set submitting for this studentId to true by spreading the current submitting object and setting the studentId key to true.
    try { // Start safety try-catch block wrapper.
      await api.post('/scores', { // Send POST to /scores with body parameters.
        studentId: studentId, // Pass studentId key.
        score: overallScore, // Pass calculated overall score.
        technicalSkills: technicalSkills, // Pass technical skills sub-score.
        communication: communication, // Pass communication sub-score.
        teamwork: teamwork, // Pass teamwork sub-score.
        professionalism: professionalism, // Pass professionalism sub-score.
        comments: formData.comments // Pass comments from formData.
      }); // End POST transaction execution.
      setSubmitSuccess(prev => ({ ...prev, [studentId]: true })); // Set submitSuccess for this studentId to true.
      setStudents(prevStudents => // Update the students array by finding the student with this id and setting their scoreSubmitted field to true.
        prevStudents.map(item => { // Use map to create a new array.
          if (item.studentData && item.studentData._id === studentId) { // Check matching identification keys.
            return { ...item, scoreSubmitted: true }; // Return student with scoreSubmitted toggled true.
          } // Close nested check.
          return item; // Return unchanged elements directly.
        }) // End map mapping blocks.
      ); // End setStudents state modifier.
    } catch (err) { // Trap network glitches.
      console.error('Error submitting score:', err); // Print exception reports.
      setError('failed to submit score please try again'); // Set error to failed to submit score please try again.
    } finally { // Terminate operations flow.
      setSubmitting(prev => ({ ...prev, [studentId]: false })); // Set submitting for this studentId to false.
    } // End try-catch-finally block.
  }; // End handleSubmitScore.
  // Pre-calculate visual dashboards workspace cards list to totally prevent React JSX parenthesis compilation issues.
  let dashboardContent; // Define working display container.
  if (loading) { // If loading is active.
    dashboardContent = ( // Assign.
      <p className="text-center text-sm font-semibold text-gray-400 py-10 bg-white rounded-xl border border-gray-150" /* Active loader banner indicator */>Loading assigned interns...</p>
    ); // Close assignment.
  } else if (error && !students.length) { // If error occurs.
    dashboardContent = ( // Assign.
      <div className="p-4 bg-red-50 text-red-600 border border-red-150 rounded-xl font-medium text-sm mb-6" /* Error report wrap */>
        {error} {/* Print message. */}
      </div> // Close card wrapper.
    ); // Close assignment.
  } else { // Handle correct listings values mapping onto cards.
    dashboardContent = ( // Assign list content template structure.
      <div className="flex flex-col gap-6" /* Active grid boards canvas wrapper */>
        {error && ( // Simple inline alerts.
          <div className="p-4 bg-red-50 text-red-650 border border-red-100 rounded-xl text-xs font-bold leading-relaxed">{error}</div> // Label.
        )} {/* End inline alerts */}
        {/* SECTION ONE — Summary card. These are the general metrics counts. */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-150 p-6 flex flex-row items-center justify-around gap-6 select-none" /* Metrics totals panel */>
          <div className="text-center flex-1" /* Stat total students */>
            <span className="text-sm font-black text-gray-800 font-serif block text-2xl mb-1">{students.length}</span>
            <span className="text-[10px] text-gray-405 font-extrabold uppercase tracking-widest block">Total Students</span>
          </div> {/* Close item 1 wrapper. */}
          <div className="text-center flex-1 border-l border-gray-100" /* Stat scored students count values */>
            <span className="text-sm font-black text-green-650 font-serif block text-2xl mb-1">{students.filter(s => s.scoreSubmitted).length}</span>
            <span className="text-[10px] text-green-600 font-extrabold uppercase tracking-widest block">Scored</span>
          </div> {/* Close item 2 wrapper. */}
          <div className="text-center flex-1 border-l border-gray-100" /* Stat pending lists counter */>
            <span className="text-sm font-black text-[#C9A84C] font-serif block text-2xl mb-1">{students.filter(s => !s.scoreSubmitted).length}</span>
            <span className="text-[10px] text-[#C9A84C] font-extrabold uppercase tracking-widest block">Pending Score</span>
          </div> {/* Close item 3 wrapper. */}
        </div> {/* Close totals panel wrapper block. */}
        {/* SECTION TWO — Student cards. */}
        {students.length === 0 ? ( // If list is empty.
          <div className="text-center text-sm font-semibold text-gray-400 py-16 bg-white rounded-xl border border-gray-150 select-none" /* Status instructions label container */>
            No students are assigned to your department yet.
          </div> // Close description shape wrapper.
        ) : ( // Show the student profiles details.
          <div className="flex flex-col gap-4" /* List body chassis */>
            {students.map(item => { // Map array student records.
              const studentId = item.studentData ? item.studentData._id : ''; // Read ID.
              const isScored = item.scoreSubmitted; // Read status.
              const isScoredLocal = submitSuccess[studentId]; // Read local score successful state.
              const curForm = scoreForm[studentId] || { score: '', comments: '' }; // Get active inputs values.
              const isPendingSubmit = submitting[studentId]; // Get active pending loaders indicators.
              return ( // Return design card.
                <div key={studentId} className="bg-white rounded-xl shadow-xs border border-gray-150 p-6 flex flex-col lg:flex-row justify-between gap-6 font-sans select-none hover:border-[#C9A84C]/50 transition-colors" /* Candidate list entry row */>
                  <div className="flex-1 flex flex-row items-center gap-4" /* Left grouping data profile column wrap */>
                    {item.studentData && item.studentData.profilePhoto ? ( // Render image safely.
                      <img
                        src={item.studentData.profilePhoto.startsWith('http') ? item.studentData.profilePhoto : `${window.location.origin}/${item.studentData.profilePhoto}`}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                    ) : ( // Draw initial letter avatar.
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200" /* Circle design helper */>
                        <span className="text-sm font-black text-gray-400 uppercase" /* Caption initial letter icon */>
                          {item.studentData && item.studentData.userId && item.studentData.userId.fullName ? item.studentData.userId.fullName[0] : 'I'}
                        </span>
                      </div> // Close round circle structure.
                    )}
                    <div className="flex flex-col" /* Names alignments tags details */>
                      <span className="text-sm font-bold text-gray-800" /* Full name strings labels */>{item.studentData && item.studentData.userId ? item.studentData.userId.fullName : 'Academic Intern'}</span>
                      <span className="text-xs text-gray-400 font-medium" /* University details */>{item.studentData ? item.studentData.universityName : 'Partner University'}</span>
                      <div className="mt-1" /* Badges layout alignment wrap */>
                        <span className="bg-amber-50/50 text-[#C9A84C] border border-[#C9A84C]/20 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider inline-block" /* Department rotation codes */>
                          {item.studentData ? item.studentData.assignedDepartment : 'Assigned Rotation'}
                        </span>
                      </div> {/* Close badge container. */}
                    </div> {/* Close name column. */}
                  </div> {/* Close Left group. */}
                  <div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-start" /* Right side evaluation sections frame */>
                    {isScoredLocal ? ( // If locally submitted active success status indicators are true.
                      <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center flex flex-col items-center justify-center font-sans" /* Visual cards success indicator layout */>
                        <span className="text-lg mb-1 block">✅</span>
                        <span className="text-xs font-bold text-green-700 block mb-0.5">Score Submitted and Locked</span>
                        <span className="text-[10px] text-green-600 font-semibold italic uppercase">Your evaluation has been locked safely into the backend system</span>
                      </div>
                    ) : isScored ? ( // If already database confirmed locked on mount.
                      <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center flex flex-col items-center justify-center font-sans" /* Visual locked cards layout */>
                        <span className="text-lg mb-1 block">🔒</span>
                        <span className="text-xs font-bold text-green-700 block mb-0.5">Score Already Submitted</span>
                        <span className="text-[10px] text-green-600 font-semibold italic uppercase block">Department Grade Recorded and Verified</span>
                      </div>
                    ) : ( // Show scoring input options.
                      <div className="flex flex-col gap-4" /* Score entries cards form fields */>
                        {/* Info banner explaining new scoring system */}
                        <div className="bg-[#FFF8E7] border border-[#C9A84C]/30 rounded-lg p-3"> 
                          <p className="text-[10px] text-gray-700 font-semibold leading-relaxed"> 
                            📊 <strong>New Scoring System:</strong> Rate the student in 4 key areas. The overall score will be calculated automatically as the average.
                          </p> 
                        </div> 
                        
                        {/* Sub-Score 1: Technical Skills */}
                        <div className="flex flex-col gap-1" /* Sub-score field layout */>
                          <label className="text-[10px] text-gray-700 font-bold uppercase tracking-wide">1. Technical Skills (0-100)</label>
                          <p className="text-[9px] text-gray-500 mb-1">Job-specific skills and competency in department tasks</p>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={curForm.technicalSkills || ''}
                            onChange={e => handleFormChange(studentId, 'technicalSkills', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C] w-[120px]"
                            placeholder="e.g. 85"
                          />
                        </div> 

                        {/* Sub-Score 2: Communication */}
                        <div className="flex flex-col gap-1" /* Sub-score field layout */>
                          <label className="text-[10px] text-gray-700 font-bold uppercase tracking-wide">2. Communication (0-100)</label>
                          <p className="text-[9px] text-gray-500 mb-1">Verbal, written, and interpersonal communication abilities</p>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={curForm.communication || ''}
                            onChange={e => handleFormChange(studentId, 'communication', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C] w-[120px]"
                            placeholder="e.g. 90"
                          />
                        </div> 

                        {/* Sub-Score 3: Teamwork */}
                        <div className="flex flex-col gap-1" /* Sub-score field layout */>
                          <label className="text-[10px] text-gray-700 font-bold uppercase tracking-wide">3. Teamwork (0-100)</label>
                          <p className="text-[9px] text-gray-500 mb-1">Collaboration with colleagues and other departments</p>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={curForm.teamwork || ''}
                            onChange={e => handleFormChange(studentId, 'teamwork', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C] w-[120px]"
                            placeholder="e.g. 88"
                          />
                        </div> 

                        {/* Sub-Score 4: Professionalism */}
                        <div className="flex flex-col gap-1" /* Sub-score field layout */>
                          <label className="text-[10px] text-gray-700 font-bold uppercase tracking-wide">4. Professionalism (0-100)</label>
                          <p className="text-[9px] text-gray-500 mb-1">Punctuality, attitude, dress code, and work ethic</p>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={curForm.professionalism || ''}
                            onChange={e => handleFormChange(studentId, 'professionalism', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C] w-[120px]"
                            placeholder="e.g. 92"
                          />
                        </div> 

                        {/* Calculated Overall Score Display */}
                        {curForm.technicalSkills && curForm.communication && curForm.teamwork && curForm.professionalism && ( // Show only if all sub-scores entered.
                          <div className="bg-gradient-to-r from-[#FFF8E7] to-white border-2 border-[#C9A84C] rounded-lg p-3 flex items-center justify-between"> 
                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Calculated Overall Score:</span>
                            <span className="text-2xl font-black text-[#C9A84C]">
                              {((Number(curForm.technicalSkills) + Number(curForm.communication) + Number(curForm.teamwork) + Number(curForm.professionalism)) / 4).toFixed(1)}/100
                            </span>
                          </div>
                        )}
                        
                        <div className="flex flex-col gap-1" /* Details text comments section frame details */>
                          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">General Comments</label>
                          <textarea
                            rows="3"
                            value={curForm.comments || ''}
                            onChange={e => handleFormChange(studentId, 'comments', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A84C] w-full resize-none leading-relaxed"
                            placeholder="Write your observations about this student's overall performance..."
                          />
                        </div> {/* Close text comments blocks textareas. */}
                        <p className="text-[10px] text-gray-400 font-medium italic leading-relaxed text-left select-none" /* Warnings instructions descriptions */>
                          Once submitted your scores are permanently locked and cannot be changed. Please review all 4 sub-scores carefully before submitting.
                        </p>
                        <button
                          onClick={() => handleSubmitScore(studentId)}
                          disabled={isPendingSubmit}
                          className="bg-[#C9A84C] hover:bg-[#B7963A] disabled:bg-gray-200 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg transition-colors border-0 self-start cursor-pointer select-none"
                        >
                          {isPendingSubmit ? 'Submitting...' : 'Submit Score'}
                        </button>
                      </div> // Close evaluation forms wrappers layout.
                    )}
                  </div> {/* Close right column details wrap container. */}
                </div> // Close row card.
              ); // End map list row cards.
            })} {/* End looping lists. */}
          </div> // Close lists block framework shapes structure.
        )}
      </div> // Close master outcomes.
    ); // Close assignment.
  } // Terminate conditionals dashboard contents logs blocks check.
  // Now build the JSX output templates.
  return ( // Open main JSX return block coordinates.
    // Wrap in DashboardLayout with role from user.role and pageTitle Supervisor Dashboard.
    <DashboardLayout role={user ? user.role : 'supervisor_fo'} pageTitle="Supervisor Dashboard"> {/* Render responsive template layout wrapper. */}
      {/* Outer wrapper panel box element */}
      <div className="flex flex-col select-none font-sans min-h-screen pb-12"> {/* Master page wrap. */}
        {/* TOP INTRO SUMMARY TITLE BAR */}
        <div className="mb-8"> {/* Separator margins wrap. */}
          {/* Show a heading saying Department Supervisor Dashboard in Playfair Display charcoal 2xl margin bottom 4 pixels. */}
          <h2 className="text-2xl font-black text-gray-800 tracking-tight font-serif mb-1">Department Supervisor Dashboard</h2> {/* Title. */}
          {/* Show a gold badge with the department name. If department is empty show a loading state. */}
          <div className="mb-4"> {/* Container wrap. */}
            <span className="bg-amber-50 text-[#9C823A] border border-[#C9A84C]/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block"> {/* Badge shape. */}
              {department ? department : 'Loading Department...'} {/* Display department title label details. */}
            </span> {/* Close badge. */}
          </div> {/* Close badge wrap. */}
          {/* Show a paragraph below saying You can view your assigned students below and submit a performance score for each one in charcoal-light margin bottom 32 pixels. */}
          <p className="text-sm text-gray-500">You can view your assigned students below and submit a performance score for each one</p> {/* Subtitle context guidelines. */}
        </div> {/* Close intro summary section. */}
        {/* Render our safely computed dynamic dashboard contents variable */}
        {dashboardContent} {/* Active dynamic content output viewport. */}
      </div> {/* Close master viewport dashboard wrap. */}
    </DashboardLayout> // Close layout.
  ); // Close elements layout.
}; // Close SupervisorDashboard functional component scope.
export default SupervisorDashboard; // Export SupervisorDashboard as default.
