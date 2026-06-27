// This file implements the complete email notification system using nodemailer and Gmail SMTP for real email delivery.
// It provides helper functions for sending formatted HTML emails for various internship system events.
const nodemailer = require('nodemailer'); // Import nodemailer library to enable SMTP email sending capabilities.

// Create email transporter using Gmail SMTP service with credentials from environment variables.
const transporter = nodemailer.createTransport({ // Initialize nodemailer transport configuration object.
  service: 'gmail', // Set email service provider to Gmail SMTP server.
  auth: { // Define authentication credentials object for SMTP login.
    user: process.env.EMAIL_USER, // Get Gmail account email address from environment variable EMAIL_USER.
    pass: process.env.EMAIL_PASS // Get Gmail app-specific password from environment variable EMAIL_PASS.
  } // Close authentication credentials configuration.
}); // Close transporter configuration.

// Helper function to send email with error handling that accepts recipient address, email subject, and HTML body content.
async function sendEmail(toEmail, subject, htmlBody) { // Define async function that sends email and accepts three string parameters.
  try { // Start try block to catch any errors during email sending process.
    await transporter.sendMail({ // Call nodemailer sendMail method with email configuration object.
      from: `"Rori Hotel System" <${process.env.EMAIL_USER}>`, // Set sender name and email address with Rori Hotel branding.
      to: toEmail, // Set recipient email address from function parameter.
      subject: subject, // Set email subject line from function parameter.
      html: htmlBody // Set email body content as HTML from function parameter.
    }); // Close sendMail configuration object.
    console.log(`[Email Service] Successfully sent email to ${toEmail} with subject: ${subject}`); // Log successful email delivery with recipient and subject.
  } catch (error) { // Catch block to handle any errors that occur during email sending.
    console.error(`[Email Service] Failed to send email to ${toEmail}:`, error.message); // Log error message without throwing to prevent system crashes from email failures.
  } // Close try-catch error handling block.
} // Close sendEmail helper function.

// Function to send welcome email to newly registered students with warm greeting and application status information.
async function sendWelcomeEmail(toEmail, studentName) { // Define async function accepting recipient email and student name as parameters.
  const subject = 'Welcome to Rori Hotel Internship Program'; // Set email subject line welcoming student to program.
  const htmlBody = ` 
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFF8E7; border: 2px solid #C9A84C; border-radius: 10px;">
      <h1 style="color: #C9A84C; text-align: center; font-size: 28px; margin-bottom: 10px;">Welcome to Rori Hotel!</h1>
      <h2 style="color: #2C2C2C; text-align: center; font-size: 18px; margin-bottom: 20px;">Internship Program</h2>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear <strong>${studentName}</strong>,</p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Thank you for registering for the Rori Hotel Internship Program! We are delighted to receive your application.</p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Your application is currently <strong style="color: #C9A84C;">under review</strong> by our Human Resources team. We will notify you once a decision has been made.</p>
      <div style="background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #C9A84C;">
        <p style="color: #555; font-size: 14px; margin: 5px 0;"><strong>Hotel Name:</strong> Rori Hotel</p>
        <p style="color: #555; font-size: 14px; margin: 5px 0;"><strong>Location:</strong> Hawassa, Ethiopia</p>
        <p style="color: #555; font-size: 14px; margin: 5px 0;"><strong>Status:</strong> Application Pending Review</p>
      </div>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Please log in to your account to track your application status and access additional information.</p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Best regards,<br><strong style="color: #C9A84C;">Rori Hotel HR Team</strong></p>
      <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">This is an automated message from the Rori Hotel Internship Management System.</p>
    </div>
  `; // Close HTML email body template with inline CSS styling for compatibility across email clients.
  await sendEmail(toEmail, subject, htmlBody); // Call sendEmail helper function to deliver the welcome email.
} // Close sendWelcomeEmail function.

// Function to send approval email to students whose internship applications have been accepted by HR.
async function sendApprovalEmail(toEmail, studentName, startDate, department) { // Define async function accepting recipient, name, start date, and assigned department.
  const subject = 'Your Rori Hotel Internship Has Been Approved!'; // Set congratulatory email subject line for approved application.
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #E8F5E9; border: 2px solid #4CAF50; border-radius: 10px;">
      <h1 style="color: #4CAF50; text-align: center; font-size: 28px; margin-bottom: 10px;">🎉 Congratulations ${studentName}!</h1>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">We are pleased to inform you that your internship application at <strong style="color: #C9A84C;">Rori Hotel</strong> has been <strong style="color: #4CAF50;">approved</strong>!</p>
      <div style="background-color: white; padding: 20px; margin: 20px 0; border-left: 4px solid #4CAF50; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="color: #555; font-size: 15px; margin: 10px 0;"><strong>Start Date:</strong> <span style="color: #C9A84C; font-size: 18px;">${startDate}</span></p>
        <p style="color: #555; font-size: 15px; margin: 10px 0;"><strong>First Department:</strong> <span style="color: #C9A84C;">${department}</span></p>
      </div>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Please report to the <strong>Human Resources Department</strong> on your first day to complete orientation and receive your department assignment.</p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">We look forward to having you join our team at Rori Hotel in Hawassa, Ethiopia!</p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Best regards,<br><strong style="color: #C9A84C;">Rori Hotel HR Team</strong></p>
      <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">Rori Hotel | Hawassa, Ethiopia</p>
    </div>
  `; // Close HTML body template for approval email with green success theme.
  await sendEmail(toEmail, subject, htmlBody); // Send approval notification email to student.
} // Close sendApprovalEmail function.

// Function to send rejection email to students whose applications were not approved with polite explanation.
async function sendRejectionEmail(toEmail, studentName, rejectionNote) { // Define async function accepting recipient, name, and rejection reason text.
  const subject = 'Update on Your Rori Hotel Internship Application'; // Set neutral subject line for rejection notification.
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFF3E0; border: 2px solid #FF9800; border-radius: 10px;">
      <h2 style="color: #2C2C2C; text-align: center; font-size: 22px; margin-bottom: 10px;">Application Status Update</h2>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear <strong>${studentName}</strong>,</p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Thank you for your interest in the Rori Hotel Internship Program and for taking the time to submit your application.</p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">After careful review, we regret to inform you that we are unable to offer you a position in our internship program at this time.</p>
      <div style="background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #FF9800;">
        <p style="color: #555; font-size: 14px; margin: 5px 0;"><strong>Feedback:</strong></p>
        <p style="color: #666; font-size: 14px; line-height: 1.5;">${rejectionNote}</p>
      </div>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">We encourage you to continue developing your skills and to consider applying again in the future. We wish you the very best in your academic and professional endeavors.</p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Sincerely,<br><strong style="color: #C9A84C;">Rori Hotel HR Team</strong></p>
      <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">Rori Hotel | Hawassa, Ethiopia</p>
    </div>
  `; // Close HTML template for rejection email with respectful tone and constructive feedback.
  await sendEmail(toEmail, subject, htmlBody); // Send rejection notification to applicant.
} // Close sendRejectionEmail function.

// Function to send new message notification email alerting users of incoming messages in the system.
async function sendNewMessageEmail(toEmail, recipientName, senderName) { // Define async function accepting recipient email, recipient name, and sender name.
  const subject = 'New Message from Rori Hotel System'; // Set subject line indicating new message notification.
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #E3F2FD; border: 2px solid #2196F3; border-radius: 10px;">
      <h2 style="color: #2196F3; text-align: center; font-size: 24px; margin-bottom: 10px;">💬 New Message Received</h2>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Hello <strong>${recipientName}</strong>,</p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">You have received a new message from <strong style="color: #C9A84C;">${senderName}</strong> in the Rori Hotel Internship Management System.</p>
      <div style="background-color: white; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="color: #555; font-size: 14px; margin-bottom: 15px;">Please log in to your account to read and respond to this message.</p>
        <a href="http://localhost:3000/login" style="display: inline-block; padding: 12px 30px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">View Message</a>
      </div>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Best regards,<br><strong style="color: #C9A84C;">Rori Hotel System</strong></p>
      <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">This is an automated notification from the Rori Hotel Internship Management System.</p>
    </div>
  `; // Close HTML template for message notification with blue theme and login link.
  await sendEmail(toEmail, subject, htmlBody); // Send message notification email to recipient.
} // Close sendNewMessageEmail function.

// Function to send result publication email notifying students that their final internship results are available.
async function sendResultEmail(toEmail, studentName, overallScore) { // Define async function accepting recipient, student name, and final score.
  const subject = 'Your Internship Result is Now Available'; // Set subject line announcing result publication.
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F3E5F5; border: 2px solid #9C27B0; border-radius: 10px;">
      <h1 style="color: #9C27B0; text-align: center; font-size: 28px; margin-bottom: 10px;">🎓 Internship Result Published</h1>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Congratulations <strong>${studentName}</strong>!</p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Your final internship result has been published and is now available for viewing.</p>
      <div style="background-color: white; padding: 20px; margin: 20px 0; text-align: center; border-left: 4px solid #9C27B0;">
        <p style="color: #555; font-size: 16px; margin-bottom: 10px;"><strong>Overall Score:</strong></p>
        <p style="color: #C9A84C; font-size: 36px; font-weight: bold; margin: 10px 0;">${overallScore}/100</p>
      </div>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Please log in to your student dashboard to:</p>
      <ul style="color: #555; font-size: 15px; line-height: 1.8;">
        <li>View your complete performance breakdown</li>
        <li>Download your official completion certificate</li>
        <li>See badges you earned during your internship</li>
      </ul>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Thank you for your dedication and hard work during your internship at Rori Hotel!</p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Best regards,<br><strong style="color: #C9A84C;">Rori Hotel HR Team</strong></p>
      <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">Rori Hotel | Hawassa, Ethiopia</p>
    </div>
  `; // Close HTML template for result notification with purple theme and score highlight.
  await sendEmail(toEmail, subject, htmlBody); // Send result publication notification to student.
} // Close sendResultEmail function.

// Function to send password changed notification email alerting users of password modifications for security.
async function sendPasswordChangedEmail(toEmail, fullName) { // Define async function accepting recipient email and user full name.
  const subject = 'Your Password Has Been Changed'; // Set subject line alerting user to password change.
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFEBEE; border: 2px solid #F44336; border-radius: 10px;">
      <h2 style="color: #F44336; text-align: center; font-size: 24px; margin-bottom: 10px;">🔐 Password Changed</h2>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Hello <strong>${fullName}</strong>,</p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">This email confirms that your account password was recently changed.</p>
      <div style="background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #F44336;">
        <p style="color: #555; font-size: 14px; margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p style="color: #555; font-size: 14px; margin: 5px 0;"><strong>Account:</strong> ${toEmail}</p>
      </div>
      <p style="color: #333; font-size: 16px; line-height: 1.6;"><strong style="color: #F44336;">If you did not make this change</strong>, please contact the HR department immediately to secure your account.</p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">If you made this change, no further action is required.</p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Best regards,<br><strong style="color: #C9A84C;">Rori Hotel Security Team</strong></p>
      <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">This is an automated security notification.</p>
    </div>
  `; // Close HTML template for password change notification with red security theme.
  await sendEmail(toEmail, subject, htmlBody); // Send password change alert to user.
} // Close sendPasswordChangedEmail function.

// Function to send feedback received notification email to HR when students submit feedback forms.
async function sendFeedbackReceivedEmail(toEmail, feedbackType) { // Define async function accepting HR email and type of feedback submitted.
  const subject = 'New Student Feedback Received'; // Set subject line for HR feedback notification.
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFF9C4; border: 2px solid #FFC107; border-radius: 10px;">
      <h2 style="color: #F57C00; text-align: center; font-size: 24px; margin-bottom: 10px;">📝 New Feedback Submitted</h2>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">A student has submitted new feedback in the Rori Hotel Internship Management System.</p>
      <div style="background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #FFC107;">
        <p style="color: #555; font-size: 15px; margin: 5px 0;"><strong>Feedback Type:</strong> <span style="color: #F57C00;">${feedbackType}</span></p>
        <p style="color: #555; font-size: 15px; margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Please log in to the HR dashboard to review this feedback and take appropriate action.</p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Best regards,<br><strong style="color: #C9A84C;">Rori Hotel System</strong></p>
    </div>
  `; // Close HTML template for feedback notification to HR with yellow theme.
  await sendEmail(toEmail, subject, htmlBody); // Send feedback notification to HR.
} // Close sendFeedbackReceivedEmail function.

// Function to send certificate ready notification email when student's completion certificate is generated.
async function sendCertificateReadyEmail(toEmail, studentName, overallScore) { // Define async function accepting recipient, name, and final score.
  const subject = 'Your Internship Certificate is Ready for Download'; // Set subject line announcing certificate availability.
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #E8F5E9; border: 2px solid #4CAF50; border-radius: 10px;">
      <h1 style="color: #4CAF50; text-align: center; font-size: 28px; margin-bottom: 10px;">🏆 Certificate Ready!</h1>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Congratulations <strong>${studentName}</strong>!</p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Your official <strong style="color: #C9A84C;">Rori Hotel Internship Completion Certificate</strong> has been generated and is ready for download!</p>
      <div style="background-color: white; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="color: #555; font-size: 16px; margin-bottom: 10px;"><strong>Your Final Score:</strong></p>
        <p style="color: #4CAF50; font-size: 42px; font-weight: bold; margin: 10px 0;">${overallScore}/100</p>
      </div>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">You can now:</p>
      <ul style="color: #555; font-size: 15px; line-height: 1.8;">
        <li>Download your official PDF certificate from the <strong>My Results</strong> page</li>
        <li>View your complete performance breakdown and earned badges</li>
        <li>Keep this certificate as proof of your successful internship completion</li>
      </ul>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Thank you for your dedication and excellence during your internship at Rori Hotel, Hawassa, Ethiopia!</p>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">Best wishes for your future career,<br><strong style="color: #C9A84C;">Rori Hotel HR Team</strong></p>
      <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">Rori Hotel | Hawassa, Ethiopia</p>
    </div>
  `; // Close HTML template for certificate notification with green success theme and score display.
  await sendEmail(toEmail, subject, htmlBody); // Send certificate ready notification to student.
} // Close sendCertificateReadyEmail function.

// Export all email notification functions for use throughout the application.
module.exports = { // Begin module exports object definition.
  sendWelcomeEmail, // Export sendWelcomeEmail function for registration notifications.
  sendApprovalEmail, // Export sendApprovalEmail function for application approval notifications.
  sendRejectionEmail, // Export sendRejectionEmail function for application rejection notifications.
  sendNewMessageEmail, // Export sendNewMessageEmail function for message alert notifications.
  sendResultEmail, // Export sendResultEmail function for result publication notifications.
  sendPasswordChangedEmail, // Export sendPasswordChangedEmail function for security notifications.
  sendFeedbackReceivedEmail, // Export sendFeedbackReceivedEmail function for HR feedback alerts.
  sendCertificateReadyEmail // Export sendCertificateReadyEmail function for certificate notifications.
}; // Close module exports object.
