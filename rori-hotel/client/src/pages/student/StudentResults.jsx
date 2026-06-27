// This page shows the student their final internship result including scores per department and a certificate download button.
// It integrates remote evaluations database queries and displays progress score bars.
import React, { useState, useEffect } from 'react'; // Import React state and lifecycle hooks.
// Import the custom DashboardLayout scaffolding wrapper component.
import DashboardLayout from '../../components/DashboardLayout'; // Fetch common nested dashboard parent layout components.
// Import the preconfigured Axios network client instance.
import api from '../../utils/api'; // Load unified client-side network querying driver instances.

// Create the StudentResults functional component.
const StudentResults = () => { // Begin functional component declaration.
  // result state stores the detailed final internship grade document.
  const [result, setResult] = useState(null); // Place initial result state to null.
  // published state tracks whether HR has verified and published this document.
  const [published, setPublished] = useState(false); // Place initial publication state to false.
  // loading state keeps tracking of network operations.
  const [loading, setLoading] = useState(true); // Place initial loading status to, standard true condition.
  // error state saves failure alert messages from database or connection limits.
  const [error, setError] = useState(''); // Keep target fallback message string empty initially.

  // Run initial mounting hooks that fetch and load internship outcomes from our backend service.
  useEffect(() => { // Start page bootstrapping reactions.
    const fetchResult = async () => { // Declare an asynchronous data loader function.
      try { // Start error trapping context.
        const response = await api.get('/students/my-results'); // Fire GET query on my-results endpoint path.
        setPublished(response.data.published); // Set published status using returned response data property.
        if (response.data.published) { // Check if evaluation is fully published.
          setResult(response.data.result); // Save evaluation details payload inside result state.
        } // End verification check.
      } catch (err) { // Trap execution failure.
        console.error('Failed to load final results:', err); // Log details onto diagnostic console.
        setError('could not load evaluation records please refresh'); // Update user error state message.
      } finally { // Finalize operations sequence.
        setLoading(false); // Disable screen loading loader.
      } // Complete try catch block.
    }; // Terminate fetchResult declaration.

    fetchResult(); // Call fetch subroutines immediately on start.
  }, []); // Run effect exactly once on mount.

  // Define backend URL prefix for certificate download links.
  const backendBaseUrl = import.meta.env.VITE_API_URL || `${window.location.origin}/api`; // Safely extract API base address.

  // Function to download certificate with authentication token
  const downloadCertificate = async () => { // Define async download function.
    try { // Start error handling block.
      // Get authentication token from localStorage - using correct key 'roriToken'
      const token = localStorage.getItem('roriToken'); // Retrieve stored JWT token with correct key.
      
      // Check if token exists
      if (!token) { // Validate token presence.
        alert('Please log in to download your certificate'); // Show error message.
        return; // Exit function early.
      } // Close token check.
      
      // Make authenticated request to download certificate
      const response = await fetch(`${backendBaseUrl}/results/${result.studentId}/certificate`, { // Send GET request.
        method: 'GET', // Use GET method.
        headers: { // Set request headers.
          'Authorization': `Bearer ${token}` // Include JWT token in Authorization header.
        } // Close headers.
      }); // Close fetch.
      
      // Check if request was successful
      if (!response.ok) { // Check response status.
        const errorData = await response.json(); // Parse error response.
        alert(errorData.message || 'Failed to download certificate'); // Show error message.
        return; // Exit function.
      } // Close response check.
      
      // Convert response to blob (binary data)
      const blob = await response.blob(); // Get PDF as blob.
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob); // Create object URL.
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a'); // Create anchor element.
      link.href = url; // Set href to blob URL.
      link.download = `Certificate-${result.studentId}.pdf`; // Set download filename.
      document.body.appendChild(link); // Add link to DOM.
      link.click(); // Trigger download.
      
      // Clean up - remove link and revoke object URL
      document.body.removeChild(link); // Remove link from DOM.
      window.URL.revokeObjectURL(url); // Free memory by revoking object URL.
    } catch (err) { // Catch any errors.
      console.error('Error downloading certificate:', err); // Log error to console.
      alert('Failed to download certificate. Please try again.'); // Show error message to user.
    } // Close try-catch.
  }; // Close downloadCertificate function.

  return ( // Start returning JSX layout.
    <DashboardLayout role="student" pageTitle="My Results"> 
      
      {/* SECTION ZERO - Loading screen container */}
      {loading && ( // Check if load flags are active.
        <div className="flex items-center justify-center py-20 font-sans"> 
          <p className="text-sm font-semibold tracking-wider uppercase text-gray-400"> 
            Loading final result records... 
          </p> 
        </div> // Terminate loading container.
      )} 

      {/* SECTION ZERO POINT FIVE - Diagnostic failure warnings banner */}
      {!loading && error && ( // Evaluate if error messages exist.
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-semibold mb-4 text-center font-sans"> 
          {error} 
        </div> // Close error container.
      )} 

      {/* SECTION ONE - Results Not Yet Available card view */}
      {!loading && !error && !published && ( // Check if results are unpublished.
        <div className="flex flex-col items-center justify-center py-16 px-6 max-w-lg mx-auto text-center font-sans bg-white border border-gray-100 rounded-xl shadow-xs select-none mt-8"> 
          <span role="img" aria-label="clock" className="text-5xl mb-4 block">🕒</span> 
          <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-3"> 
            Results Not Yet Available 
          </h2> 
          <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-medium"> 
            Your internship result will appear here once HR has reviewed all supervisor scores and published your final evaluation. Please check back later. 
          </p> 
        </div> // Close results pending block.
      )} 

      {/* SECTION TWO - Published final evaluation sheets layout */}
      {!loading && !error && published && result && ( // Evaluate if evaluation sheet is active.
        <div className="flex flex-col font-sans max-w-4xl mx-auto"> 
          
          {/* Card Container One: Overall Grades Block */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 text-center flex flex-col items-center justify-center mb-6 select-none"> 
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C9A84C] mb-2 font-sans block"> 
              Final Internship Score 
            </span> 
            <h1 className="font-serif text-5xl md:text-6xl font-black text-[#C9A84C] block mb-4"> 
              {result.overallScore} <span className="text-sm font-sans font-bold text-gray-400">out of 100</span> 
            </h1> 
            <div className="inline-flex items-center gap-1.5 bg-[#C9A84C]/10 text-[#C9A84C] font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-[#C9A84C]/20 uppercase tracking-wider mb-4"> 
              ⭐ Best Performing Department: {result.bestDepartment} 
            </div> 
            <span className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider select-none"> 
              Published On: {new Date(result.publishedAt || result.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} 
            </span> 
          </div> 

          {/* Card Container: Achievement Badges Display */}
          {result.badges && result.badges.length > 0 && ( // Check if badges array exists and has items.
            <div className="bg-gradient-to-br from-[#FFF8E7] to-white rounded-xl shadow-xs border border-[#C9A84C]/30 p-6 mb-6"> 
              {/* Section header with trophy emoji */}
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2"> 
                <span className="text-lg">🏆</span>
                <span>Achievement Badges</span>
              </h3> 
              
              {/* Badge grid layout - responsive columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"> 
                {result.badges.map((badge, index) => ( // Loop through each badge in badges array.
                  <div 
                    key={index} // Use index as key for badge rendering.
                    className="bg-white rounded-lg p-4 border-2 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-default" // Badge card with hover effect.
                    style={{ borderColor: badge.color || '#C9A84C' }} // Use badge's color for border or default to gold.
                  > 
                    {/* Badge emoji at top */}
                    <div className="text-3xl mb-2 text-center"> 
                      {badge.emoji || '🏅'} { /* Display badge emoji or default medal */ }
                    </div> 
                    
                    {/* Badge name title */}
                    <h4 
                      className="text-xs font-extrabold uppercase tracking-wider text-center mb-1" // Badge name styling.
                      style={{ color: badge.color || '#C9A84C' }} // Use badge's color for text.
                    > 
                      {badge.name} { /* Display badge name like "Excellence Award" */ }
                    </h4> 
                    
                    {/* Badge description text */}
                    <p className="text-[10px] text-gray-600 text-center leading-relaxed font-medium"> 
                      {badge.description} { /* Display why badge was earned */ }
                    </p> 
                  </div> 
                ))} 
              </div> 
              
              {/* Congratulatory message below badges */}
              <p className="text-xs text-gray-500 text-center mt-4 italic font-medium"> 
                🎉 Congratulations on earning {result.badges.length} achievement badge{result.badges.length !== 1 ? 's' : ''}!
              </p> 
            </div> 
          )} 

          {/* Subheader heading for departmental grades */}
          <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest mb-4"> 
            Department Scores 
          </h3> 

          {/* Card Container Two: Department Score bars */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 flex flex-col space-y-6"> 
            {result.departmentFeedback && result.departmentFeedback.map((item, index) => { // Loop through departmentFeedback list.
              return ( // Output feedback row items.
                <div key={index} className="pb-5 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0"> 
                  
                  {/* Department name label */}
                  <span className="text-sm font-bold text-gray-800 leading-tight block mb-2"> 
                    {item.departmentName || item.department} 
                  </span> 
                  
                  {/* Progress chart horizontal layout bar container */}
                  <div className="flex items-center gap-4 w-full"> 
                    
                    {/* Background bar element with overflow clipping */}
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden"> 
                      
                      {/* Active filled golden indicator bar matching score proportions */}
                      <div 
                        className="bg-[#C9A84C] h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${item.score}%` }} // Inline mapping width matching target item score values as percentage.
                      /> 
                      
                    </div> 
                    
                    {/* Score fraction label */}
                    <span className="text-xs font-extrabold text-gray-700 min-w-[50px] text-right font-mono select-none"> 
                      {item.score} / 100 
                    </span> 
                    
                  </div> 

                  {/* Written Supervisor Feedback text block */}
                  <p className="text-xs italic text-gray-500 mt-2 block leading-relaxed whitespace-pre-line font-sans"> 
                    💬 "{item.feedback || 'No written feedback provided'}" 
                  </p> 

                  {/* Recommendation comments display label */}
                  {item.recommendation && ( // Check if recommendation comments exist.
                    <p className="text-xs text-gray-500 mt-1 font-semibold block leading-relaxed font-sans"> 
                      💡 Recommendation: {item.recommendation} 
                    </p> 
                  )} 

                </div> 
              ); // Close department feedback loop returns.
            })} 
          </div> 

          {/* Card Container Three: HR General Summary Comments */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 mt-6"> 
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest mb-3"> 
              HR Feedback and Recommendation 
            </h3> 
            <p className="text-xs md:text-sm text-gray-650 leading-relaxed font-medium whitespace-pre-line font-sans italic p-4 bg-[#faf8f5]/65 rounded-lg border border-gray-50"> 
              {result.hrGeneralFeedback || 'Successfully completed overall internship program with positive records.'} 
            </p> 
          </div> 

          {/* SECTION FOUR — Certificate downloading widget */}
          <div className="text-center mt-10 mb-6 flex flex-col items-center"> 
            
            {/* Completion indicator caption */}
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3.5 select-none font-sans"> 
              Your internship completion certificate is ready to download 
            </p> 

            {/* Certificate downloading button with authentication */}
            <button 
              // Handle click event to trigger authenticated certificate download
              onClick={downloadCertificate} // Call download function with authentication.
              // Style button in elegant large gold background with hover effects
              className="inline-flex items-center gap-2.5 bg-[#C9A84C] hover:bg-[#b59540] text-[#12110e] text-xs font-bold uppercase tracking-wider px-6 py-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer select-none font-sans" 
            > 
              📜 Download Certificate 
            </button> 

          </div> 

        </div> 
      )} 

    </DashboardLayout> 
  ); // Terminate JSX returns.
}; // Close functional component.

export default StudentResults; // Export results page module defaults.
