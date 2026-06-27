// This is the core App container component which maps the routing tables and global contexts of the Rori Hotel platform.

import React from 'react'; // Import standard React library.
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import BrowserRouter, Routes and Route from react-router-dom to build navigation.
import { AuthProvider } from './context/AuthContext'; // Import our global state session provider package.
import ProtectedRoute from './components/ProtectedRoute'; // Import our secure role authentication route guard module.

// Import all required page components individually.
import Home from './pages/Home'; // Import public Home page view.
import Register from './pages/Register'; // Import public Student Registration page view.
import Login from './pages/Login'; // Import public Sign-In page view.
import Attend from './pages/Attend'; // Import public QR Attendance processing page view.
import Unauthorized from './pages/Unauthorized'; // Import access restricted response page view.
import Settings from './pages/Settings'; // Import Settings page for all roles account management.

// Import Student dashboards pages.
import StudentDashboard from './pages/student/StudentDashboard'; // Import Student Main Dashboard interface.
import StudentMessages from './pages/student/StudentMessages'; // Import Student Messages system.
import StudentAttendance from './pages/student/StudentAttendance'; // Import Student personal attendance tracking calendar.
import StudentResults from './pages/student/StudentResults'; // Import Student internship performance grades index.
import StudentFeedback from './pages/student/StudentFeedback'; // Import Student feedback and reviews submit forms.
import StudentJournal from './pages/student/StudentJournal'; // Import Student daily journal for documenting internship experiences and reflections.

// Import HR team pages.
import HRDashboard from './pages/hr/HRDashboard'; // Import HR corporate overview dashboard.
import HRApplications from './pages/hr/HRApplications'; // Import HR student applications review grid layout.
import HRApplicationDetail from './pages/hr/HRApplicationDetail'; // Import HR application document detailed inspector.
import HRMessages from './pages/hr/HRMessages'; // Import HR notification broadcast and support desk communications.
import HRAttendance from './pages/hr/HRAttendance'; // Import HR comprehensive student attendance monitoring console.
import HRScores from './pages/hr/HRScores'; // Import HR grades registry database page.
import HRStatistics from './pages/hr/HRStatistics'; // Import HR dynamic analytical statistics charts portal.

// Import Supervisor role dashboards.
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard'; // Import Supervisors evaluation hub interface.

// Initialize the root App component mapping client routers.
function App() { // Begin main App module definition block.
  return ( // Start returning the component tree structure layout.
    <AuthProvider> { /* Wrap the entire website inside the global authentication provider context structure */ }
      <BrowserRouter> { /* Enable seamless HTML5 browser address bar syncs and routing */ }
        <Routes> { /* Declare a block of selectable individual route patterns */ }

          { /* Public routes that anyone can access without authenticated state permissions logs. */ }
          <Route path="/" element={<Home />} /> { /* Route loading Home page layout, open to all visitors */ }
          <Route path="/register" element={<Register />} /> { /* Route loading Student application registering forms pages */ }
          <Route path="/login" element={<Login />} /> { /* Route loading user session login files */ }
          <Route path="/attend" element={<Attend />} /> { /* Route loading instant target QR Scanner attendance logging systems */ }
          <Route path="/unauthorized" element={<Unauthorized />} /> { /* Route loading permission fallback screens */ }

          { /* Private student role account endpoints secured under Student role guards wrapper. */ }
          <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} /> { /* Load Student main dashboard panels */ }
          <Route path="/student/messages" element={<ProtectedRoute allowedRoles={['student']}><StudentMessages /></ProtectedRoute>} /> { /* Load Student secure notifications and logs */ }
          <Route path="/student/attendance" element={<ProtectedRoute allowedRoles={['student']}><StudentAttendance /></ProtectedRoute>} /> { /* Load Student personal site attendance lists */ }
          <Route path="/student/results" element={<ProtectedRoute allowedRoles={['student']}><StudentResults /></ProtectedRoute>} /> { /* Load Student performance scores view */ }
          <Route path="/student/feedback" element={<ProtectedRoute allowedRoles={['student']}><StudentFeedback /></ProtectedRoute>} /> { /* Load Student comments submit views */ }
          <Route path="/student/journal" element={<ProtectedRoute allowedRoles={['student']}><StudentJournal /></ProtectedRoute>} /> { /* Load Student daily journal for internship documentation */ }
          <Route path="/student/settings" element={<ProtectedRoute allowedRoles={['student']}><Settings /></ProtectedRoute>} /> { /* Load Student settings account management page */ }

          { /* HR executive dashboards endpoints secured behind corporate HR permission route guards. */ }
          <Route path="/hr/dashboard" element={<ProtectedRoute allowedRoles={['hr']}><HRDashboard /></ProtectedRoute>} /> { /* Load Human Resources head panel dashboards */ }
          <Route path="/hr/applications" element={<ProtectedRoute allowedRoles={['hr']}><HRApplications /></ProtectedRoute>} /> { /* Load student incoming application review logs list */ }
          <Route path="/hr/applications/:id" element={<ProtectedRoute allowedRoles={['hr']}><HRApplicationDetail /></ProtectedRoute>} /> { /* Load single application specific inspector page */ }
          <Route path="/hr/messages" element={<ProtectedRoute allowedRoles={['hr']}><HRMessages /></ProtectedRoute>} /> { /* Load HR active support threads portal */ }
          <Route path="/hr/attendance" element={<ProtectedRoute allowedRoles={['hr']}><HRAttendance /></ProtectedRoute>} /> { /* Load student overview daily checks calendars */ }
          <Route path="/hr/scores" element={<ProtectedRoute allowedRoles={['hr']}><HRScores /></ProtectedRoute>} /> { /* Load student grades database summary table */ }
          <Route path="/hr/statistics" element={<ProtectedRoute allowedRoles={['hr']}><HRStatistics /></ProtectedRoute>} /> { /* Load visual statistics graphics pages panels */ }
          <Route path="/hr/settings" element={<ProtectedRoute allowedRoles={['hr']}><Settings /></ProtectedRoute>} /> { /* Load HR settings account management page */ }

          { /* Supervisors portals endpoints secured behind multiple departmental leadership roles validation checks. */ }
          <Route path="/supervisor/dashboard" element={
            <ProtectedRoute allowedRoles={['supervisor_fo', 'supervisor_hk', 'supervisor_kt', 'supervisor_fb']}>
              <SupervisorDashboard /> { /* Render Supervisor Dashboard component layout */ }
            </ProtectedRoute>
          } /> { /* Route loading departmental evaluation cockpit tools, restricted to corporate Supervisors */ }
          <Route path="/supervisor/settings" element={
            <ProtectedRoute allowedRoles={['supervisor_fo', 'supervisor_hk', 'supervisor_kt', 'supervisor_fb']}>
              <Settings /> { /* Render Supervisor Settings component layout */ }
            </ProtectedRoute>
          } /> { /* Route loading supervisor settings account management page */ }

        </Routes> { /* Disengage selector lists router scope */ }
      </BrowserRouter> { /* Close browser address coordinator structures */ }
    </AuthProvider> // Close global sessions layer container.
  ); // Close overall XML components layout.
} // Terminate App main module function block.

export default App; // Publish application defaults bundle.
