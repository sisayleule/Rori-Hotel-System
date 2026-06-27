// This page shows HR a list of all student internship applications with filters and the ability to click into each one.
// It tracks statistical metrics and provides instant status-filtering capabilities.
import React, { useState, useEffect } from 'react'; // Import state and dynamic effect life cycle hooks.
// Import the standard React Router navigate driver hook.
import { useNavigate } from 'react-router-dom'; // Load traversal commands libraries.
// Import the core DashboardLayout wrapping parent frame.
import DashboardLayout from '../../components/DashboardLayout'; // Fetch common nested dashboard parent layout components.
// Import the Axios middleware instance.
import api from '../../utils/api'; // Load unified client-side network querying driver instances.

// Create a functional component called HRApplications.
const HRApplications = () => { // Begin functional component declaration.
  // students state stores the complete unprocessed array list of registered student documents from our database.
  const [students, setStudents] = useState([]); // Initialize student logs state to empty array.
  // filteredStudents state stores the subset of students to display on the viewport after status filtering.
  const [filteredStudents, setFilteredStudents] = useState([]); // Place filtered state initially as empty array.
  // activeFilter state keeps tracking of the currently selected status tab button.
  const [activeFilter, setActiveFilter] = useState('all'); // Set baseline default filter values to 'all'.
  // loading state tracking indicator representing background fetching state.
  const [loading, setLoading] = useState(true); // Place initial loading status to standard true conditions.
  // error state saves failure alert messages from database or connection limits.
  const [error, setError] = useState(''); // Keep target fallback message string empty initially.

  // Get the navigate function from useNavigate.
  const navigate = useNavigate(); // Initialize routing instantiator hook.

  // Add a useEffect that runs once on mount to load initial records.
  useEffect(() => { // Start page bootstrapping reactions.
    const fetchStudents = async () => { // Declare an asynchronous data loader function.
      try { // Start error trapping context.
        const response = await api.get('/applications'); // Send GET to /applications using api.get.
        setStudents(response.data); // Set students data array state values.
        setFilteredStudents(response.data); // Set filteredStudents data array state values as the initial baseline.
      } catch (err) { // Trap execution failure.
        console.error('Failed to load students list:', err); // Log details onto diagnostic console.
        setError('could not load student applications please refresh'); // Update user error state message.
      } finally { // Finalize operations sequence.
        setLoading(false); // Disable screen loading loader.
      } // Complete try catch block.
    }; // Terminate fetchStudents declaration.

    fetchStudents(); // Call fetch subroutines immediately on start.
  }, []); // Run effect exactly once on mount.

  // Add a second useEffect that depends on activeFilter and students variables to filter items on the fly.
  useEffect(() => { // Launch tracking hooks for selection modifications.
    if (activeFilter === 'all') { // Check if 'all' filter is active.
      setFilteredStudents(students); // Output full student collections dataset.
    } else { // Handle specific single filters routing conditions.
      const matched = students.filter(student => student.status === activeFilter); // Filter records matching criteria.
      setFilteredStudents(matched); // Update status filtered records lists.
    } // End condition checks.
  }, [activeFilter, students]); // Bind effect to activeFilter and students updates.

  // Create handleFilterChange function to update filter variables.
  const handleFilterChange = (filterString) => { // Accept string filter parameter.
    setActiveFilter(filterString); // Set activeFilter state.
  }; // Terminate filter changes subroutines.

  // Create handleViewProfile function to route user to student details screens.
  const handleViewProfile = (studentId) => { // Accept student database key parameter.
    navigate(`/hr/applications/${studentId}`); // Navigate to the target page with student identifier.
  }; // Terminate view detail action handlers.

  // Create helper function called getStatusBadge to return dynamic color style descriptors.
  const getStatusBadge = (statusValue) => { // Accept current student status parameter.
    const normalized = (statusValue || '').toLowerCase(); // Standardize characters case.
    if (normalized === 'pending') { // Match pending value configurations.
      return 'bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full'; // Return amber styling classes.
    } // End verification block.
    if (normalized === 'approved') { // Match approved value configurations.
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full'; // Return green styling classes.
    } // End verification block.
    if (normalized === 'rejected') { // Match rejected value configurations.
      return 'bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full'; // Return red styling classes.
    } // End verification block.
    return 'bg-gray-100 text-gray-700 border border-gray-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full'; // Return neutral default gray classes.
  }; // Close getStatusBadge helper scope.

  // Count helper maps for metrics cards.
  const pendingCount = students.filter(student => student.status === 'pending').length; // Filter pending counts inline.
  const approvedCount = students.filter(student => student.status === 'approved').length; // Filter approved counts inline.
  const rejectedCount = students.filter(student => student.status === 'rejected').length; // Filter rejected counts inline.

  // Define backend uploads prefix for file viewing.
  const backendServerUrl = `${window.location.origin}/`; // Set fallback backend base attachment links.

  return ( // Start returning JSX layout.
    <DashboardLayout role="hr" pageTitle="Applications"> 
      
      {/* SECTION ONE — Page header and stats row */}
      <div className="flex flex-col font-sans select-none"> 
        
        {/* Main section typography header */}
        <h2 className="text-2xl font-serif font-black text-gray-900 mb-6"> 
          Student Applications 
        </h2> 

        {/* Quick telemetry indices stats cards grid row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"> 
          
          {/* Card one: Total applications count */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center shadow-2xs"> 
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Total Applications</span> 
            <span className="text-3xl font-serif font-black text-gray-900">{students.length}</span> 
          </div> 

          {/* Card two: Pending registries count */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center shadow-2xs"> 
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Pending</span> 
            <span className="text-3xl font-serif font-black text-amber-500">{pendingCount}</span> 
          </div> 

          {/* Card three: Approved registries count */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center shadow-2xs"> 
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Approved</span> 
            <span className="text-3xl font-serif font-black text-emerald-600">{approvedCount}</span> 
          </div> 

          {/* Card four: Rejected registries count */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center shadow-2xs"> 
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Rejected</span> 
            <span className="text-3xl font-serif font-black text-rose-500">{rejectedCount}</span> 
          </div> 

        </div> 

        {/* SECTION TWO — Filter selection buttons tab row */}
        <div className="flex flex-wrap gap-2.5 mb-6"> 
          
          {/* Button: Filter all records */}
          <button 
            onClick={() => handleFilterChange('all')} // Set filter status as 'all'.
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              activeFilter === 'all' 
                ? 'bg-[#C9A84C] text-[#12110e] shadow-xs' // Active button colors style.
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50' // Inactive state colors.
            }`} 
          > 
            All Students 
          </button> 

          {/* Button: Filter pending records */}
          <button 
            onClick={() => handleFilterChange('pending')} // Set filter status as 'pending'.
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              activeFilter === 'pending' 
                ? 'bg-[#C9A84C] text-[#12110e] shadow-xs' // Active button colors style.
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50' // Inactive state colors.
            }`} 
          > 
            Pending 
          </button> 

          {/* Button: Filter approved records */}
          <button 
            onClick={() => handleFilterChange('approved')} // Set filter status as 'approved'.
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              activeFilter === 'approved' 
                ? 'bg-[#C9A84C] text-[#12110e] shadow-xs' // Active button colors style.
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50' // Inactive state colors.
            }`} 
          > 
            Approved 
          </button> 

          {/* Button: Filter rejected records */}
          <button 
            onClick={() => handleFilterChange('rejected')} // Set filter status as 'rejected'.
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              activeFilter === 'rejected' 
                ? 'bg-[#C9A84C] text-[#12110e] shadow-xs' // Active button colors style.
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50' // Inactive state colors.
            }`} 
          > 
            Rejected 
          </button> 

        </div> 

        {/* SECTION THREE — Applications visual rendering table board */}
        <div className="flex flex-col mt-2"> 
          
          {/* Conditional loading UI block */}
          {loading && ( // Check if network elements are being read.
            <div className="flex items-center justify-center py-16"> 
              <p className="text-sm font-semibold tracking-wider uppercase text-gray-400"> 
                Loading applications... 
              </p> 
            </div> // Terminate loading box.
          )} 

          {/* Conditional diagnostic error banner */}
          {!loading && error && ( // Evaluate if network operations raised faults.
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-semibold mb-4 text-center"> 
              {error} 
            </div> // Terminate error alert.
          )} 

          {/* Conditional empty fallback notifications banner */}
          {!loading && !error && filteredStudents.length === 0 && ( // Evaluate if matching results are empty.
            <div className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-2xs"> 
              <p className="text-sm font-semibold text-gray-400"> 
                No applications found for this filter. 
              </p> 
            </div> // Terminate fallback warning container.
          )} 

          {/* Main Applications Table display mapping */}
          {!loading && !error && filteredStudents.length > 0 && ( // Create grid box only if students load successfully.
            <div className="bg-white rounded-xl shadow-xs border border-gray-150 overflow-hidden w-full"> 
              
              {/* Horizontal rolling wrapper */}
              <div className="overflow-x-auto"> 
                
                {/* Table element */}
                <table className="w-full text-left border-collapse select-none"> 
                  
                  {/* Table headers */}
                  <thead> 
                    <tr className="bg-[#faf8f5] border-b border-gray-150 text-[10px] font-black uppercase tracking-wider text-gray-500"> 
                      <th className="px-5 py-4">Name</th> 
                      <th className="px-5 py-4">University</th> 
                      <th className="px-5 py-4">Department Preference</th> 
                      <th className="px-5 py-4">Applied Date</th> 
                      <th className="px-5 py-4 text-center">Status</th> 
                      <th className="px-5 py-4 text-center">Action</th> 
                    </tr> 
                  </thead> 
                  
                  {/* Table records looping context */}
                  <tbody> 
                    {filteredStudents.map((student) => { // Render each row.
                      const userAccount = student.userId || {}; // Safely read populated user metadata.
                      const studentName = userAccount.fullName || 'Anonymous Candidate'; // Extract name values.
                      
                      return ( // Process HTML table rows.
                        <tr 
                          key={student._id} 
                          className="border-b border-gray-100 transition-colors duration-200 hover:bg-[#faf8f5]/45 text-sm"
                        > 
                          
                          {/* Name column centering avatar photos */}
                          <td className="px-5 py-4 flex items-center gap-3"> 
                            
                            {/* Round avatar wrapper */}
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200"> 
                              {student.profilePhoto ? ( // Check if candidate has uploaded avatar photo.
                                <img 
                                  src={student.profilePhoto.startsWith('http') ? student.profilePhoto : `${backendServerUrl}${student.profilePhoto}`} // Target backend files paths or Cloudinary.
                                  alt={studentName} // Render helpful labels.
                                  referrerPolicy="no-referrer" // Add standard iframe reference headers.
                                  className="w-full h-full object-cover" 
                                /> 
                              ) : ( // Render fallback abbreviation badge.
                                <span className="text-xs font-extrabold text-gray-500 text-center select-none uppercase"> 
                                  {studentName.charAt(0)} 
                                </span> 
                              )} 
                            </div> 

                            {/* Standard candidate fullname */}
                            <span className="font-bold text-gray-800 leading-tight"> 
                              {studentName} 
                            </span> 

                          </td> 

                          {/* University title cell */}
                          <td className="px-5 py-4 font-medium text-gray-600"> 
                            {student.universityName} 
                          </td> 

                          {/* Targeted department preference code */}
                          <td className="px-5 py-4 font-bold text-gray-500"> 
                            {student.departmentPreference} 
                          </td> 

                          {/* Record timestamp formatting */}
                          <td className="px-5 py-4 font-mono text-gray-400 text-xs font-semibold"> 
                            {new Date(student.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })} 
                          </td> 

                          {/* Multi-colored status bubble */}
                          <td className="px-5 py-4 text-center"> 
                            <span className={getStatusBadge(student.status)}> 
                              {student.status || 'pending'} 
                            </span> 
                          </td> 

                          {/* Inspection trigger operations cell */}
                          <td className="px-5 py-4 text-center"> 
                            <button 
                              onClick={() => handleViewProfile(student._id)} // Navigate on clicks actions.
                              className="bg-[#C9A84C] hover:bg-[#b59540] text-[#12110e] text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-2 rounded-xl transition-all duration-300 shadow-2xs hover:shadow-xs cursor-pointer select-none" 
                            > 
                              View Profile 
                            </button> 
                          </td> 

                        </tr> 
                      ); // Terminate single rows layout markup mapping.
                    })} 
                  </tbody> 

                </table> 
                
              </div> 
              
            </div> // Terminate table border wrapper.
          )} 

        </div> 
        
      </div> 

    </DashboardLayout> 
  ); // Terminate JSX returns.
}; // Close functional component.

export default HRApplications; // Export HR applications list component as default.
