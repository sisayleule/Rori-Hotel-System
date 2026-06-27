// This file defines API routes for managing user notifications including fetching, marking as read, and deleting.
// All routes use protect middleware to ensure only authenticated users can access their own notifications.

// Import express framework to create router instance for defining notification endpoints.
const express = require('express'); // Load express library.
// Import router constructor from express to build modular route handlers.
const router = express.Router(); // Create router instance.
// Import protect middleware to verify JWT tokens and authenticate requests.
const { protect } = require('../middleware/authMiddleware'); // Load authentication middleware.
// Import Notification model to query and update notification documents in the database.
const Notification = require('../models/Notification'); // Load Notification model.

// GET /api/notifications - Fetch recent notifications for the authenticated user.
// This route returns the 20 most recent notifications sorted by creation time descending.
router.get('/', protect, async (req, res) => { // Define GET route with protect middleware.
  try { // Start error handling block.
    // Query the database to find all notification documents belonging to the authenticated user.
    const notifications = await Notification.find({ userId: req.user.id }) // Filter by user ID from JWT token.
      .sort({ createdAt: -1 }) // Sort by creation date in descending order so newest notifications appear first.
      .limit(20); // Limit results to 20 notifications to prevent returning thousands of old notifications.
    
    // Return successful response with the notifications array in JSON format.
    res.status(200).json(notifications); // Send 200 OK status with notifications data.
  } catch (error) { // Catch any database query errors.
    // Log the error details to console for debugging purposes.
    console.error('[Notifications] Error fetching notifications:', error); // Output error message.
    // Return 500 internal server error response to client.
    res.status(500).json({ message: 'Failed to fetch notifications' }); // Send error response.
  } // Close try-catch block.
}); // Close GET route definition.

// GET /api/notifications/unread-count - Get the count of unread notifications for badge display.
// This route returns just the number of unread notifications to show in the red badge on the bell icon.
router.get('/unread-count', protect, async (req, res) => { // Define GET route with protect middleware.
  try { // Start error handling block.
    // Count notification documents where userId matches and isRead is false.
    const count = await Notification.countDocuments({ // Execute count query.
      userId: req.user.id, // Filter by authenticated user ID.
      isRead: false // Only count notifications that have not been read yet.
    }); // Close countDocuments query.
    
    // Return successful response with the unread count number.
    res.status(200).json({ count: count }); // Send 200 OK status with count property.
  } catch (error) { // Catch any database query errors.
    // Log the error details to console for debugging purposes.
    console.error('[Notifications] Error fetching unread count:', error); // Output error message.
    // Return 500 internal server error response to client.
    res.status(500).json({ message: 'Failed to fetch unread count' }); // Send error response.
  } // Close try-catch block.
}); // Close GET route definition.

// PUT /api/notifications/:id/read - Mark a single notification as read when user clicks it.
// This route updates the isRead field to true for one specific notification.
router.put('/:id/read', protect, async (req, res) => { // Define PUT route with protect middleware and ID parameter.
  try { // Start error handling block.
    // Find the notification document by its ID from the URL parameter.
    const notification = await Notification.findById(req.params.id); // Query by notification ID.
    
    // Check if notification exists in the database.
    if (!notification) { // If notification is not found.
      // Return 404 not found error response.
      return res.status(404).json({ message: 'Notification not found' }); // Send error response.
    } // Close existence check.
    
    // Update the isRead field to true to mark notification as read.
    notification.isRead = true; // Set isRead flag to true.
    // Save the updated notification document to the database.
    await notification.save(); // Execute save operation.
    
    // Return successful response confirming notification was marked as read.
    res.status(200).json({ message: 'Notification marked as read' }); // Send success response.
  } catch (error) { // Catch any database errors.
    // Log the error details to console for debugging purposes.
    console.error('[Notifications] Error marking notification as read:', error); // Output error message.
    // Return 500 internal server error response to client.
    res.status(500).json({ message: 'Failed to mark notification as read' }); // Send error response.
  } // Close try-catch block.
}); // Close PUT route definition.

// PUT /api/notifications/mark-all-read - Mark all unread notifications as read for the authenticated user.
// This route is called when user clicks the "Mark all read" button in the notification dropdown.
router.put('/mark-all-read', protect, async (req, res) => { // Define PUT route with protect middleware.
  try { // Start error handling block.
    // Update all notification documents where userId matches and isRead is false.
    await Notification.updateMany( // Execute bulk update operation.
      { // Define filter criteria for which notifications to update.
        userId: req.user.id, // Filter by authenticated user ID.
        isRead: false // Only update notifications that are currently unread.
      }, // Close filter object.
      { // Define update operations to apply.
        isRead: true // Set isRead field to true for all matching notifications.
      } // Close update object.
    ); // Close updateMany operation.
    
    // Return successful response confirming all notifications were marked as read.
    res.status(200).json({ message: 'All notifications marked as read' }); // Send success response.
  } catch (error) { // Catch any database errors.
    // Log the error details to console for debugging purposes.
    console.error('[Notifications] Error marking all notifications as read:', error); // Output error message.
    // Return 500 internal server error response to client.
    res.status(500).json({ message: 'Failed to mark all notifications as read' }); // Send error response.
  } // Close try-catch block.
}); // Close PUT route definition.

// DELETE /api/notifications/:id - Delete a single notification from the database.
// This route allows users to remove individual notifications from their list.
router.delete('/:id', protect, async (req, res) => { // Define DELETE route with protect middleware and ID parameter.
  try { // Start error handling block.
    // Find and delete the notification document by its ID from the URL parameter.
    const notification = await Notification.findByIdAndDelete(req.params.id); // Execute delete operation.
    
    // Check if notification existed and was deleted successfully.
    if (!notification) { // If notification was not found.
      // Return 404 not found error response.
      return res.status(404).json({ message: 'Notification not found' }); // Send error response.
    } // Close existence check.
    
    // Return successful response confirming notification was deleted.
    res.status(200).json({ message: 'Notification deleted successfully' }); // Send success response.
  } catch (error) { // Catch any database errors.
    // Log the error details to console for debugging purposes.
    console.error('[Notifications] Error deleting notification:', error); // Output error message.
    // Return 500 internal server error response to client.
    res.status(500).json({ message: 'Failed to delete notification' }); // Send error response.
  } // Close try-catch block.
}); // Close DELETE route definition.

// Export the router so it can be registered in the main server.js file.
module.exports = router; // Make router available for import.
