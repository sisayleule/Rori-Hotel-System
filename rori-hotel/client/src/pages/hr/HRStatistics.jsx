// This page shows HR a full analytics overview of the internship program including charts and leaderboard.
import React, { useState, useEffect } from 'react'; // Import state and effect hooks from the React core library.
import DashboardLayout from '../../components/DashboardLayout'; // Import DashboardLayout responsive framework component.
import api from '../../utils/api'; // Import standard configured Axios interface utility.
import { // Begin standard recharts UI visual graphics elements import.
  BarChart, // Import BarChart component for division comparison stats.
  Bar, // Import Bar graphic component to draw values.
  XAxis, // Import horizontal coordinates interface node.
  YAxis, // Import vertical coordinates interface node.
  CartesianGrid, // Import background grid mesh helper.
  Tooltip, // Import hover info popups.
  ResponsiveContainer, // Import responsive layout container wrapper.
  LineChart, // Import LineChart component for monthly registrations.
  Line // Import Line path component to build timeline threads.
} from 'recharts'; // End import definitions from recharts.
// Define functional component called HRStatistics.
const HRStatistics = () => { // Begin component definitions block.
  // Declare react state to store overview metrics and charts details with comments.
  const [overview, setOverview] = useState(null); // stores the main statistics numbers payload.
  const [departmentScores, setDepartmentScores] = useState([]); // stores average score per department for bar chart.
  const [monthlyData, setMonthlyData] = useState([]); // stores monthly registration counts for line chart.
  const [topStudents, setTopStudents] = useState([]); // stores top 3 students for leaderboard.
  const [loading, setLoading] = useState(true); // true while all data is being fetched.
  const [error, setError] = useState(''); // stores error message details.
  // Declare useEffect hook to load database analytics when view mounts.
  useEffect(() => { // Begin mount effect hook.
    // Create an async function called fetchAllStats to fetch all endpoints.
    const fetchAllStats = async () => { // Begin fetch routine definition.
      try { // Start safety try wrapper.
        setLoading(true); // Turn on active loading screen spinner.
        setError(''); // Reset error traces to default.
        // Use Promise.all to fetch all 4 statistics endpoints simultaneously.
        const [overviewRes, scoresRes, monthlyRes, topRes] = await Promise.all([ // Destructure results array.
          api.get('/statistics/overview'), // Request dashboard overview calculations index.
          api.get('/statistics/scores'), // Request department score averages ratings array.
          api.get('/statistics/monthly'), // Request chronological registration timelines statistics.
          api.get('/statistics/top-students') // Request top performers leaderboard data.
        ]); // End Promise.all request execution.
        setOverview(overviewRes.data); // Set overview state to the first response data.
        setDepartmentScores(scoresRes.data); // Set departmentScores to the second response data.
        setMonthlyData(monthlyRes.data); // Set monthlyData to the third response data.
        setTopStudents(topRes.data); // Set topStudents to the fourth response data.
      } catch (err) { // Trap connection exceptions.
        console.error('Error fetching statistics:', err); // Log diagnostic details onto debugger terminal.
        setError('could not load statistics please refresh the page'); // Set error state status.
      } finally { // Run finally block.
        setLoading(false); // Set loader state to false when everything completes.
      } // End try-catch-finally block.
    }; // End fetchAllStats helper function definition.
    fetchAllStats(); // Call the fetchAllStats routine.
  }, []); // Run exact single mount routine.
  // Create helper getRankStyle function.
  const getRankStyle = (rank) => { // Begin function.
    if (rank === 1) { // Check if rank matches gold medal position.
      return { bg: 'bg-[#D4AF37]', text: 'text-[#D4AF37]', emoji: '🏆' }; // returns a string with gold color and a trophy emoji prefix.
    } else if (rank === 2) { // Check if rank matches silver medal position.
      return { bg: 'bg-[#9CA3AF]', text: 'text-gray-500', emoji: '🥈' }; // returns silver color which is a gray shade and a medal emoji prefix.
    } else if (rank === 3) { // Check if rank matches bronze position.
      return { bg: 'bg-[#CD7F32]', text: 'text-[#CD7F32]', emoji: '🥉' }; // returns a bronze color which is an orange-brown shade and a medal emoji prefix.
    } // End rating index evaluations.
    return { bg: 'bg-gray-400', text: 'text-gray-400', emoji: '🎖️' }; // Fallback.
  }; // End getRankStyle rank style resolver helper function.
  // Parse leaderboards visual contents into variable to prevent React inner parenthesized JSX ternary syntax check errors.
  let leaderboardContent; // Define content variable.
  if (!topStudents || topStudents.length === 0) { // If topStudents is empty.
    leaderboardContent = ( // Assign empty notification block.
      <p className="text-sm text-gray-400 font-semibold italic bg-white p-6 rounded-xl border border-gray-150 text-center" /* Status notification */>No results published yet</p>
    ); // Close assignment.
  } else { // If topStudents has items.
    leaderboardContent = ( // Assign list layout.
      <div className="bg-white rounded-xl shadow-xs border border-gray-150 overflow-hidden flex flex-col divide-y divide-gray-100" /* Leaderboard dashboard card */>
        {topStudents.map((elem, idx) => { // Map array student logs profiles records.
          const styles = getRankStyle(elem.rank); // Resolve styles variables by calling getRankStyle helper.
          return ( // Return entry element layout.
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-gray-50/50 transition-colors" /* Student row layout */>
              <div className="flex items-center gap-4" /* Left grouping alignments */>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${styles.bg}`} /* Rank circle containers */>
                  <span className="text-sm font-extrabold" /* Rank characters labels */>{elem.rank}</span>
                </div> {/* Close rank badge wrapper. */}
                <div className="flex flex-col" /* Student information names wrap */>
                  <span className="text-sm font-bold text-gray-800" /* Display full name string */>{elem.studentName}</span>
                  <span className="text-xs text-gray-400 font-medium" /* Display academic institution string */>{elem.universityName}</span>
                </div> {/* Close names align. */}
              </div> {/* Close left grouping align. */}
              <div className="flex items-center gap-4 self-end sm:self-auto" /* Right grouping ratings wraps */>
                <span className="bg-amber-50 text-[#9C823A] border border-[#C9A84C]/30 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider" /* Highlight department specialties */>
                  {elem.bestDepartment}
                </span> {/* Close specialized tag. */}
                <div className="text-right" /* Score display coordinate and ratios statistics */>
                  <span className="text-xl font-black text-[#C9A84C] font-serif" /* Ratings mark numbers */>{elem.overallScore}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-1" /* Static metrics denominators */>/ 100</span>
                </div> {/* Close score text block. */}
              </div> {/* Close right groupings. */}
            </div> // Close row details template card item rows block.
          ); // Terminate single mapping element items.
        })} {/* Terminate map loops array operations. */}
      </div> // Close leaderboard card wrap.
    ); // Close assignment.
  } // Terminate leaderboards validations blocks.
  // Now build the JSX output.
  return ( // Return master JSX block.
    // Wrap in DashboardLayout with role hr and pageTitle Statistics.
    <DashboardLayout role="hr" pageTitle="Statistics"> {/* Begin Layout coordinate. */}
      {/* Outer wrapper panel element. */}
      <div className="flex flex-col select-none font-sans min-h-screen"> {/* Core page wrap. */}
        {/* Visual Header coordinates block. */}
        <div className="mb-8"> {/* Margin spacer. */}
          {/* Show a heading saying Internship Analytics in Playfair Display charcoal size 2xl margin bottom 8 pixels. */}
          <h2 className="text-2xl font-black text-gray-800 tracking-tight font-serif mb-2">Internship Analytics</h2> {/* Heading tag. */}
          {/* Show a paragraph below saying A full overview of your internship program performance in charcoal-light margin bottom 32 pixels. */}
          <p className="text-sm text-gray-500">A full overview of your internship program performance</p> {/* Subheading text. */}
        </div> {/* Separator wrap. */}
        {/* Evaluate loading state blocks. */}
        {loading ? ( // Render spinner if loading database elements.
          // Show a centered paragraph saying Loading statistics.
          <div className="flex justify-center items-center py-20 bg-white rounded-xl border border-gray-150"> {/* Container layout. */}
            <p className="text-gray-400 text-sm font-semibold animate-pulse">Loading statistics...</p> {/* Text. */}
          </div> // Close div.
        ) : error ? ( // Evaluate error boundary trackers.
          // If error show red error box.
          <div className="p-4 bg-red-50 text-red-600 border border-red-150 rounded-xl font-medium text-sm"> {/* Core block design. */}
            {error} {/* Diagnostic message output line. */}
          </div> // Close div.
        ) : ( // Show the statistics dashboard.
          // If not loading and not error show all the content.
          <div className="flex flex-col gap-8"> {/* Statistics child layout. */}
            {/* SECTION ONE — Overview stat cards. These are the main numbers at the top of the statistics page. */}
            {/* Create a grid with 2 columns on mobile and 4 columns on desktop gap 16 pixels margin bottom 32 pixels. */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"> {/* KPI grid list. */}
              {/* Card one shows label Total Interns Ever and value overview.totalStudents in large Playfair Display charcoal. White card rounded shadow padding 24 pixels text centered. */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-150 p-6 text-center flex flex-col justify-between"> {/* Card viewport shell. */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Total Interns Ever</span> {/* Subtitle label element. */}
                <span className="text-3xl font-black text-gray-800 font-serif block">{overview ? overview.totalStudents : 0}</span> {/* Main number presentation structure. */}
              </div> {/* Close card. */}
              {/* Card two shows label Active Right Now and value overview.activeStudents in large green color. */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-150 p-6 text-center flex flex-col justify-between"> {/* Card viewport shell. */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Active Right Now</span> {/* Subtitle label element. */}
                <span className="text-3xl font-black text-green-600 font-serif block">{overview ? overview.activeStudents : 0}</span> {/* Main number presentation structure. */}
              </div> {/* Close card. */}
              {/* Card three shows label This Month and value overview.thisMonthStudents in large gold color. */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-150 p-6 text-center flex flex-col justify-between"> {/* Card viewport shell. */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">This Month</span> {/* Subtitle label element. */}
                <span className="text-3xl font-black text-[#C9A84C] font-serif block">{overview ? overview.thisMonthStudents : 0}</span> {/* Main number presentation structure. */}
              </div> {/* Close card. */}
              {/* Card four shows label Overall Average Score and value overview.overallAverage followed by a percent sign in large charcoal. */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-150 p-6 text-center flex flex-col justify-between"> {/* Card viewport shell. */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Overall Average Score</span> {/* Subtitle label element. */}
                <span className="text-3xl font-black text-gray-850 font-serif block">{overview ? overview.overallAverage : 0}%</span> {/* Main number presentation structure. */}
              </div> {/* Close card. */}
            </div> {/* Close KPI metrics grid wrapper. */}
            {/* SECTION TWO — Charts row. Two charts side by side on desktop stacked on mobile. */}
            {/* Create a grid with 1 column on mobile and 2 columns on desktop gap 24 pixels margin bottom 32 pixels. */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"> {/* Charts container wrap. */}
              {/* CHART ONE — Average score per department bar chart. */}
              {/* Create a white card rounded shadow padding 24 pixels. */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-150 p-6"> {/* Panel canvas wrapper. */}
                {/* Show a heading saying Average Score Per Department in charcoal font weight 600 large margin bottom 16 pixels. */}
                <h3 className="text-base font-bold text-gray-800 mb-4 font-sans uppercase tracking-wider">Average Score Per Department</h3> {/* Heading panel elements. */}
                {/* Create a ResponsiveContainer with width 100 percent and height 250. ResponsiveContainer makes the chart resize with the screen. */}
                <div className="h-[250px] w-full"> {/* Setup fixed sizing wrap. */}
                  <ResponsiveContainer width="100%" height="100%"> {/* Initialize responsive grid scale coordinates. */}
                    {/* Inside the ResponsiveContainer add a BarChart with data set to departmentScores. */}
                    <BarChart data={departmentScores} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}> {/* Open custom BarChart component node. */}
                      {/* Add CartesianGrid with strokeDasharray of 3 3 and stroke set to a light gray color. */}
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F1F1" vertical={false} /> {/* Draw helper background borders. */}
                      {/* Add XAxis with dataKey set to department. Add tickFormatter that shortens long department names. */}
                      <XAxis // Vertical node structure.
                        dataKey="department" // Link to matching item name coordinates.
                        stroke="#9CA3AF" // Color parameter.
                        fontSize={11} // Resize text to 11px boundary limits in coordinate axis.
                        tickLine={false} // Disable ticks graphics markings.
                        tickFormatter={(value) => { // Begin formatter rules definition.
                          if (value === 'Front Office') return 'FO'; // If Front Office return FO.
                          if (value === 'Housekeeping') return 'HK'; // If Housekeeping return HK.
                          if (value === 'Kitchen') return 'KT'; // If Kitchen return KT.
                          if (value === 'F&B Service') return 'FB'; // If F&B Service return FB.
                          return value; // Default fallback representation directly.
                        }} // Terminate formatting rules definition completely.
                      /> {/* Close standard Horizonal details coordinate helper card. */}
                      {/* Add YAxis with domain set to an array containing 0 and 100. */}
                      <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} domain={[0, 100]} /> {/* Vertical details index. */}
                      {/* Add Tooltip tooltip popup item box elements. */}
                      <Tooltip /> {/* Hover interface metrics handler display helper card. */}
                      {/* Add a Bar with dataKey set to averageScore and fill set to the gold color hex value C9A84C and radius set to give rounded top corners. */}
                      <Bar dataKey="averageScore" fill="#C9A84C" radius={[4, 4, 0, 0]} barSize={40} /> {/* Generate the golden metrics representations bars. */}
                    </BarChart> {/* Close bar mapping container definitions. */}
                  </ResponsiveContainer> {/* Close responsive wrappers node. */}
                </div> {/* Close height constraint wrappers. */}
              </div> {/* Close chart panel. */}
              {/* CHART TWO — Monthly registration line chart. */}
              {/* Create a white card rounded shadow padding 24 pixels. */}
              <div className="bg-white rounded-xl shadow-xs border border-gray-150 p-6"> {/* Panel canvas wrapper. */}
                {/* Show a heading saying Monthly Registrations in charcoal font weight 600 large margin bottom 16 pixels. */}
                <h3 className="text-base font-bold text-gray-800 mb-4 font-sans uppercase tracking-wider">Monthly Registrations</h3> {/* Layout page subtitle. */}
                {/* Create a ResponsiveContainer with width 100 percent and height 250. */}
                <div className="h-[250px] w-full"> {/* Fixed height layout. */}
                  <ResponsiveContainer width="100%" height="100%"> {/* Sizer container node. */}
                    {/* Inside the ResponsiveContainer add a LineChart with data set to monthlyData. */}
                    <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}> {/* Open custom LineChart router element configurations. */}
                      {/* Add CartesianGrid. */}
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F1F1" vertical={false} /> {/* Draw meshes. */}
                      {/* Add XAxis with dataKey set to month. */}
                      <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} /> {/* Horizonal details indices. */}
                      {/* Add YAxis. */}
                      <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} allowDecimals={false} /> {/* Vertical details mappings. */}
                      {/* Add Tooltip popup text details information. */}
                      <Tooltip /> {/* Hover panels helper tools map. */}
                      {/* Add a Line with type set to monotone and dataKey set to count and stroke set to gold hex value C9A84C. */}
                      <Line type="monotone" dataKey="count" stroke="#C9A84C" strokeWidth={3} dot={{ stroke: '#C9A84C', strokeWidth: 1 }} /> {/* Draw line connection strings vectors. */}
                    </LineChart> {/* Close LineChart container tag mappings wrappers. */}
                  </ResponsiveContainer> {/* Close dimensions controller layout elements scale. */}
                </div> {/* Close height wrap. */}
              </div> {/* Close chart panel. */}
            </div> {/* Close charts list board grid. */}
            {/* SECTION THREE — Department breakdown overview cards. */}
            {/* Create a white card rounded shadow padding 24 pixels. */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-150 p-6 mb-8"> {/* Layout board shape coordinate wrap. */}
              {/* Show a heading saying Department Breakdown in charcoal font weight 600 large margin bottom 16 pixels. */}
              <h3 className="text-base font-bold text-gray-800 mb-4 font-sans uppercase tracking-wider">Department Breakdown</h3> {/* Category breakdown visual titles. */}
              {/* Create a grid with 2 columns on mobile and 4 columns on desktop gap 16 pixels. */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4"> {/* Grid child cards canvas wrapper. */}
                {/* Loop through overview.departmentBreakdown. */}
                {overview && overview.departmentBreakdown && Object.entries(overview.departmentBreakdown).map(([deptName, countVal]) => { // Map object key value entries pairs.
                  // For each department create a white card with borders.
                  return ( // Return single department stats count card element indicator block.
                    <div key={deptName} className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center flex flex-col justify-between hover:border-[#C9A84C]/50 transition-colors"> {/* Sizing wrapper shape. */}
                      {/* Show the department name in charcoal small font weight 500. */}
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">{deptName}</span> {/* Label. */}
                      {/* Show the count as a large Playfair Display charcoal number. */}
                      <span className="text-3xl font-black text-gray-800 font-serif block">{countVal}</span> {/* Main metrics index output value block. */}
                      {/* Show a small label below saying students. */}
                      <span className="text-[10px] text-gray-450 font-bold uppercase mt-1">students</span> {/* Label suffix element tag. */}
                    </div> // Close child card.
                  ); // End mapping loop outputs templates.
                })} {/* Terminate loop operations. */}
              </div> {/* Close grid viewport framework cards list. */}
            </div> {/* Close section wrapper. */}
            {/* SECTION FOUR — Top students leaderboard. */}
            <div className="mb-8"> {/* leaderboard section. */}
              {/* Show a heading saying Top Performing Students in Playfair Display charcoal size xl margin bottom 16 pixels. */}
              <h3 className="text-xl font-black text-gray-800 font-serif mb-4 tracking-tight">Top Performing Students</h3> {/* Leaderboard title heading. */}
              {/* Render computed leaderboard content */}
              {leaderboardContent} {/* Render dynamically computed leaderboard content cards list */}
            </div> {/* Close SECTION FOUR layout wrapper. */}
          </div> // Close main database panel.
        )} {/* Close states check toggles. */}
      </div> {/* Close master viewport dashboard wrap. */}
    </DashboardLayout> // Terminate layout templates rendering node.
  ); // Terminate JSX master block execution pipeline codes.
}; // Terminate HRStatistics functional code definitions.
export default HRStatistics; // Export HRStatistics as default.
