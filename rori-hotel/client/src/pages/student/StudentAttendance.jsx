// This page shows the student their full attendance history and a summary.
// It integrates remote database records and formats hours worked and punctuality metrics.
import React, { useState, useEffect } from 'react'; // Import useState hook to reactively manage lists and numbers states.
// Import the standard React useEffect hook to manage network fetch lifecycles.
import { useEffect as useReaction } from 'react'; // Alias useEffect to prevent double triggers if needed or keep standard imports.
// Import standard custom layout wrapper.
import DashboardLayout from '../../components/DashboardLayout'; // Fetch common nested dashboard parent layout components.
// Import the custom backend Axios instance configuring relative endpoints and token authorization.
import api from '../../utils/api'; // Load unified client-side network querying driver instances.

// Create the StudentAttendance functional component.
const StudentAttendance = () => { // Begin functional component declaration.
  // records state stores the list of student's past daily attendance documents.
  const [records, setRecords] = useState([]); // Initialize records with an empty array.
  // summary state stores computed statistics like totalDays, presenting rates, punctuality ratio, etc.
  const [summary, setSummary] = useState(null); // Place initial stats state to null.
  // loading state keeps tracking of network operations before presenting stats cards.
  const [loading, setLoading] = useState(true); // Place initial loading status to, standard true condition.
  // error state saves failure alert messages from database or connection limits.
  const [error, setError] = useState(''); // Keep target fallback message string empty initially.

  // Define helper function to turn time strings into hours and minutes difference.
  const calculateDuration = (inTime, outTime) => { // Setup function parameters.
    if (!inTime || !outTime) { // Check if either value parameter is missing.
      return '-'; // Return standard dash.
    } // End verification validation check.
    const inParts = inTime.split(':'); // Split clockIn elements on colon character.
    const inHour = parseInt(inParts[0], 10); // Parse hours integer from left split string.
    const inMin = parseInt(inParts[1], 10); // Parse minutes integer from right split string.
    const outParts = outTime.split(':'); // Split clockOut elements on colon character.
    const outHour = parseInt(outParts[0], 10); // Parse hours integer from left split string.
    const outMin = parseInt(outParts[1], 10); // Parse minutes integer from right split string.
    const totalInMinutes = inHour * 60 + inMin; // Represent clockIn time as total minute count.
    const totalOutMinutes = outHour * 60 + outMin; // Represent clockOut time as total minute count.
    let differenceMinutes = totalOutMinutes - totalInMinutes; // Calculate duration as simple arithmetic delta.
    if (differenceMinutes < 0) { // Check if shift spans past midnight.
      differenceMinutes = differenceMinutes + 24 * 60; // Add 24-hours equivalent of minutes to correct layout.
    } // End crossover correction block.
    const finalHours = Math.floor(differenceMinutes / 60); // Compute standard final hours blocks.
    const finalMinutes = differenceMinutes % 60; // Compute residual minutes remainder.
    return `${finalHours}h ${finalMinutes}m`; // Format into human readable durations like 8h 15m.
  }; // Close calculateDuration function block.

  // Run initial mounting hooks that fetch and load attendance data from our backend service.
  useEffect(() => { // Start page bootstrapping reactions.
    const fetchAttendance = async () => { // Declare an asynchronous data loader function.
      try { // Start error trapping context.
        const responseData = await api.get('/students/my-attendance'); // Fire network fetch request on endpoint.
        setRecords(responseData.data.records); // Populate records state array values.
        setSummary(responseData.data.summary); // Populate summary stats properties.
      } catch (err) { // Trap execution failure.
        console.error('Failed to load attendance logs:', err); // Log details onto diagnostic console.
        setError('could not load attendance records please refresh'); // Update user error state message.
      } finally { // Finalize operations sequence.
        setLoading(false); // Disable screen loading loader.
      } // Complete try catch block.
    }; // Terminate fetchAttendance declaration.

    fetchAttendance(); // Call fetch subroutines immediately on start.
  }, []); // Run effect exactly once on mount.

  return ( // Start returning JSX layout.
    <DashboardLayout role="student" pageTitle="Attendance"> 
      
      {/* SECTION ZERO - Loading screen container */}
      {loading && ( // Check if load flags are active.
        <div className="flex items-center justify-center py-20"> 
          <p className="text-sm font-semibold tracking-wider uppercase text-gray-400 font-sans"> 
            Loading attendance records... 
          </p> 
        </div> // Terminate loading container.
      )} 

      {/* SECTION ZERO POINT FIVE - Diagnostic failure warnings banner */}
      {!loading && error && ( // Evaluate if error messages exist.
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-semibold mb-4 text-center"> 
          {error} 
        </div> // Close error container.
      )} 

      {/* SECTION ONE — Summary metrics dashboards row */}
      {!loading && !error && summary && ( // If information exists, print page grid headers.
        <div className="flex flex-col font-sans"> 
          
          {/* Main dashboard description detailing telemetry data metrics */}
          <div className="mb-6"> 
            <p className="text-sm text-gray-500 font-sans"> 
              Review your overall metrics, tardiness indices, and parsed historical check-in times below. 
            </p> 
          </div> 

          {/* Grid div responsive layout dividing standard stats details */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"> 
            
            {/* Card One: Number of overall registered days */}
            <div className="bg-white rounded-xl shadow-xs p-5 hover:shadow-md border border-gray-100 flex flex-col items-center justify-center text-center select-none transition-all duration-300"> 
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Total Days</span> 
              <span className="text-3xl font-serif font-black text-gray-900">{summary.totalDays}</span> 
            </div> 

            {/* Card Two: Present checks count */}
            <div className="bg-white rounded-xl shadow-xs p-5 hover:shadow-md border border-gray-100 flex flex-col items-center justify-center text-center select-none transition-all duration-300"> 
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Days Present</span> 
              <span className="text-3xl font-serif font-black text-emerald-600">{summary.presentDays}</span> 
            </div> 

            {/* Card Three: Tardiness checks count */}
            <div className="bg-white rounded-xl shadow-xs p-5 hover:shadow-md border border-gray-100 flex flex-col items-center justify-center text-center select-none transition-all duration-300"> 
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Late Arrivals</span> 
              <span className="text-3xl font-serif font-black text-amber-500">{summary.lateDays}</span> 
            </div> 

            {/* Card Four: Computational ratios scoring */}
            <div className="bg-white rounded-xl shadow-xs p-5 hover:shadow-md border border-gray-100 flex flex-col items-center justify-center text-center select-none transition-all duration-300"> 
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Punctuality</span> 
              <span className="text-3xl font-serif font-black text-[#C9A84C]">{summary.punctualityPercent}%</span> 
            </div> 

          </div> 

          {/* SECTION TWO — Attendance records logs table */}
          <div className="mt-2 flex flex-col"> 
            
            {/* Header label for list files */}
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4"> 
              Clocking History 
            </h3> 

            {/* Render help info paragraph if records history array is completely empty */}
            {records.length === 0 ? ( // Check if array has no values.
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-xs"> 
                <p className="text-sm font-medium text-gray-400 leading-relaxed font-sans"> 
                  No attendance records yet. Records will appear here after your first QR code scan at any department. 
                </p> 
              </div> // Terminate fallback container.
            ) : ( // Render table if logs exist in records.
              <div className="bg-white rounded-xl shadow-xs border border-gray-150 overflow-hidden w-full"> 
                
                {/* Horizontal scrolling table block wrapper */}
                <div className="overflow-x-auto"> 
                  
                  {/* Table element */}
                  <table className="w-full text-left border-collapse select-none"> 
                    
                    {/* Table head metadata */}
                    <thead> 
                      <tr className="bg-[#faf8f5] border-b border-gray-150"> 
                        <th className="text-[10px] font-black uppercase tracking-wider text-gray-500 px-5 py-4">Date</th> 
                        <th className="text-[10px] font-black uppercase tracking-wider text-gray-500 px-5 py-4">Department</th> 
                        <th className="text-[10px] font-black uppercase tracking-wider text-gray-500 px-5 py-4">Clock In</th> 
                        <th className="text-[10px] font-black uppercase tracking-wider text-gray-500 px-5 py-4">Clock Out</th> 
                        <th className="text-[10px] font-black uppercase tracking-wider text-gray-500 px-5 py-4">Hours Worked</th> 
                        <th className="text-[10px] font-black uppercase tracking-wider text-gray-500 px-5 py-4 text-center">Status</th> 
                      </tr> 
                    </thead> 
                    
                    {/* Table body dataset */}
                    <tbody> 
                      {records.map((record, index) => { // Map through index keys tracking styles.
                        return ( // Output layout rows.
                          <tr 
                            key={record._id} 
                            // Alternating backgrounds based on index values
                            className={`border-b border-gray-100 transition-colors duration-200 hover:bg-gray-50 text-sm ${
                              index % 2 === 0 ? 'bg-white' : 'bg-[#faf8f5]/60'
                            }`}
                          > 
                            
                            {/* Cell one: Date string formatted with LocaleDateString */}
                            <td className="px-5 py-3.5 font-medium text-gray-800"> 
                              {new Date(record.date).toLocaleDateString(undefined, {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })} 
                            </td> 

                            {/* Cell two: Logged department office location */}
                            <td className="px-5 py-3.5 font-bold text-gray-700"> 
                              {record.department} 
                            </td> 

                            {/* Cell three: Active clockInn hours log or dash */}
                            <td className="px-5 py-3.5 font-mono text-gray-600 font-semibold"> 
                              {record.clockIn || '-'} 
                            </td> 

                            {/* Cell four: Active clockOut hours log or dash */}
                            <td className="px-5 py-3.5 font-mono text-gray-600 font-semibold"> 
                              {record.clockOut || '-'} 
                            </td> 

                            {/* Cell five: Mathematical parsed evaluation string */}
                            <td className="px-5 py-3.5 font-mono text-gray-600 font-bold"> 
                              {calculateDuration(record.clockIn, record.clockOut)} 
                            </td> 

                            {/* Cell six: Dynamic status badge container */}
                            <td className="px-5 py-3.5 flex items-center justify-center"> 
                              
                              {/* Option One: Lated condition */}
                              {record.isLate && ( 
                                <span className="bg-amber-50 text-amber-700 border border-amber-200 rounded px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"> 
                                  Late 
                                </span> 
                              )} 

                              {/* Option Two: Present onTime condition */}
                              {!record.isLate && record.clockIn && ( 
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"> 
                                  On Time 
                                </span> 
                              )} 

                              {/* Option Three: Absent condition */}
                              {!record.clockIn && ( 
                                <span className="bg-red-50 text-red-700 border border-red-200 rounded px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"> 
                                  Absent 
                                </span> 
                              )} 

                            </td> 

                          </tr> 
                        ); // Close map return tags block.
                      })} 
                    </tbody> 

                  </table> 
                  
                </div> 
                
              </div> // Terminate table border wrap.
            )} 

          </div> 
          
        </div> 
      )} 

    </DashboardLayout> 
  ); // Terminate JSX returns.
}; // Close functional component.

export default StudentAttendance; // Export attendance page module defaults.
