// This file handles all messaging routes between students and HR.
const express = require('express'); // Import the express library to create routes.
const router = express.Router(); // Create a route router instance.
const { protect } = require('../middleware/authMiddleware'); // Import the protect security guard middleware.
const { requireRole } = require('../middleware/roleMiddleware'); // Import requireRole middleware for role validation.
const Message = require('../models/Message'); // Import the Message Mongoose model of communications.
const User = require('../models/User'); // Import the User Mongoose model of application accounts.
const { sendNewMessageEmail } = require('../utils/emailService'); // Import email alerting helper for messages.
const { createNotification } = require('../utils/notifications'); // Import notifications creation helper.

// Create a GET route at path /thread/hr for students to retrieve their entire messaging thread with HR.
router.get('/thread/hr', protect, requireRole('student'), async (req, res) => {
  // Try-catch block to gracefully locate and process thread queries without crashes.
  try {
    // Determine current user ID safely from decoded request metadata fields.
    const currentUserId = req.user.id || req.user.userId;
    // Find the User document in Database matching the administrative 'hr' authorization role.
    const hrUser = await User.findOne({ role: 'hr' });
    // If no active HR record exists in system collections.
    if (!hrUser) {
      // Return 404 response to client indicating lack of HR setup.
      return res.status(404).json({ message: "HR account not found" });
    }
    // Find all Messages exchanged between this student and the HR user account identifier.
    const messages = await Message.find({
      // Match sender/receiver combinations in either direction.
      $or: [
        { senderId: currentUserId, receiverId: hrUser._id },
        { senderId: hrUser._id, receiverId: currentUserId }
      ]
    }).sort({ createdAt: 1 }); // Sort message results chronologically in ascending sequence.
    // Update all incoming unread HR messages sent to this student to mark them read.
    await Message.updateMany(
      { senderId: hrUser._id, receiverId: currentUserId, isRead: false }, // Filter for unread incoming messages.
      { $set: { isRead: true } } // Set the isRead property key to true.
    ); // This updates and clears the active unread notification counts.
    // Respond back to client with HTTP status 200 carrying messages array and HR user ID.
    return res.status(200).json({
      messages: messages, // Send back resolved thread.
      hrUserId: hrUser._id // Send back the HR user identifier key.
    });
  } catch (error) {
    // Print the occurred error traces directly to standard console outputs.
    console.error('Error in HR thread fetch:', error);
    // Respond with a 500 status stating server retrieval failure.
    return res.status(500).json({ message: "Could not retrieve thread" });
  }
});

// Create a GET route at path /threads for HR to view summaries of all conversation threads.
router.get('/threads', protect, requireRole('hr'), async (req, res) => {
  // Protect operations execution within standard try-catch blocks.
  try {
    // Resolve the current logged in HR user identifier.
    const currentUserId = req.user.id || req.user.userId;
    // Query all Messages where HR user is either the sender or the receiver in descent order.
    const allMessagesList = await Message.find({
      $or: [
        { senderId: currentUserId },
        { receiverId: currentUserId }
      ]
    }).sort({ createdAt: -1 }); // Oldest messages will be at the end, newest at the beginning.
    // Create an empty Map object to track unique active conversation targets.
    const threadsMap = {}; // Holds entries of conversation partner details and metrics.
    // Iterate through retrieved communication logs.
    for (const msg of allMessagesList) {
      // Determine other person ID based on sender and receiver attributes compared to HR ID.
      const otherPersonIdStr = msg.senderId.toString() === currentUserId.toString()
        ? msg.receiverId.toString()
        : msg.senderId.toString();
      // If thread record doesn't exist for the conversation partner.
      if (!threadsMap[otherPersonIdStr]) {
        // Create an entry in threads mapping tracking state.
        threadsMap[otherPersonIdStr] = {
          lastMessage: msg, // Store the latest message as first-match on sorted set.
          unreadCount: 0, // Initialize new unread tracking counter at zero.
          otherUserId: otherPersonIdStr // Save the counterpart identity string key.
        };
      }
      // If the message receiver is HR and holds unread false state.
      if (msg.receiverId.toString() === currentUserId.toString() && msg.isRead === false) {
        // Increment the unread counter metrics.
        threadsMap[otherPersonIdStr].unreadCount += 1;
      }
    }
    // Retrieve counterpart user attributes details.
    for (const otherUserIdStr of Object.keys(threadsMap)) {
      // Retrieve the associated User account records details.
      const matchedUserRecord = await User.findById(otherUserIdStr);
      // If user account is found.
      if (matchedUserRecord) {
        // Attach fullName property onto thread summaries dictionary.
        threadsMap[otherUserIdStr].fullName = matchedUserRecord.fullName;
        // Attach role property onto thread summaries dictionary.
        threadsMap[otherUserIdStr].role = matchedUserRecord.role;
      } else {
        // If user is absent assign fallback values.
        threadsMap[otherUserIdStr].fullName = "Unknown User";
        threadsMap[otherUserIdStr].role = "student";
      }
    }
    // Transform map properties back into an array list context.
    const summariesArrayResult = Object.values(threadsMap);
    // Return HTTP response status 200 carrying summaries listings data.
    return res.status(200).json(summariesArrayResult);
  } catch (err) {
    // Print logs of the caught error system exceptions.
    console.error('Error fetching HR summary list:', err);
    // Return status 500 error payload on failure.
    return res.status(500).json({ message: "Could not fetch summaries list" });
  }
});

// Create a GET route at path /thread/:userId for HR and students to load any specific thread.
router.get('/thread/:userId', protect, requireRole('hr', 'student'), async (req, res) => {
  // Contain process inside try-catch structure to debug route requests safely.
  try {
    // Match route parameters containing targeted companion identifier.
    const otherUserId = req.params.userId;
    // Ensure active user ID is extracted properly.
    const currentUserId = req.user.id || req.user.userId;
    const otherUser = await User.findById(otherUserId).select('role');
    if (!otherUser) {
      return res.status(404).json({ message: "Conversation user not found" });
    }
    if (req.user.role === 'student' && otherUser.role !== 'hr') {
      return res.status(403).json({ message: "Students can only open HR message threads" });
    }
    if (req.user.role === 'hr' && otherUser.role !== 'student') {
      return res.status(403).json({ message: "HR can only open student message threads" });
    }
    // Find all Messages exchanged in database between current user and selection.
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    }).sort({ createdAt: 1 }); // Sort results ascending.
    // Mark messages sent by the counterpart to the current logged-in user as read.
    await Message.updateMany(
      { senderId: otherUserId, receiverId: currentUserId, isRead: false }, // Locate target documents.
      { $set: { isRead: true } } // Terminate unread status flag.
    ); // Clears unread counts.
    // Respond back to client carrying resolved items list.
    return res.status(200).json(messages);
  } catch (err) {
    // Capture runtime server error reports.
    console.error('Error in loaded thread retrieval:', err);
    // Respond with a 500 server error status.
    return res.status(500).json({ message: "Could not fetch thread details" });
  }
});

// Create a POST route at path / to send a new message.
router.post('/', protect, requireRole('hr', 'student'), async (req, res) => {
  // Wrap database writes inside safety structure.
  try {
    // Isolate arguments containing receiver identification and message parameters text body.
    const receiverId = req.body.receiverId;
    const body = req.body.body;
    // Ensure that content text isn't empty after trimmed.
    if (!body || !body.trim()) {
      // Abort posting with status 400.
      return res.status(400).json({ message: "cannot send an empty message" });
    }
    // Resolve active sender ID from request.
    const currentUserId = req.user.id || req.user.userId;
    // Find receiver user metadata account details before creating a message.
    const receiverUser = await User.findById(receiverId);
    // Find sender user metadata account details.
    const senderUser = await User.findById(currentUserId);
    if (!receiverUser || !senderUser) {
      return res.status(404).json({ message: "Message sender or receiver not found" });
    }
    if (senderUser.role === 'student' && receiverUser.role !== 'hr') {
      return res.status(403).json({ message: "Students can only message HR" });
    }
    if (senderUser.role === 'hr' && receiverUser.role !== 'student') {
      return res.status(403).json({ message: "HR can only message students" });
    }
    // Build and insert a message instance into database storage.
    const savedMessage = await Message.create({
      senderId: currentUserId, // Bind sender identifier.
      receiverId: receiverId, // Bind receiver identifier.
      body: body.trim() // Bind text contents.
    });
    // Create a notification for the receiver informing them they have received a new message.
    if (receiverUser && senderUser) { // Check if both users exist.
      try { // Start error handling block.
        const link = receiverUser.role === 'hr' ? '/hr/messages' : '/student/messages'; // Determine link based on receiver role.
        await createNotification(
          receiverId, // Send notification to the message receiver user ID.
          'New Message', // Set notification title.
          `You have a new message from ${senderUser.fullName}`, // Set message text with sender name.
          link, // Link to appropriate messages page.
          'message' // Set notification type as message.
        ); // Close createNotification call.
      } catch (notifErr) { // Catch notification errors.
        console.error('Failed to dispatch message notification alert:', notifErr); // Log error silently.
      } // Close try-catch block.
    } // Close user existence check.
    // If receiver email address is available.
    if (receiverUser && receiverUser.email && senderUser) {
      // Dispatch notifications warning about newly received inbox messages.
      try {
        await sendNewMessageEmail(receiverUser.email, receiverUser.fullName, senderUser.fullName);
      } catch (emailErr) {
        console.error('Failed to send message email notification:', emailErr.message);
      }
    }
    // Return creation response status 201 carrying saved object.
    return res.status(201).json(savedMessage);
  } catch (err) {
    // Print stack diagnostics.
    console.error('Error sending message:', err);
    // Respond 500 error status code.
    return res.status(500).json({ message: "Could not process message delivery" });
  }
});

// Create a GET route at path /unread-count to fetch outstanding unread counts.
router.get('/unread-count', protect, async (req, res) => {
  // Wrap implementation inside a try-catch tracking block.
  try {
    // Fetch logged in active user ID variables.
    const currentUserId = req.user.id || req.user.userId;
    // Count unread records matching receiver specifications.
    const unreadMessagesCount = await Message.countDocuments({
      receiverId: currentUserId, // Match receiverId field constraint.
      isRead: false // Match unread metrics query filter.
    });
    // Respond back carrying the computed details.
    return res.status(200).json({ count: unreadMessagesCount });
  } catch (err) {
    // Log exception tracks.
    console.error('Error on counting unreads:', err);
    // Reply with a 500 code failure response.
    return res.status(500).json({ message: "Could not count messages" });
  }
});

// Export the messages route router configuration for root applications module injection.
module.exports = router;
