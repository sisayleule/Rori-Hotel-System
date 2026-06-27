// This is the first tab of the student dashboard showing the application status.
// It details the registration credentials, status reviews, and assignments info.
import React, { useState, useEffect } from 'react'; // Import state hooks and effect hooks from the default React library modules.
// Import the custom DashboardLayout wrapper component which provides the common workspace layout.
import DashboardLayout from '../../components/DashboardLayout'; // Fetch general nested dashboard parent layout components.
// Import the custom backend Axios instance configuring relative endpoints and token authorization.
import api from '../../utils/api'; // Load unified client-side network querying driver instances.

// Create a functional component representing the student core profile status views.
const StudentDashboard = () => {
  // student state stores student profile data (like email, full name, status, etc.) from the backend database.
  const [student, setStudent] = useState(null); // Initialize student profile state placeholder to null.
  // loading state tracks whether the client application is currently fetching API data from server.
  const [loading, setLoading] = useState(true); // Set initial load state value to true.
  // error state stores any failure alert messages sent back during failed API execution.
  const [error, setError] = useState(''); // Set standard error string to empty string initially.

  // Add a useEffect that runs exactly once when the component mounts on the display tree.
  useEffect(() => {
    // Declare an asynchronous function fetchProfile to communicate with student endpoint.
    const fetchProfile = async () => {
      // Implement safety try catch blocks to contain network failures gracefully.
      try {
        // Send a GET request to students me endpoint which uses Auth token to identify the caller.
        const responseData = await api.get('/students/me'); // Fire Axios API call.
        // Save retrieved payload profile properties into the student reactive state.
        setStudent(responseData.data); // Update profile values in real time.
      } catch (err) {
        // Print the captured details onto terminal console for diagnostic logs.
        console.error('Failed to load student profile:', err); // Log details.
        // Set an explicit, readable alert description inside the error state.
        setError('could not load your profile please refresh the page'); // Update alert state.
      } finally {
        // Terminate the loading indicator so that the actual screen can render.
        setLoading(false); // Disable spinning screen loader.
      } // Close exception capture sequences.
    }; // Terminate profile loader routines.

    // Call fetchProfile immediately to load student metrics.
    fetchProfile(); // Trigger network data execution.
  }, []); // Run effect only count trace once.

  // Return final UI components wrapped in standard DashboardLayout matching student role.
  return (
    // Wrap entire page output under modular dashboard widgets with specific metadata details
    <DashboardLayout role="student" pageTitle="My Application">
      
      {/* Loading state indicator container overlay */}
      {loading && (
        // Flexbox center alignment wrapping spinning element
        <div className="flex items-center justify-center py-20">
          
          {/* Main loading label text */}
          <p className="text-sm font-semibold tracking-wider uppercase text-gray-400 font-sans">
            Loading your profile...
          </p>
          
        </div>
      )}

      {/* Error state notification layout box */}
      {!loading && error && (
        // Alert panel structured with eye-safe warnings border themes
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-semibold mb-4 text-center">
          
          {/* Display captured error message variable */}
          {error}
          
        </div>
      )}

      {/* Main dashboard body loaded when student data exists in memory */}
      {!loading && !error && student && (
        // Outermost container wrapping profile summaries
        <div className="flex flex-col space-y-6 font-sans">
          
          {/* SECTION ONE — Welcome card showing user registration credentials */}
          <div className="bg-white rounded-xl shadow-xs p-7 border border-gray-100 flex flex-col">
            
            {/* Title greeting including the student's dynamic full name */}
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
              Welcome back, {student.user && student.user.fullName ? student.user.fullName : 'intern'}!
            </h2>
            
            {/* Divider lines providing elegant rhythm spacing inside welcome cards */}
            <div className="w-12 h-0.5 bg-[#C9A84C] mb-6"></div>
            
            {/* Grid structure dividing key registration field parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              
              {/* Detail row 1: Academic institution verification details */}
              <div className="flex flex-col">
                
                {/* Meta identifier label */}
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">
                  University / College
                </span>
                
                {/* Dynamic field value corresponding to student university name */}
                <span className="font-semibold text-gray-800">
                  {student.universityName}
                </span>
                
              </div>

              {/* Detail row 2: Registrar reference ID details */}
              <div className="flex flex-col">
                
                {/* Meta identifier label */}
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">
                  Student ID Number
                </span>
                
                {/* Dynamic field value corresponding to student database identifier */}
                <span className="font-mono font-semibold text-gray-800">
                  {student.studentIdNumber}
                </span>
                
              </div>

              {/* Detail row 3: Hotel department preference options */}
              <div className="flex flex-col">
                
                {/* Meta identifier label */}
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">
                  Department Preference
                </span>
                
                {/* Dynamic field value corresponding to student chosen department */}
                <span className="font-semibold text-gray-800 text-[#C9A84C]">
                  {student.departmentPreference}
                </span>
                
              </div>

              {/* Detail row 4: Form creation timestamp dates */}
              <div className="flex flex-col">
                
                {/* Meta identifier label */}
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">
                  Applied On
                </span>
                
                {/* Dynamic date formatted formatted with LocaleDateString */}
                <span className="font-semibold text-gray-800">
                  {new Date(student.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                
              </div>
              
            </div>
            
          </div>

          {/* SECTION TWO — Application status card showing HR review outputs */}
          <div className="bg-white rounded-xl shadow-xs p-7 border border-gray-100 flex flex-col">
            
            {/* Title header for application review cards */}
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider mb-5">
              Application Status
            </h3>
            
            {/* Wrapper centering the badge visually on the page */}
            <div className="mb-6 flex">
              
              {/* Conditional rendering sequence evaluating pending status */}
              {student.status === 'pending' && (
                // Yellow badge representing candidate application is under evaluation
                <span className="bg-amber-50 text-amber-700 border border-amber-200 py-2 px-5 rounded-full text-xs font-bold uppercase tracking-wider">
                  Under Review
                </span>
              )}

              {/* Conditional rendering sequence evaluating approved status */}
              {student.status === 'approved' && (
                // Green badge representing candidate application is approved
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 py-2 px-5 rounded-full text-xs font-bold uppercase tracking-wider">
                  Approved
                </span>
              )}

              {/* Conditional rendering sequence evaluating rejected status */}
              {student.status === 'rejected' && (
                // Red badge representing candidate application is rejected
                <span className="bg-red-50 text-red-700 border border-red-200 py-2 px-5 rounded-full text-xs font-bold uppercase tracking-wider">
                  Not Approved
                </span>
              )}
              
            </div>

            {/* Content area holding detailed status summaries based on HR review criteria */}
            <div className="mt-2">
              
              {/* Conditional block for APPROVED status */}
              {student.status === 'approved' && (
                // Green information box holding placement metadata details
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 text-emerald-900 text-sm space-y-4">
                  
                  {/* Grid structure presenting placement assignments details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-emerald-200/50 pb-4">
                    
                    {/* Placement Detail: Current Department in Rotation */}
                    <div className="flex flex-col">
                      
                      {/* Placement label updated to show current department */}
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
                        Current Department
                      </span>
                      
                      {/* Current department value from rotation system */}
                      <span className="text-sm font-bold">
                        {student.currentDepartment || 'Not assigned'}
                      </span>
                      
                    </div>

                    {/* Placement Detail: Start Date */}
                    <div className="flex flex-col">
                      
                      {/* Placement label */}
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
                        Start Date
                      </span>
                      
                      {/* Formatted starting date */}
                      <span className="text-sm font-mono font-bold">
                        {student.startDate ? new Date(student.startDate).toLocaleDateString() : 'To be scheduled'}
                      </span>
                      
                    </div>

                    {/* Placement Detail: End Date */}
                    <div className="flex flex-col">
                      
                      {/* Placement label */}
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
                        End Date
                      </span>
                      
                      {/* Formatted ending date */}
                      <span className="text-sm font-mono font-bold">
                        {student.endDate ? new Date(student.endDate).toLocaleDateString() : 'To be scheduled'}
                      </span>
                      
                    </div>
                    
                  </div>

                  {/* Operational directive warning interns to contact front desk */}
                  <p className="font-semibold pt-1">
                    Your internship is confirmed. Please report to HR on your start date.
                  </p>

                  {/* DEPARTMENT ROTATION PROGRESS — Shows student's rotation order and current progress through departments */}
                  {student.departmentRotationOrder && student.departmentRotationOrder.length === 4 && ( // Check if rotation order exists.
                    <div className="border-t border-emerald-200/50 pt-5 mt-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#12110e] mb-4 flex items-center gap-1.5">
                        🔄 Your Department Rotation Progress
                      </h4>
                      
                      {/* Progress visualization showing all 4 departments in rotation order */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-2">
                        {student.departmentRotationOrder.map((dept, index) => { // Loop through rotation order array.
                          // Determine status of each department based on student progress.
                          const isCompleted = student.completedDepartments && student.completedDepartments.includes(dept); // Check if department is in completed array - show green.
                          const isCurrent = student.currentDepartment === dept; // Check if this is current active department - show gold.
                          const isUpcoming = !isCompleted && !isCurrent; // Department not yet reached - show gray.
                          
                          return ( // Return card for this department in rotation.
                            <div 
                              key={index} 
                              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                                isCurrent 
                                  ? 'bg-white border-[#C9A84C] ring-2 ring-[#C9A84C]/10 shadow-xs' // Gold styling for current department.
                                  : isCompleted 
                                  ? 'bg-emerald-50 border-emerald-200 shadow-xs' // Green styling for completed departments.
                                  : 'bg-white/50 border-gray-200 opacity-60' // Gray styling for upcoming departments.
                              }`}
                            >
                              <div>
                                {/* Department status badge showing position in rotation */}
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                                    isCurrent ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : // Gold badge for current.
                                    isCompleted ? 'bg-emerald-100 text-emerald-700' : // Green badge for completed.
                                    'bg-gray-100 text-gray-400' // Gray badge for upcoming.
                                  }`}>
                                    Stage {index + 1} { /* Show position number in rotation sequence */ }
                                  </span>
                                  {/* Status indicator showing completed, active, or upcoming */}
                                  {isCompleted && ( // Show checkmark for completed departments.
                                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                      ✓ Done
                                    </span>
                                  )}
                                  {isCurrent && ( // Show active badge for current department with animation.
                                    <span className="text-[9px] font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                      Active Now
                                    </span>
                                  )}
                                  {isUpcoming && ( // Show upcoming label for not yet started departments.
                                    <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                      Upcoming
                                    </span>
                                  )}
                                </div>
                                {/* Department name */}
                                <h5 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">
                                  {dept} { /* Display department name from rotation order */ }
                                </h5>
                              </div>
                            </div>
                          ); // Close return.
                        })} { /* Close map loop */ }
                      </div>
                      {/* Informational note about rotation system */}
                      <p className="text-[10px] text-emerald-700/80 font-bold uppercase tracking-widest mt-4 leading-normal">
                        💡 Note: You will rotate through all 4 departments in the order shown above. HR will move you to the next department when ready.
                      </p>
                    </div>
                  )} { /* Close rotation progress conditional render */ }
                  
                </div>
              )}

              {/* Conditional block for REJECTED status */}
              {student.status === 'rejected' && (
                // Red information box outlining decision rejection notes
                <div className="bg-red-50 border border-red-200 rounded-lg p-5 text-red-900 text-sm space-y-3">
                  
                  {/* Rejection note details prefix header */}
                  <div className="flex flex-col">
                    
                    {/* Header caption */}
                    <span className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">
                      Reason for Decision
                    </span>
                    
                    {/* Rejection reason paragraph description */}
                    <p className="text-sm italic font-medium">
                      "{student.rejectionNote || 'No explanation provided by HR office.'}"
                    </p>
                    
                  </div>

                  {/* Separator block lines */}
                  <div className="w-full h-[1px] bg-red-200/50 my-2"></div>

                  {/* HR office direct helpline instruction */}
                  <p className="font-semibold">
                    Please contact HR at hr@rorihotel.com for more information.
                  </p>
                  
                </div>
              )}

              {/* Conditional block for PENDING status */}
              {student.status === 'pending' && (
                // Yellow informational message describing evaluation queues
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 text-amber-900 text-sm">
                  
                  {/* Detailed operational waiting message */}
                  <p className="leading-relaxed font-medium">
                    Your application is being reviewed by our HR team. You will receive an email notification when a decision is made. Please check your email regularly.
                  </p>
                  
                </div>
              )}
              
            </div>
            
          </div>
          
        </div>
      )}
      
    </DashboardLayout>
  );
};

// Export page representation默认.
export default StudentDashboard;
