// This component displays a bell icon in the top navigation bar that shows real-time notifications for all user roles.
// When clicked, it reveals a dropdown panel listing recent notifications with unread indicators and navigation links.
// The component automatically polls for new notifications every 30 seconds to keep the list up to date.

// Import useState hook from React to manage component state variables like notifications array and dropdown visibility.
import { useState, useEffect, useRef } from 'react'; // Import React hooks for state, effects, and refs.
// Import useNavigate hook from react-router-dom to programmatically navigate to notification destination links.
import { useNavigate } from 'react-router-dom'; // Import navigation hook for routing.
// Import api utility which is a pre-configured Axios instance for making authenticated HTTP requests to the backend.
import api from '../utils/api'; // Import API client for backend communication.

// Create the main NotificationBell functional component that renders the bell icon and dropdown panel.
const NotificationBell = () => { // Define functional component.
  
  // State variable storing the array of notification objects retrieved from the backend API.
  const [notifications, setNotifications] = useState([]); // Initialize with empty array.
  // State variable storing the count of unread notifications displayed in the red badge on the bell icon.
  const [unreadCount, setUnreadCount] = useState(0); // Initialize with zero.
  // State variable tracking whether the notification dropdown panel is currently visible on screen.
  const [isOpen, setIsOpen] = useState(false); // Initialize as false meaning dropdown is hidden.
  // State variable tracking whether notification data is currently being fetched from the backend.
  const [loading, setLoading] = useState(true); // Initialize as true to show loading state initially.
  
  // Create a ref pointing to the dropdown container DOM element for detecting outside clicks.
  const dropdownRef = useRef(null); // Initialize ref with null value.
  
  // Get the navigate function from useNavigate hook to redirect users when they click notifications.
  const navigate = useNavigate(); // Store navigation function reference.
  
  // Define an async function that fetches notifications and unread count from the backend API.
  const fetchNotifications = async () => { // Create async function for API calls.
    try { // Start error handling block.
      // Send GET request to /notifications endpoint to retrieve user's recent notifications.
      const notificationsResponse = await api.get('/notifications'); // Fetch notifications array.
      // Update the notifications state with the array of notification objects from response data.
      setNotifications(notificationsResponse.data); // Set notifications state.
      
      // Send GET request to /notifications/unread-count endpoint to get the count of unread notifications.
      const unreadResponse = await api.get('/notifications/unread-count'); // Fetch unread count.
      // Update the unreadCount state with the count number from response data.
      setUnreadCount(unreadResponse.data.count); // Set unread count state.
    } catch (error) { // Catch any API request errors.
      // Log the error to console silently without displaying error message to user.
      console.error('Error fetching notifications:', error); // Log error for debugging.
    } finally { // Execute regardless of success or failure.
      // Set loading to false to hide loading indicator after fetch completes.
      setLoading(false); // Disable loading state.
    } // Close try-catch-finally block.
  }; // Close fetchNotifications function.
  
  // UseEffect hook that runs once on component mount to fetch initial notifications and set up polling interval.
  useEffect(() => { // Define effect with empty dependency array.
    // Call fetchNotifications immediately when component mounts to load initial data.
    fetchNotifications(); // Fetch initial notifications.
    
    // Set up an interval that calls fetchNotifications every 30 seconds to automatically refresh the list.
    const intervalId = setInterval(() => { // Create interval timer.
      fetchNotifications(); // Fetch updated notifications every 30 seconds.
    }, 30000); // Set interval duration to 30000 milliseconds which equals 30 seconds.
    
    // Return a cleanup function that clears the interval when component unmounts to prevent memory leaks.
    return () => { // Define cleanup function.
      clearInterval(intervalId); // Clear the interval timer.
    }; // Close cleanup function.
  }, []); // Empty dependency array means this effect runs once on mount.
  
  // UseEffect hook that adds a click event listener to detect clicks outside the dropdown panel.
  useEffect(() => { // Define effect with isOpen dependency.
    // Define handler function that checks if click target is outside the dropdown container.
    const handleClickOutside = (event) => { // Accept mouse event parameter.
      // Check if dropdownRef.current exists and if the clicked element is not inside the dropdown.
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { // Check if click is outside.
        // If click is outside the dropdown, close it by setting isOpen to false.
        setIsOpen(false); // Close dropdown.
      } // Close outside click check.
    }; // Close handler function.
    
    // Add mousedown event listener to the document to detect all clicks on the page.
    document.addEventListener('mousedown', handleClickOutside); // Attach event listener.
    
    // Return cleanup function that removes the event listener when component unmounts or isOpen changes.
    return () => { // Define cleanup function.
      document.removeEventListener('mousedown', handleClickOutside); // Remove event listener.
    }; // Close cleanup function.
  }, [isOpen]); // Re-run effect when isOpen state changes.
  
  // Define async function that marks all notifications as read when user clicks "Mark all read" button.
  const handleMarkAllRead = async () => { // Create async function.
    try { // Start error handling block.
      // Send PUT request to backend to update all unread notifications to read status.
      await api.put('/notifications/mark-all-read'); // Call mark all read endpoint.
      // Refresh the notifications list by fetching updated data from backend.
      await fetchNotifications(); // Reload notifications with updated read status.
    } catch (error) { // Catch any API errors.
      // Log error silently to console for debugging without showing user error message.
      console.error('Error marking all notifications as read:', error); // Log error.
    } // Close try-catch block.
  }; // Close handleMarkAllRead function.
  
  // Define async function that handles clicking on a notification to mark it as read and navigate to its link.
  const handleClickNotification = async (notification) => { // Accept notification object parameter.
    try { // Start error handling block.
      // If the notification is currently unread, send PUT request to mark it as read in the database.
      if (!notification.isRead) { // Check if notification is unread.
        // Send PUT request with notification ID to update isRead field to true.
        await api.put(`/notifications/${notification._id}/read`); // Mark single notification as read.
        
        // Update the local notifications state to reflect the read status without refetching all data.
        setNotifications(prevNotifications => // Update state with function.
          prevNotifications.map(n => // Map through notifications array.
            n._id === notification._id ? { ...n, isRead: true } : n // Update matching notification.
          ) // Close map function.
        ); // Close setNotifications call.
        
        // Decrement the unread count by 1 but never let it go below zero.
        setUnreadCount(prev => Math.max(0, prev - 1)); // Decrease unread count safely.
      } // Close unread check.
      
      // If the notification has a link property, navigate to that destination URL.
      if (notification.link) { // Check if link exists.
        navigate(notification.link); // Navigate to notification destination.
      } // Close link check.
      
      // Close the dropdown panel after clicking the notification.
      setIsOpen(false); // Hide dropdown.
    } catch (error) { // Catch any errors.
      // Log error silently to console without disrupting user experience.
      console.error('Error handling notification click:', error); // Log error.
    } // Close try-catch block.
  }; // Close handleClickNotification function.
  
  // Helper function that returns an appropriate emoji icon based on notification type category.
  const getNotificationIcon = (type) => { // Accept type string parameter.
    // Use switch statement to match notification type and return corresponding emoji.
    switch (type) { // Start switch on type.
      case 'message': // If type is message.
        return '💬'; // Return speech bubble emoji for messages.
      case 'application': // If type is application.
        return '📄'; // Return document emoji for applications.
      case 'approval': // If type is approval.
        return '✅'; // Return green checkmark emoji for approvals.
      case 'rejection': // If type is rejection.
        return '❌'; // Return red cross emoji for rejections.
      case 'score': // If type is score.
        return '⭐'; // Return star emoji for scores.
      case 'result': // If type is result.
        return '🏆'; // Return trophy emoji for results.
      case 'feedback': // If type is feedback.
        return '📢'; // Return megaphone emoji for feedback.
      case 'attendance': // If type is attendance.
        return '🕐'; // Return clock emoji for attendance.
      default: // For any other type.
        return '🔔'; // Return bell emoji as default fallback.
    } // Close switch statement.
  }; // Close getNotificationIcon function.
  
  // Helper function that converts notification creation date into human-readable relative time string.
  const getTimeAgo = (dateString) => { // Accept date string parameter.
    // Create Date object from the notification createdAt timestamp.
    const notificationDate = new Date(dateString); // Parse date string.
    // Get current time as Date object.
    const now = new Date(); // Get current timestamp.
    // Calculate difference in milliseconds between now and notification creation time.
    const diffMs = now - notificationDate; // Calculate time difference.
    // Convert milliseconds to minutes by dividing by 1000 (seconds) and 60 (minutes).
    const diffMinutes = Math.floor(diffMs / 1000 / 60); // Calculate minutes ago.
    
    // If less than 1 minute has passed, return "just now" text.
    if (diffMinutes < 1) { // Check if less than 1 minute.
      return 'just now'; // Return immediate time text.
    } // Close immediate check.
    
    // If less than 60 minutes have passed, return minutes with "m ago" suffix.
    if (diffMinutes < 60) { // Check if less than 1 hour.
      return `${diffMinutes}m ago`; // Return minutes format.
    } // Close minutes check.
    
    // Calculate hours by dividing minutes by 60.
    const diffHours = Math.floor(diffMinutes / 60); // Calculate hours ago.
    // If less than 24 hours have passed, return hours with "h ago" suffix.
    if (diffHours < 24) { // Check if less than 1 day.
      return `${diffHours}h ago`; // Return hours format.
    } // Close hours check.
    
    // For notifications older than 24 hours, return formatted date string.
    return notificationDate.toLocaleDateString(); // Return localized date format.
  }; // Close getTimeAgo function.
  
  // Return JSX structure for rendering the bell icon button and dropdown panel.
  return ( // Start JSX return.
    // Outer container div with relative positioning to anchor the absolutely positioned dropdown.
    <div className="relative" ref={dropdownRef}> { /* Container div with ref attached for outside click detection */ }
      
      { /* Bell button that toggles dropdown visibility when clicked */ }
      <button 
        onClick={() => setIsOpen(!isOpen)} // Toggle isOpen state between true and false.
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer" // Styling for circular button with hover effect.
      >
        { /* Bell emoji icon displayed inside the button */ }
        <span className="text-2xl">🔔</span> { /* Bell emoji with large text size */ }
        
        { /* Red badge showing unread count, only visible when unreadCount is greater than 0 */ }
        {unreadCount > 0 && ( // Conditional render if there are unread notifications.
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"> { /* Red circular badge positioned at top right */ }
            {unreadCount > 9 ? '9+' : unreadCount} { /* Display count or "9+" if more than 9 unread */ }
          </span> // Close badge span.
        )} { /* Close conditional render */ }
      </button> { /* Close bell button */ }
      
      { /* Dropdown panel that appears below the bell button when isOpen is true */ }
      {isOpen && ( // Conditional render when dropdown should be visible.
        <div className="absolute top-11 right-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50"> { /* Dropdown container with absolute positioning */ }
          
          { /* Header section of dropdown with title and "Mark all read" button */ }
          <div className="p-4 border-b border-gray-200 flex justify-between items-center"> { /* Header div with padding and bottom border */ }
            { /* Notifications title text */ }
            <span className="text-sm font-semibold text-gray-800">Notifications</span> { /* Title span */ }
            { /* Button to mark all notifications as read */ }
            <button 
              onClick={handleMarkAllRead} // Call handleMarkAllRead when clicked.
              className="text-xs text-gold hover:text-gold-dark transition-colors cursor-pointer" // Small gold text button.
            >
              Mark all read { /* Button text */ }
            </button> { /* Close button */ }
          </div> { /* Close header div */ }
          
          { /* Scrollable content area containing the list of notifications */ }
          <div className="max-h-96 overflow-y-auto"> { /* Scrollable div with max height */ }
            
            { /* Loading state message displayed while fetching notifications */ }
            {loading && ( // Conditional render during loading.
              <div className="p-6 text-center text-sm text-gray-400">Loading...</div> // Loading text centered.
            )} { /* Close loading conditional */ }
            
            { /* Empty state message displayed when there are no notifications */ }
            {!loading && notifications.length === 0 && ( // Conditional render when no notifications exist.
              <div className="p-6 text-center text-sm text-gray-400">No notifications yet</div> // Empty state message.
            )} { /* Close empty state conditional */ }
            
            { /* Map through notifications array to render each notification item */ }
            {!loading && notifications.map((notification) => ( // Loop through notifications.
              <div 
                key={notification._id} // Unique key prop using notification ID.
                onClick={() => handleClickNotification(notification)} // Handle click to mark read and navigate.
                className={`flex items-start p-3 cursor-pointer border-b border-gray-100 hover:bg-warm-beige transition-colors ${ // Base classes with hover effect.
                  !notification.isRead ? 'bg-amber-50' : '' // Add light amber background for unread notifications.
                }`} // Close className template string.
              >
                { /* Icon container with emoji representing notification type */ }
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-lg"> { /* Circular icon container */ }
                  {getNotificationIcon(notification.type)} { /* Display type-specific emoji icon */ }
                </div> { /* Close icon container */ }
                
                { /* Content container with title, message, and timestamp */ }
                <div className="flex-1 ml-3"> { /* Flexible content area with left margin */ }
                  { /* Notification title text */ }
                  <div className="text-sm font-medium text-gray-800">{notification.title}</div> { /* Title div */ }
                  { /* Notification message text with line clamping to show max 2 lines */ }
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</div> { /* Message div with line clamp */ }
                  { /* Relative timestamp showing how long ago notification was created */ }
                  <div className="text-xs text-gray-400 mt-1">{getTimeAgo(notification.createdAt)}</div> { /* Timestamp div */ }
                </div> { /* Close content container */ }
                
                { /* Unread indicator dot displayed on the right for unread notifications */ }
                {!notification.isRead && ( // Conditional render for unread notifications.
                  <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0 ml-2 mt-2"></div> // Small gold dot indicator.
                )} { /* Close unread indicator conditional */ }
              </div> // Close notification item div.
            ))} { /* Close notifications map */ }
          </div> { /* Close scrollable content area */ }
        </div> // Close dropdown panel.
      )} { /* Close dropdown conditional render */ }
    </div> // Close outer container.
  ); // Close JSX return.
}; // Close NotificationBell component.

// Export NotificationBell component as default export so it can be imported in other files.
export default NotificationBell; // Export component.
