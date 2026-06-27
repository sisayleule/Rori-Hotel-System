// This page shows HR the full profile of one student and lets HR approve or reject the application.
// It integrates state toggles and asynchronous database controllers with instant emails notifications warnings.
import React, { useState, useEffect } from 'react'; // Import state and dynamic effect life cycle hooks.
// Import useParams to read active student path parameters, and useNavigate to route.
import { useParams, useNavigate } from 'react-router-dom'; // Load routing params extraction variables.
// Import the core DashboardLayout packing container.
import DashboardLayout from '../../components/DashboardLayout'; // Fetch common nested dashboard parent layout components.
// Import Axios preconfigured network client.
import api from '../../utils/api'; // Load unified client-side network querying driver instances.

// Create a functional component called HRApplicationDetail.
const HRApplicationDetail = () => { // Begin functional component declaration.
  // Extract student unique ID from active browser URL path using useParams react hook.
  const { id: studentId } = useParams(); // Load URL path mapping variable safely.
  // Get the redirecting navigator controller instance.
  const navigate = useNavigate(); // Store current navigation context driver.

  // Helper function to correct Cloudinary URLs by fixing resource type path for PDFs.
  const getCorrectUrl = (url) => { // Accept URL string parameter to process and fix if needed.
    if (!url || url === '') return ''; // Return empty string if URL is null, undefined, or empty preventing errors.
    let correctedUrl = url; // Initialize corrected URL variable with original URL value.
    // Check if URL contains .pdf extension indicating this is a PDF document that may need path correction.
    if (url.toLowerCase().includes('.pdf')) { // Test for PDF extension case insensitive.
      // Replace image/upload with raw/upload in URL path so Cloudinary serves PDF as raw binary not processed image.
      // Also replace auto/upload with raw/upload as backup in case auto resource type was used.
      correctedUrl = url
        .replace('/image/upload/', '/raw/upload/') // Fix image to raw for proper PDF serving.
        .replace('/auto/upload/', '/raw/upload/'); // Fix auto to raw as backup.
    } // End PDF check.
    // Remove fl_attachment flag from URL if present because it forces download instead of inline view.
    correctedUrl = correctedUrl.replace('/fl_attachment/', '/').replace('fl_attachment,', '').replace(',fl_attachment', ''); // Strip attachment flags.
    return correctedUrl; // Return the corrected URL with proper resource type and flags removed.
  }; // Close URL correction helper function.

  // Helper function to determine if a URL points to a PDF file based on file extension.
  const isPDF = (url) => { // Accept URL string to check for PDF extension.
    if (!url) return false; // Return false if URL is null or undefined.
    return url.toLowerCase().includes('.pdf'); // Check if URL contains .pdf extension case insensitive.
  }; // Close PDF detection helper function.

  // Helper function to extract filename from Cloudinary URL for download attribute.
  const getFileName = (url) => { // Accept URL string to extract filename from path.
    if (!url) return 'document'; // Return default filename if URL is empty.
    const parts = url.split('/'); // Split URL by forward slashes to get path segments.
    return parts[parts.length - 1] || 'document'; // Return last segment as filename or default if not found.
  }; // Close filename extraction helper function.

  // student state variable holds the loaded profile document.
  const [student, setStudent] = useState(null); // Place initial student state to null.
  // startDate state stores start schedules typed during approval.
  const [startDate, setStartDate] = useState(''); // Place initial date string to blank.
  // endDate state stores training completion milestones typed during approval.
  const [endDate, setEndDate] = useState(''); // Place initial completion date string to blank.
  // ROTATION SYSTEM STATES — Instead of assigning one department, HR now sets rotation order for all 4 departments.
  // dept1 state stores the first department in the rotation order sequence.
  const [dept1, setDept1] = useState(''); // Initialize with empty string for first rotation department.
  // dept2 state stores the second department in the rotation order sequence.
  const [dept2, setDept2] = useState(''); // Initialize with empty string for second rotation department.
  // dept3 state stores the third department in the rotation order sequence.
  const [dept3, setDept3] = useState(''); // Initialize with empty string for third rotation department.
  // dept4 state stores the fourth department in the rotation order sequence.
  const [dept4, setDept4] = useState(''); // Initialize with empty string for fourth rotation department.
  // rejectionNote state stores reasons why requests cannot proceed during reject operations.
  const [rejectionNote, setRejectionNote] = useState(''); // Initialize draft with normal blank characters.
  // loading state tracking indicator representing background fetching state.
  const [loading, setLoading] = useState(true); // Place initial page loading status to true condition.
  // actionLoading tracks process completion locks during database post/put request runs.
  const [actionLoading, setActionLoading] = useState(false); // Set lock flags to standard false.
  // error state saves failure details during initial profile load routines.
  const [error, setError] = useState(''); // Keep target fallback message string empty initially.
  // actionError tracks exceptions that occur when submitting approval or rejection files.
  const [actionError, setActionError] = useState(''); // Clear error indicator for submit.
  // actionSuccess stores user messages shown after updating backend models successfully.
  const [actionSuccess, setActionSuccess] = useState(''); // Clear success confirmation placeholder.
  // showApproveForm state turns on the calendar selection card block.
  const [showApproveForm, setShowApproveForm] = useState(false); // Store toggle as standard boolean false.
  // showRejectForm state presents input justification textareas on the screen.
  const [showRejectForm, setShowRejectForm] = useState(false); // Store toggle as standard boolean false.
  // finalResult state stores the student's published result data including badges for display.
  const [finalResult, setFinalResult] = useState(null); // Initialize final result as null until fetched.

  // Run initial mounting hooks that fetch the candidate documents from our backend service.
  useEffect(() => { // Start page bootstrapping reactions.
    const fetchStudent = async () => { // Declare an asynchronous data loader function.
      try { // Start error trapping context.
        const response = await api.get(`/applications/${studentId}`); // Send GET to /applications/ followed by studentId.
        setStudent(response.data); // Load returned student registry profiles inside component state.
        if (response.data) { // Ensure safe returned payload exists.
          setStartDate(response.data.startDate || ''); // Hydrate state start values if previously saved.
          setEndDate(response.data.endDate || ''); // Hydrate state end values if previously saved.
          // Hydrate rotation order states if previously saved by HR.
          if (response.data.departmentRotationOrder && response.data.departmentRotationOrder.length === 4) { // Check if rotation order exists.
            setDept1(response.data.departmentRotationOrder[0] || ''); // Set first department in rotation.
            setDept2(response.data.departmentRotationOrder[1] || ''); // Set second department in rotation.
            setDept3(response.data.departmentRotationOrder[2] || ''); // Set third department in rotation.
            setDept4(response.data.departmentRotationOrder[3] || ''); // Set fourth department in rotation.
          } // End rotation hydration.
          setRejectionNote(response.data.rejectionNote || ''); // Hydrate historical rejection reasons.
          
          // Fetch student's final result if they are approved to display badges and scores.
          if (response.data.status === 'approved') { // Check if student is approved.
            try { // Start try block for result fetching.
              const resultResponse = await api.get(`/students/${studentId}/results`); // Fetch student's final result.
              if (resultResponse.data && resultResponse.data.published) { // Check if result is published.
                setFinalResult(resultResponse.data.result); // Save final result to state for badge display.
              } // Close published check.
            } catch (resultErr) { // Catch result fetching errors.
              console.log('No published result found for this student yet'); // Log info message (not an error).
            } // Close result fetching try-catch.
          } // Close approved check.
        } // End verification checker.
      } catch (err) { // Trap execution failure.
        console.error('Failed to load student details:', err); // Log details onto diagnostic console.
        setError('could not load student profile data please refresh'); // Update user error state message.
      } finally { // Finalize operations sequence.
        setLoading(false); // Disable screen loading loader.
      } // Complete try catch block.
    }; // Terminate fetchStudent declaration.

    fetchStudent(); // Call fetch subroutines immediately on start.
  }, [studentId]); // Bind effect to studentId changes.

  // Create handleApprove async action trigger to update student profiles in backend.
  const handleApprove = async () => { // Setup event triggered function.
    try { // Start error exceptions check block.
      setActionLoading(true); // Engaged processing status bars.
      setActionError(''); // Wipe out previous state failures logs.
      setActionSuccess(''); // Clear previous dashboard confirmations.

      // Validate that all required fields are present including start date, end date, and all 4 rotation departments.
      if (!startDate || !endDate) { // Check if dates are missing.
        setActionError('please fill in start date and end date before approving.'); // Write message inside user alert.
        setActionLoading(false); // Enable action buttons elements interaction.
        return; // Halt executions.
      } // End date checks.

      // Validate rotation order - all 4 departments must be selected and no duplicates allowed.
      if (!dept1 || !dept2 || !dept3 || !dept4) { // Check if any department dropdown is empty.
        setActionError('please assign all 4 departments for the rotation order.'); // Write message for missing departments.
        setActionLoading(false); // Enable action buttons elements interaction.
        return; // Halt executions.
      } // End empty check.

      // Check for duplicate department selections - each department must appear exactly once.
      const rotationArray = [dept1, dept2, dept3, dept4]; // Create array of selected departments.
      const uniqueDepartments = new Set(rotationArray); // Create set to find duplicates.
      if (uniqueDepartments.size !== 4) { // If set size is less than 4, there are duplicates.
        setActionError('please assign all 4 departments and make sure no department is repeated.'); // Write message for duplicate departments.
        setActionLoading(false); // Enable action buttons elements interaction.
        return; // Halt executions.
      } // End duplicate check.

      // Send approval request with rotation order and current department set to first in rotation.
      await api.put(`/applications/${studentId}/approve`, { // Send PUT request to approve endpoints node.
        startDate: startDate, // Send selected training start dates body value.
        endDate: endDate, // Send selected training ending dates body value.
        departmentRotationOrder: rotationArray, // Send array of 4 departments in rotation order from dept1 to dept4.
        currentDepartment: dept1 // Set current department to the first department in rotation order so student starts there.
      }); // Finish API query execution.

      setActionSuccess('student approved successfully. An email has been sent to the student.'); // Update UI text.
      if (student) { // Review local profiles documents updates requirements.
        // Update local state with approved status and rotation information.
        setStudent({ ...student, status: 'approved', startDate, endDate, departmentRotationOrder: rotationArray, currentDepartment: dept1 }); // Update status locally to approved with rotation.
      } // End verification.
      setShowApproveForm(false); // Hide the approval editing container elements form.
    } catch (err) { // Trap runtime database issues.
      console.error('Failed to process approval actions:', err); // Print records in console.
      setActionError('failed to approve please try again.'); // Setup notifications alert message.
    } finally { // Finalize process run routines.
      setActionLoading(false); // Clear locks.
    } // Complete try catch block.
  }; // Terminate approval controller function.

  // Create handleMoveToNextDepartment async function to move student to next department in rotation order.
  const handleMoveToNextDepartment = async () => { // Setup async event triggered function for rotation advancement.
    try { // Start error exceptions check block.
      setActionLoading(true); // Engaged processing status bars.
      setActionError(''); // Wipe out previous state failures logs.
      setActionSuccess(''); // Clear previous dashboard confirmations.

      // Find the index of current department in the rotation order array to determine next department.
      const currentIndex = student.departmentRotationOrder.indexOf(student.currentDepartment); // Get array index of current department.
      
      // Check if student is already in the last department of rotation order.
      if (currentIndex === student.departmentRotationOrder.length - 1) { // If current index is last position in array.
        setActionError('student has completed all departments in the rotation order.'); // Show completion message.
        setActionLoading(false); // Enable action buttons elements interaction.
        return; // Halt executions.
      } // End completion check.

      // Send PUT request to move student to next department in rotation.
      const response = await api.put(`/applications/${studentId}/next-department`); // Send PUT request to next-department endpoint.
      
      setActionSuccess('student moved to next department successfully. Notification sent to student.'); // Update UI text with success message.
      // Update local student state with new current department and updated completed departments array.
      setStudent(response.data.student); // Update student object with response data from server.
    } catch (err) { // Trap runtime database issues.
      console.error('Failed to move to next department:', err); // Print records in console.
      setActionError('failed to move student to next department please try again.'); // Setup notifications alert message.
    } finally { // Finalize process run routines.
      setActionLoading(false); // Clear locks.
    } // Complete try catch block.
  }; // Terminate move to next department controller function.

  // Create handleReject async action trigger to update student statuses as rejected on servers.
  const handleReject = async () => { // Setup event triggered function.
    try { // Start error exceptions check block.
      setActionLoading(true); // Engaged processing status bars.
      setActionError(''); // Wipe out previous state failures logs.
      setActionSuccess(''); // Clear previous dashboard confirmations.

      if (!rejectionNote.trim()) { // Ensure reason field is not empty.
        setActionError('please write a rejection reason.'); // Write message inside user alert.
        setActionLoading(false); // Enable execution buttons.
        return; // Halt executions.
      } // End check.

      await api.put(`/applications/${studentId}/reject`, { // Send PUT request to reject endpoints node.
        rejectionNote: rejectionNote.trim() // Pass comments inside body block payload.
      }); // Finish API query execution.

      setActionSuccess('application rejected. Student has been notified by email.'); // Update UI text.
      if (student) { // Review local profiles documents updates requirements.
        setStudent({ ...student, status: 'rejected', rejectionNote: rejectionNote.trim() }); // Update status locally to rejected.
      } // End verification.
      setShowRejectForm(false); // Hide the rejection editing container elements form.
    } catch (err) { // Trap runtime database issues.
      console.error('Failed to register reject actions:', err); // Print records inside debugger.
      setActionError('failed to reject application please try again.'); // Setup notifications alert message.
    } finally { // Finalize process run routines.
      setActionLoading(false); // Clear locks.
    } // Complete try catch block.
  }; // Terminate rejection controller function.

  // Create local styling helper to paint corresponding statuses labels.
  const getStatusBadge = (statusValue) => { // Accept current student status parameter.
    const normalized = (statusValue || '').toLowerCase(); // Standardize characters case.
    if (normalized === 'pending') { // Match pending value configurations.
      return 'bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full'; // Return amber styling classes.
    } // End verification block.
    if (normalized === 'approved') { // Match approved value configurations.
      return 'bg-emerald-100 text-[#123e21] border border-emerald-200 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full'; // Return green styling classes.
    } // End verification block.
    if (normalized === 'rejected') { // Match rejected value configurations.
      return 'bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full'; // Return red styling classes.
    } // End verification block.
    return 'bg-gray-100 text-gray-700 border border-gray-200 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full'; // Return neutral default gray classes.
  }; // Close getStatusBadge helper scope.

  // Translate timestamps safely using native browsers formatting APIs.
  const formatDates = (inputString) => { // Accept timestamp parameters.
    if (!inputString) return 'Not Available'; // Return placeholder text.
    return new Date(inputString).toLocaleDateString(undefined, { // Generate localized format text.
      year: 'numeric', // Render numeric years indicators.
      month: 'long', // Render full literal months headings.
      day: 'numeric' // Render numbered date.
    }); // Return values.
  }; // Terminate formatting utilities.

  return ( // Start returning JSX layout.
    <DashboardLayout role="hr" pageTitle="Application Detail"> 
      
      {/* Scrollable container framing child blocks and back trigger links */}
      <div className="max-w-4xl mx-auto flex flex-col font-sans select-none"> 
        
        {/* Navigation Action back link */}
        <button 
          onClick={() => navigate('/hr/applications')} // Dispatch user back on clicks actions.
          className="inline-flex items-center gap-2 text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-6 self-start hover:text-[#C9A84C] transition-all duration-300 cursor-pointer" 
        > 
          ← Back to Applications 
        </button> 

        {/* LOADING PROGRESS VIEWPORT CAPTIONS */}
        {loading && ( // Assess loading values state.
          <div className="flex items-center justify-center py-24 bg-white border border-gray-100 rounded-xl shadow-xs"> 
            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400"> 
              Loading student dossier... 
            </p> 
          </div> // Close progress indicator.
        )} 

        {/* FAILURE ERROR ALERT BANNER BOX */}
        {!loading && error && ( // Review fault state reports.
          <div className="p-5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-extrabold uppercase tracking-widest mb-4 text-center"> 
            {error} 
          </div> // Close error containers.
        )} 

        {/* DETAILS BLOCKS DISPLAY RENDERING */}
        {!loading && !error && student && ( // Display detailed panel.
          <div className="flex flex-col space-y-6"> 
            
            {/* SECTION ONE — Student profiles info card */}
            <div className="bg-white rounded-xl border border-gray-150 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start shadow-xs"> 
              
              {/* Profile image canvas element space */}
              <div className="w-28 h-28 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200 shadow-2xs"> 
                {student.profilePhoto ? ( // Determine if photo is attached in collection.
                  <img 
                    src={student.profilePhoto} // Use Cloudinary HTTPS URL directly from database without any prefix modification.
                    alt={student.userId?.fullName || 'Student Avatar'} // Set useful labels.
                    referrerPolicy="no-referrer" // Prevent iframe context collapses.
                    className="w-full h-full object-cover" 
                  /> 
                ) : ( // Show standard fallback initials.
                  <span className="text-3xl font-serif font-black text-gray-400 text-center uppercase select-none"> 
                    {(student.userId?.fullName || 'S').charAt(0)} 
                  </span> 
                )} 
              </div> 

              {/* Attributes text metadata details table listings column */}
              <div className="flex-1 flex flex-col space-y-3.5 text-center md:text-left"> 
                
                {/* Full name of candidate */}
                <h1 className="font-serif text-2xl font-black text-gray-900 leading-tight"> 
                  {student.userId?.fullName || 'Candidate Profile'} 
                </h1> 

                {/* Live colored active status bubble badge */}
                <div className="flex items-center justify-center md:justify-start"> 
                  <span className={getStatusBadge(student.status)}> 
                    {student.status || 'pending'} 
                  </span> 
                </div> 

                {/* Subheading meta fields grid details layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs font-medium text-gray-500 pt-3 border-t border-gray-100"> 
                  
                  {/* University indicator */}
                  <div> 
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400 block mb-0.5">University</span> 
                    <span className="font-bold text-gray-800 text-sm">{student.universityName || 'Not Set'}</span> 
                  </div> 

                  {/* Student ID Code */}
                  <div> 
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400 block mb-0.5">Student ID Number</span> 
                    <span className="font-mono text-gray-700 text-sm font-semibold">{student.studentIdNumber || 'Not Associated'}</span> 
                  </div> 

                  {/* Expressed department preferences */}
                  <div> 
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400 block mb-0.5">Department Preference</span> 
                    <span className="font-extrabold text-[#C9A84C] text-sm uppercase">{student.departmentPreference || 'None'}</span> 
                  </div> 

                  {/* Account email login credentials */}
                  <div> 
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400 block mb-0.5">Email Address</span> 
                    <span className="font-semibold text-gray-700 text-sm">{student.userId?.email || 'unassociated@rorihotel.com'}</span> 
                  </div> 

                  {/* Applied timestamp markers */}
                  <div className="sm:col-span-2"> 
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400 block mb-0.5">Applied Date</span> 
                    <span className="font-medium text-gray-650 text-sm">{formatDates(student.createdAt)}</span> 
                  </div> 

                </div> 

              </div> 

            </div> 

            {/* SECTION TWO — Uploaded internship supporting documents section showing only internship letter */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6"> { /* Container for documents section with padding and shadow */ }
              
              {/* Section header title */}
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-6"> { /* Header text with uppercase styling */ }
                Submitted Documents 
              </h3> { /* Close header */ }
              
              {/* Show message if no internship letter uploaded */}
              {(!student.internshipLetter || student.internshipLetter === '') && ( // Check if internship letter is missing or empty.
                <p className="text-gray-500 text-sm">No documents uploaded.</p> // Display fallback message when no documents exist.
              )} { /* Close conditional render for empty state */ }
              
              {/* Show internship letter card if letter exists */}
              {student.internshipLetter && student.internshipLetter !== '' && ( // Check if internship letter URL exists and is not empty string.
                <div className="flex items-start gap-5"> { /* Horizontal flex container with spacing between icon and content */ }
                  
                  {/* Icon container showing PDF or image emoji based on file type */}
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"> { /* Square icon box with light background */ }
                    <span className="text-2xl"> { /* Emoji container with large font size */ }
                      {student.internshipLetter.toLowerCase().includes('.pdf') ? '📄' : '🖼️'} { /* Show PDF emoji for PDFs or image emoji for other files */ }
                    </span> { /* Close emoji span */ }
                  </div> { /* Close icon container */ }
                  
                  {/* Document details and action buttons container */}
                  <div className="flex-1"> { /* Flex container taking remaining space */ }
                    
                    {/* Document title */}
                    <p className="text-gray-900 font-semibold mb-1"> { /* Bold title text */ }
                      Internship Approval Letter 
                    </p> { /* Close title */ }
                    
                    {/* Document type indicator */}
                    <p className="text-gray-500 text-xs mb-4"> { /* Small gray text showing file format */ }
                      {student.internshipLetter.toLowerCase().includes('.pdf') ? 'PDF Document' : 'Image Document'} { /* Display format based on extension */ }
                    </p> { /* Close type indicator */ }
                    
                    {/* Action buttons container */}
                    <div className="flex flex-wrap gap-3"> { /* Horizontal flex container for buttons with gap spacing */ }
                      
                      {/* View in New Tab button */}
                      <a 
                        href={student.internshipLetter} // Use internship letter URL directly from database which is already fixed on backend.
                        target="_blank" // Open in new browser tab for inline viewing of PDF or image.
                        rel="noopener noreferrer" // Security best practice preventing window opener access vulnerabilities.
                        className="inline-flex items-center gap-2 bg-[#C9A84C] text-gray-900 text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#b59540] transition-all cursor-pointer" // Gold button with hover effect and icon spacing.
                      > 
                        <span>👁</span> { /* Eye emoji icon */ }
                        <span>View in New Tab</span> { /* Button label text */ }
                      </a> { /* Close view button */ }
                      
                      {/* Download button with proper cross-origin download handling using fetch and blob */}
                      <button 
                        className="inline-flex items-center gap-2 border border-gray-900 text-gray-900 text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-50 transition-all cursor-pointer" // Outline button with hover effect.
                        onClick={async (e) => { // Async click handler for download functionality using fetch API.
                          e.preventDefault(); // Prevent any default button behavior.
                          try { // Start error handling block for fetch operation.
                            // Extract filename from URL by splitting on forward slashes and taking last segment.
                            const urlParts = student.internshipLetter.split('/'); // Split URL by slashes to get path segments.
                            let filename = urlParts[urlParts.length - 1] || 'internship-letter'; // Get last segment as filename or use default.
                            
                            // Add file extension if missing based on file type detection.
                            if (!filename.includes('.')) { // Check if filename has no extension.
                              // Detect if URL is for PDF or image based on resource type in URL path.
                              if (student.internshipLetter.includes('/raw/upload/')) { // Raw upload indicates PDF document.
                                filename += '.pdf'; // Add PDF extension to filename.
                              } else if (student.internshipLetter.includes('.jpg') || student.internshipLetter.includes('.jpeg')) { // Check for JPG in URL.
                                filename += '.jpg'; // Add JPG extension to filename.
                              } else if (student.internshipLetter.includes('.png')) { // Check for PNG in URL.
                                filename += '.png'; // Add PNG extension to filename.
                              } else { // Default fallback extension.
                                filename += '.pdf'; // Default to PDF extension.
                              } // End extension detection.
                            } // End filename extension check.
                            
                            // Fetch the file from Cloudinary URL as a blob to enable cross-origin download.
                            const response = await fetch(student.internshipLetter); // Fetch file from Cloudinary URL.
                            const blob = await response.blob(); // Convert response to blob object for download.
                            
                            // Create object URL from blob to use as download source.
                            const blobUrl = window.URL.createObjectURL(blob); // Create temporary blob URL in browser memory.
                            
                            // Create temporary anchor element to trigger download with blob URL.
                            const link = document.createElement('a'); // Create anchor element for download.
                            link.href = blobUrl; // Set href to blob URL instead of Cloudinary URL.
                            link.download = filename; // Set download attribute with filename to force download instead of opening.
                            document.body.appendChild(link); // Temporarily add link to DOM for click triggering.
                            link.click(); // Trigger click to start download.
                            document.body.removeChild(link); // Remove temporary link from DOM after click.
                            
                            // Clean up blob URL from memory after download starts.
                            window.URL.revokeObjectURL(blobUrl); // Free memory by revoking blob URL.
                          } catch (error) { // Catch any errors during fetch or download process.
                            console.error('Download failed:', error); // Log error to console for debugging.
                            alert('Failed to download file. Please try again or use "View in New Tab" button.'); // Show user-friendly error message.
                          } // End error handling.
                        }} // Close onClick handler.
                      > 
                        <span>⬇</span> { /* Download arrow emoji icon */ }
                        <span>Download</span> { /* Button label text */ }
                      </button> { /* Close download button */ }
                      
                    </div> { /* Close buttons container */ }
                    
                  </div> { /* Close document details container */ }
                  
                </div> // Close flex container for letter card.
              )} { /* Close conditional render for internship letter */ }
              
            </div> { /* Close documents section container */ }

            {/* SECTION THREE — Action verification forms controls */}
            {/* Show actions only if the student status is pending */}
            {student.status === 'pending' && ( // Apply gating rule checks.
              <div className="bg-white rounded-xl border border-gray-150 p-6 md:p-8 flex flex-col space-y-6 shadow-xs"> 
                
                {/* Action status alerts blocks for confirmation reports */}
                {actionSuccess && ( // Trigger green feedback boxes.
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold uppercase tracking-widest rounded-xl text-center shadow-2xs"> 
                    {actionSuccess} 
                  </div> // Close confirm success blocks.
                )} 

                {/* Action errors alerts blocks representing operation flaws */}
                {actionError && ( // Trigger red feedback warning boxes.
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-extrabold uppercase tracking-widest rounded-xl text-center shadow-2xs"> 
                    {actionError} 
                  </div> // Close error reports blocks.
                )} 

                {/* Subtitle explanation of action block */}
                <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-widest"> 
                  Review Actions 
                </h3> 

                {/* Primary split decision trigger buttons row */}
                <div className="flex flex-col sm:flex-row gap-4"> 
                  
                  {/* Toggle button enabling approval process workflow panels */}
                  <button 
                    onClick={() => { setShowApproveForm(true); setShowRejectForm(false); }} // Engage approval forms.
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold uppercase tracking-widest py-3.5 rounded-xl transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-xs text-center" 
                  > 
                    Approve Application 
                  </button> 

                  {/* Toggle button enabling rejection reason drafting workflows */}
                  <button 
                    onClick={() => { setShowRejectForm(true); setShowApproveForm(false); }} // Engage rejection forms.
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold uppercase tracking-widest py-3.5 rounded-xl transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-xs text-center border-0" 
                  > 
                    Reject Application 
                  </button> 

                </div> 

                {/* POPUP SUBFORM CARD 1: Internship schedules parameters config approved letter drafting */}
                {showApproveForm && ( // Conditional render of approval panel options.
                  <div className="bg-white border-2 border-emerald-500/30 rounded-xl p-6 flex flex-col space-y-5 animate-fade-in"> 
                    
                    {/* Header caption */}
                    <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider block"> 
                      Approve Internship Application 
                    </h4> 

                    {/* Inputs panel grid grouping */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                      
                      {/* Active training start date controls input select block */}
                      <div className="flex flex-col"> 
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5 block"> 
                          Start Date 
                        </label> 
                        <input 
                          type="date" // Standard browser calendar controls date chooser input.
                          value={startDate} // Bind to active startDate state.
                          onChange={(e) => setStartDate(e.target.value)} // Mutate values on modifications.
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none transition-all duration-300 text-gray-700" 
                        /> 
                      </div> 

                      {/* Active training termination date controls input select block */}
                      <div className="flex flex-col"> 
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5 block"> 
                          End Date 
                        </label> 
                        <input 
                          type="date" // Date picker system controls input block.
                          value={endDate} // Bind to active endDate state.
                          onChange={(e) => setEndDate(e.target.value)} // Update values on modification.
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none transition-all duration-300 text-gray-700" 
                        /> 
                      </div> 

                    </div> 

                    {/* ROTATION ORDER SETUP — Changed from single department assignment to 4-department rotation system */}
                    <div className="flex flex-col space-y-4"> 
                      {/* Section heading explaining the rotation system to HR */}
                      <h5 className="text-sm font-bold text-emerald-800 uppercase tracking-wider"> 
                        Set Department Rotation Order 
                      </h5> 
                      {/* Explanation paragraph describing how rotation works */}
                      <p className="text-xs text-gray-600 leading-relaxed"> 
                        The student will work in each department in the order you set below. They start with Department 1 and move to the next only when you approve the rotation. 
                      </p> 

                      {/* Grid layout for 4 department dropdowns in rotation order */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                        
                        {/* Department 1 dropdown - first in rotation sequence */}
                        <div className="flex flex-col"> 
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5 block"> 
                            Department 1 (Start Here) 
                          </label> 
                          <select 
                            value={dept1} // Bind to dept1 state for first department in rotation.
                            onChange={(e) => setDept1(e.target.value)} // Update dept1 state on selection change.
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-xs focus:bg-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none transition-all duration-300 text-gray-700" 
                          > 
                            <option value="" disabled>Select department 1</option> 
                            <option value="Front Office">Front Office</option> 
                            <option value="Housekeeping">Housekeeping</option> 
                            <option value="Kitchen">Kitchen</option> 
                            <option value="F&B Service">F&B Service</option> 
                          </select> 
                        </div> 

                        {/* Department 2 dropdown - second in rotation sequence */}
                        <div className="flex flex-col"> 
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5 block"> 
                            Department 2 
                          </label> 
                          <select 
                            value={dept2} // Bind to dept2 state for second department in rotation.
                            onChange={(e) => setDept2(e.target.value)} // Update dept2 state on selection change.
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-xs focus:bg-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none transition-all duration-300 text-gray-700" 
                          > 
                            <option value="" disabled>Select department 2</option> 
                            <option value="Front Office">Front Office</option> 
                            <option value="Housekeeping">Housekeeping</option> 
                            <option value="Kitchen">Kitchen</option> 
                            <option value="F&B Service">F&B Service</option> 
                          </select> 
                        </div> 

                        {/* Department 3 dropdown - third in rotation sequence */}
                        <div className="flex flex-col"> 
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5 block"> 
                            Department 3 
                          </label> 
                          <select 
                            value={dept3} // Bind to dept3 state for third department in rotation.
                            onChange={(e) => setDept3(e.target.value)} // Update dept3 state on selection change.
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-xs focus:bg-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none transition-all duration-300 text-gray-700" 
                          > 
                            <option value="" disabled>Select department 3</option> 
                            <option value="Front Office">Front Office</option> 
                            <option value="Housekeeping">Housekeeping</option> 
                            <option value="Kitchen">Kitchen</option> 
                            <option value="F&B Service">F&B Service</option> 
                          </select> 
                        </div> 

                        {/* Department 4 dropdown - fourth and final in rotation sequence */}
                        <div className="flex flex-col"> 
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5 block"> 
                            Department 4 (Final) 
                          </label> 
                          <select 
                            value={dept4} // Bind to dept4 state for fourth department in rotation.
                            onChange={(e) => setDept4(e.target.value)} // Update dept4 state on selection change.
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-xs focus:bg-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none transition-all duration-300 text-gray-700" 
                          > 
                            <option value="" disabled>Select department 4</option> 
                            <option value="Front Office">Front Office</option> 
                            <option value="Housekeeping">Housekeeping</option> 
                            <option value="Kitchen">Kitchen</option> 
                            <option value="F&B Service">F&B Service</option> 
                          </select> 
                        </div> 

                      </div> 
                    </div> 

                    {/* Information notification tag notes details */}
                    <p className="text-[11px] text-gray-450 italic mt-1 font-medium text-gray-400"> 
                      An approval email will be automatically sent to the student. 
                    </p> 

                    {/* Bottom validation button handlers array */}
                    <div className="flex gap-3 justify-end pt-2 border-t border-gray-100"> 
                      
                      {/* Cancel approval workflow trigger button */}
                      <button 
                        onClick={() => setShowApproveForm(false)} // Clear approval screens.
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer select-none" 
                      > 
                        Cancel 
                      </button> 

                      {/* Execute approval database update trigger button */}
                      <button 
                        onClick={handleApprove} // Run approval procedures logic.
                        disabled={actionLoading} // Freeze action triggers during loaders locks.
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-100 text-white disabled:text-gray-400 text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer disabled:cursor-not-allowed select-none" 
                      > 
                        {actionLoading ? 'Approving' : 'Confirm Approval'} 
                      </button> 

                    </div> 

                  </div> 
                )} 

                {/* POPUP SUBFORM CARD 2: Internship decline explanation reason feedback entry field */}
                {showRejectForm && ( // Conditional render of rejection rationale forms blocks.
                  <div className="bg-white border-2 border-rose-500/30 rounded-xl p-6 flex flex-col space-y-5 animate-fade-in"> 
                    
                    {/* Header caption */}
                    <h4 className="text-sm font-bold text-rose-800 uppercase tracking-wider block"> 
                      Reject Application 
                    </h4> 

                    {/* Textarea comment box */}
                    <div className="flex flex-col"> 
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5 block"> 
                        Reason for Rejection 
                      </label> 
                      <textarea 
                        rows={4} // Render standard height draft lines.
                        value={rejectionNote} // Hook to active rejectionNote string models.
                        onChange={(e) => setRejectionNote(e.target.value)} // Update typed parameters on edits.
                        placeholder="Provide a clear reason so the student understands the decision." // Helpful instructions prompt instructions.
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:bg-white focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none transition-all duration-300 text-gray-750 resize-none" 
                      /> 
                    </div> 

                    {/* Email alert notification alert warning banner */}
                    <p className="text-[11px] text-gray-450 italic mt-1 font-medium text-gray-400"> 
                      A rejection email with this reason will be sent to the student. 
                    </p> 

                    {/* Bottom validation button handlers array */}
                    <div className="flex gap-3 justify-end pt-2 border-t border-gray-100"> 
                      
                      {/* Cancel rejection workflow button */}
                      <button 
                        onClick={() => setShowRejectForm(false)} // Clear rejection overlays.
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer select-none" 
                      > 
                        Cancel 
                      </button> 

                      {/* Execute rejection database update trigger button */}
                      <button 
                        onClick={handleReject} // Run rejection post logic routines.
                        disabled={actionLoading} // Freeze button during outgoing transfers.
                        className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-100 text-white disabled:text-gray-400 text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer disabled:cursor-not-allowed select-none border-0" 
                      > 
                        {actionLoading ? 'Rejecting' : 'Confirm Rejection'} 
                      </button> 

                    </div> 

                  </div> 
                )} 

              </div> 
            )} 

            {/* INFORMATIONAL BLOCK A: Displayed only if Student status is already Approved */}
            {student.status === 'approved' && ( // Verify approved status flag.
              <div className="flex flex-col gap-4 mb-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center text-emerald-800 text-xs font-extrabold uppercase tracking-widest shadow-2xs"> 
                  📍 This application has been approved. Student starts on {formatDates(student.startDate)} and is currently in the {student.currentDepartment} department. 
                </div> // Close green confirmation cards.

                {/* DEPARTMENT ROTATION PROGRESS SECTION — Shows rotation timeline and move to next department button */}
                {student.departmentRotationOrder && student.departmentRotationOrder.length === 4 && ( // Check if rotation order exists and has 4 departments.
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"> 
                    {/* Section header */}
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4"> 
                      Department Rotation Progress 
                    </h4> 

                    {/* Current department badge display */}
                    <div className="mb-6 flex items-center gap-2"> 
                      <span className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">Current Department:</span> 
                      <span className="bg-[#C9A84C] text-gray-900 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full"> 
                        {student.currentDepartment} 
                      </span> 
                    </div> 

                    {/* Progress row with 4 step indicators showing rotation timeline */}
                    <div className="flex items-center justify-between mb-6 relative"> 
                      {/* Connecting line between steps */}
                      <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0" style={{ marginLeft: '24px', marginRight: '24px' }}></div> 

                      {/* Map through rotation order to create step indicators */}
                      {student.departmentRotationOrder.map((dept, index) => { // Loop through each department in rotation order.
                        // Determine if this department is completed, current, or upcoming.
                        const isCompleted = student.completedDepartments && student.completedDepartments.includes(dept); // Check if in completed array - fill with green.
                        const isCurrent = student.currentDepartment === dept; // Check if this is current department - fill with gold.
                        const isUpcoming = !isCompleted && !isCurrent; // Not completed and not current - fill with gray.

                        return ( // Return JSX for this step indicator.
                          <div key={index} className="flex flex-col items-center relative z-10 flex-1"> 
                            {/* Circle indicator with conditional coloring */}
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm mb-2 border-2 ${
                              isCompleted ? 'bg-emerald-500 border-emerald-600 text-white' : // Green for completed departments.
                              isCurrent ? 'bg-[#C9A84C] border-[#b59540] text-gray-900' : // Gold for current department.
                              'bg-gray-200 border-gray-300 text-gray-500' // Gray for upcoming departments.
                            }`}> 
                              {isCompleted ? '✓' : index + 1} { /* Show checkmark for completed, number for others */ }
                            </div> 
                            {/* Department name label below circle */}
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider text-center ${
                              isCompleted ? 'text-emerald-700' : // Green text for completed.
                              isCurrent ? 'text-[#C9A84C]' : // Gold text for current.
                              'text-gray-400' // Gray text for upcoming.
                            }`}> 
                              {dept} 
                            </span> 
                            {/* Status label */}
                            <span className="text-[9px] text-gray-400 mt-1"> 
                              {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Upcoming'} 
                            </span> 
                          </div> 
                        ); // Close return.
                      })} { /* Close map loop */ }
                    </div> 

                    {/* Move to Next Department button */}
                    <button 
                      onClick={handleMoveToNextDepartment} // Call handler function when button clicked.
                      disabled={actionLoading} // Disable button during loading state.
                      className="w-full bg-[#C9A84C] hover:bg-[#b59540] text-gray-900 text-xs font-extrabold uppercase tracking-widest py-3.5 rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                    > 
                      {actionLoading ? 'Processing...' : 'Move to Next Department'} { /* Show loading text or button text */ }
                    </button> 
                  </div> 
                )} { /* Close rotation progress section conditional render */ }

                {/* Grading Permission Authorization Toggle for Supervisors */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm text-left">
                  <div className="flex-1">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700">Rotation Grading Authorization</h4>
                    <p className="text-[10px] text-gray-500 mt-1 font-semibold uppercase tracking-wider">
                      Current Status: {student.isApprovedForGrading ? "🟢 AUTHORIZED (SUPERVISORS CAN DRAFT/SUBMIT SCORES)" : "🔴 LOCKED (SUPERVISOR SCORING DISABLED)"}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        const res = await api.put(`/applications/${student._id}/toggle-grading`);
                        setStudent({ ...student, isApprovedForGrading: res.data.student.isApprovedForGrading });
                        setActionSuccess(`Supervisor grading status updated to: ${res.data.student.isApprovedForGrading ? 'Authorized' : 'Locked'}`);
                      } catch (err) {
                        console.error('Failed to toggle grading lock state:', err);
                        setError('Failed to update grading authorization status');
                      }
                    }}
                    className={`text-xs font-extrabold uppercase tracking-widest px-5 py-3 rounded-lg border cursor-pointer transition-all select-none ${
                      student.isApprovedForGrading 
                        ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' 
                        : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {student.isApprovedForGrading ? "🔒 Lock Grading" : "🔓 Allow Grading"}
                  </button>
                </div>
              </div>
            )} 

            {/* INFORMATIONAL BLOCK B: Displayed only if Student status is already Rejected */}
            {student.status === 'rejected' && ( // Verify rejected status flag.
              <div className="bg-rose-50 border border-rose-250 rounded-xl p-6 text-center text-rose-800 text-xs font-extrabold uppercase tracking-widest shadow-2xs"> 
                ⛔ This application was rejected. Reason: "{student.rejectionNote || 'General requirements mismatch'}" 
              </div> // Close red warning cards.
            )} 

            {/* ACHIEVEMENT BADGES SECTION: Displayed for approved students with published results */}
            {student.status === 'approved' && finalResult && finalResult.badges && finalResult.badges.length > 0 && ( // Check if approved and has badges.
              <div className="bg-gradient-to-br from-[#FFF8E7] to-white rounded-xl shadow-sm border border-[#C9A84C]/30 p-6 mb-6"> 
                {/* Section header */}
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2"> 
                  <span className="text-lg">🏆</span>
                  <span>Student Achievement Badges</span>
                </h4> 

                {/* Overall score display */}
                <div className="mb-4 flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200"> 
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Overall Score:</span>
                  <span className="text-xl font-extrabold text-[#C9A84C]">{finalResult.overallScore}/100</span>
                </div>

                {/* Badge grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"> 
                  {finalResult.badges.map((badge, index) => ( // Loop through badges array.
                    <div 
                      key={index} // Use index as key.
                      className="bg-white rounded-lg p-3 border-2 transition-all duration-300 hover:shadow-md" // Badge card.
                      style={{ borderColor: badge.color || '#C9A84C' }} // Badge color border.
                    > 
                      {/* Badge emoji */}
                      <div className="text-2xl mb-1 text-center"> 
                        {badge.emoji || '🏅'} 
                      </div> 
                      
                      {/* Badge name */}
                      <h5 
                        className="text-[11px] font-extrabold uppercase tracking-wider text-center mb-1" 
                        style={{ color: badge.color || '#C9A84C' }} // Badge color text.
                      > 
                        {badge.name} 
                      </h5> 
                      
                      {/* Badge description */}
                      <p className="text-[9px] text-gray-600 text-center leading-relaxed"> 
                        {badge.description} 
                      </p> 
                    </div> 
                  ))} 
                </div> 

                {/* Badge count */}
                <p className="text-[10px] text-gray-500 text-center mt-3 italic"> 
                  This student earned {finalResult.badges.length} achievement badge{finalResult.badges.length !== 1 ? 's' : ''} during their internship.
                </p> 
              </div> 
            )} 

            {/* CERTIFICATE DOWNLOAD SECTION: Displayed for approved students with completed internship */}
            {student.status === 'approved' && ( // Check if student is approved.
              <div className="bg-white border border-[#C9A84C]/30 rounded-xl p-6 shadow-sm mt-6"> 
                {/* Section header */}
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2"> 
                  <span>📜</span>
                  <span>Internship Certificate</span>
                </h4> 

                {/* Certificate info and download button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4"> 
                  <div className="flex-1 text-left"> 
                    <p className="text-xs text-gray-600 font-semibold mb-1"> 
                      Download this student's internship completion certificate.
                    </p> 
                    <p className="text-[10px] text-gray-500 font-medium"> 
                      Certificate is automatically generated when results are published by HR.
                    </p> 
                  </div> 

                  {/* Download certificate button */}
                  <a 
                    href={`${import.meta.env.VITE_API_URL || `${window.location.origin}/api`}/results/${student._id}/certificate`} // Construct certificate download URL.
                    target="_blank" // Open in new tab.
                    rel="noopener noreferrer" // Security best practice for target blank.
                    className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b59540] text-gray-900 text-xs font-extrabold uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-300 cursor-pointer select-none whitespace-nowrap" 
                  > 
                    <span>📥</span>
                    <span>Download Certificate</span>
                  </a> 
                </div> 
              </div> 
            )} 

            {/* MESSAGE INTERACTION COMPONENT: Action button routing to HR messages interface */}
            <div className="text-center pt-2"> 
              <button 
                onClick={() => navigate('/hr/messages')} // Force route traversal onto general HR dialogue grids.
                className="inline-flex items-center gap-2.5 bg-[#C9A84C] hover:bg-[#b59540] text-[#12110e] text-xs font-extrabold uppercase tracking-widest px-6 py-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer select-none text-center" 
              > 
                💬 Message This Student 
              </button> 
            </div> 

          </div> 
        )} 

      </div> 

    </DashboardLayout> 
  ); // Terminate JSX returns.
}; // Close functional component.

export default HRApplicationDetail; // Export detailed profile view defaults.
