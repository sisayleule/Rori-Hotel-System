// This file contains helper functions to create notifications in the database for users.
// Notifications appear in the bell icon dropdown to keep users informed about important system events.
const Notification = require('../models/Notification'); // Import Notification model to create notification documents.
const User = require('../models/User'); // Import User model to find users by role for broadcast notifications.

/**
 * Creates a notification for a target user and saves it to the database.
 * @param {string} userId - The MongoDB ObjectId of the user who will receive this notification.
 * @param {string} title - The short heading text displayed as the notification title.
 * @param {string} message - The full descriptive text explaining the notification content.
 * @param {string} link - Optional URL path to navigate to when the notification is clicked.
 * @param {string} type - The notification category (message, application, approval, rejection, score, result, feedback, attendance).
 */
const createNotification = async (userId, title, message, link = '', type = 'application') => { // Accept all notification parameters.
  try { // Start error handling block.
    if (!userId) return; // Exit early if no userId provided.
    await Notification.create({ // Create new notification document in database.
      userId: userId, // Set the recipient user ID.
      title: title, // Set the notification headline.
      message: message, // Set the notification detailed text.
      link: link, // Set the navigation destination path.
      type: type // Set the notification category type.
    }); // Close create operation.
    console.log(`[Notification] Created alert for user ${userId}: "${title}"`); // Log success message.
  } catch (err) { // Catch any database errors.
    console.error('[Notification] Error creating database notification:', err); // Log error silently.
  } // Close try-catch block.
}; // Close function definition.

/**
 * Broadcasts a notification alert to all users holding a specific role (such as 'hr').
 * @param {string} role - The user role to broadcast to (hr, student, supervisor_*).
 * @param {string} title - The notification title.
 * @param {string} message - The notification message text.
 * @param {string} link - Optional navigation link.
 * @param {string} type - The notification type category.
 */
const notifyAllWithRole = async (role, title, message, link = '', type = 'application') => { // Accept all broadcast parameters.
  try { // Start error handling block.
    const users = await User.find({ role }); // Find all users with the specified role.
    for (const targetUser of users) { // Loop through each user.
      await createNotification(targetUser._id, title, message, link, type); // Create notification for each user.
    } // Close loop.
  } catch (err) { // Catch any errors.
    console.error(`[Notification] Broadcast to role ${role} failed:`, err); // Log error silently.
  } // Close try-catch block.
}; // Close function definition.

module.exports = { // Export both functions.
  createNotification, // Export createNotification function.
  notifyAllWithRole // Export notifyAllWithRole function.
}; // Close exports.
