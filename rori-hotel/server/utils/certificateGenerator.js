// This file generates beautiful modern PDF internship completion certificates for students using pdfkit library.
// Certificates are landscape A4 format with elegant minimalist design, ready to be customized with hotel branding.
const PDFDocument = require('pdfkit'); // Import pdfkit library to create PDF documents programmatically in Node.js.
const fs = require('fs'); // Import fs (file system) module to create directories and write files to disk.
const path = require('path'); // Import path module to construct cross-platform file paths safely.

// Export async function that generates modern certificate PDF and returns file path when complete.
async function generateCertificate(data) { // Define async function accepting data object with student and score information.
  // Destructure all required fields from data object for use in certificate generation.
  const { 
    studentName, // Full name of the student receiving certificate.
    universityName, // Name of university student attends.
    studentIdNumber, // Student ID number for identification.
    internshipPeriod, // Object containing startDate and endDate as formatted strings.
    overallScore, // Final overall score out of 100.
    bestDepartment, // Department where student performed best.
    departmentScores, // Array of objects with department name and score.
    hrFeedback, // General feedback written by HR.
    badges, // Array of badge objects with name, emoji, description.
    generatedDate, // Today's date formatted as readable string.
    certificateId // Unique ID for this certificate.
  } = data; // Close destructuring assignment.
  
  // Create certificates directory if it doesn't exist to store generated PDFs.
  const certificatesDir = path.join(__dirname, '..', 'uploads', 'certificates'); // Construct path to certificates folder using path.join for cross-platform compatibility.
  if (!fs.existsSync(certificatesDir)) { // Check if certificates directory exists using fs.existsSync.
    fs.mkdirSync(certificatesDir, { recursive: true }); // Create directory recursively if it doesn't exist to ensure parent folders are created.
  } // Close directory creation check.
  
  // Create unique filename for this certificate using student ID and timestamp.
  const filename = `certificate-${studentIdNumber}-${Date.now()}.pdf`; // Construct filename with pattern certificate-ID-timestamp.pdf.
  const filepath = path.join(certificatesDir, filename); // Create full file path by joining directory and filename.
  
  // Create new PDF document with landscape A4 page size for modern certificate format.
  const doc = new PDFDocument({ 
    size: 'A4', // Set page size to A4 standard (210mm x 297mm).
    layout: 'landscape', // Set orientation to landscape for wide certificate format (297mm x 210mm).
    margins: { top: 40, bottom: 40, left: 40, right: 40 } // Set margins of 40 points on all sides for modern clean look.
  }); // Close PDFDocument configuration.
  
  // Create write stream to save PDF to file system.
  const stream = fs.createWriteStream(filepath); // Create writable stream to write PDF bytes to file at filepath.
  doc.pipe(stream); // Pipe PDF document output to file stream to write content as it's generated.
  
  // MODERN CERTIFICATE DESIGN - Define color palette for elegant look.
  const colors = { // Define color scheme object.
    primary: '#1a1a1a', // Dark charcoal for main text (almost black but softer).
    secondary: '#4a4a4a', // Medium gray for secondary text.
    accent: '#C9A84C', // Elegant gold for accents and highlights.
    accentDark: '#A88832', // Darker gold for rich accents.
    lightGray: '#f5f5f5', // Very light gray for subtle backgrounds.
    border: '#e0e0e0', // Light gray for borders and dividers.
    cream: '#FFF8E7' // Warm cream color for elegant backgrounds.
  }; // Close color palette.
  
  // Get page dimensions for calculations.
  const pageWidth = doc.page.width; // Get page width from document (842 points for A4 landscape).
  const pageHeight = doc.page.height; // Get page height from document (595 points for A4 landscape).
  const centerX = pageWidth / 2; // Calculate horizontal center of page.
  
  // MODERN BORDER DESIGN - Elegant double border frame.
  // Outer border - thick golden frame
  doc.lineWidth(4) // Set border line width to 4 points for prominent outer frame.
    .strokeColor(colors.accent) // Use gold color for outer border.
    .roundedRect(20, 20, pageWidth - 40, pageHeight - 40, 15) // Draw rounded rectangle with 15pt radius corners.
    .stroke(); // Apply stroke to draw the border.
  
  // Inner border - thin elegant frame
  doc.lineWidth(1) // Set thin line for inner border.
    .strokeColor(colors.accentDark) // Use darker gold for depth.
    .roundedRect(35, 35, pageWidth - 70, pageHeight - 70, 8) // Draw inner rounded rectangle.
    .stroke(); // Apply stroke.
  
  // DECORATIVE TOP ACCENT - Gold ornamental lines with center medallion.
  // Top left accent line
  doc.lineWidth(3) // Set line width for accent.
    .strokeColor(colors.accent) // Use gold color.
    .moveTo(100, 80) // Start line from left side.
    .lineTo(centerX - 80, 80) // Draw to center with gap.
    .stroke(); // Apply stroke.
  
  // Top right accent line
  doc.lineWidth(3) // Set line width.
    .strokeColor(colors.accent) // Use gold color.
    .moveTo(centerX + 80, 80) // Start from center with gap.
    .lineTo(pageWidth - 100, 80) // Draw to right side.
    .stroke(); // Apply stroke.
  
  // Center medallion circle
  doc.lineWidth(2) // Set circle line width.
    .strokeColor(colors.accent) // Use gold color.
    .circle(centerX, 80, 25) // Draw circle at center with 25pt radius.
    .stroke(); // Apply stroke without fill.
  
  // Inner medallion circle for depth
  doc.lineWidth(1) // Thinner line.
    .strokeColor(colors.accentDark) // Darker gold.
    .circle(centerX, 80, 20) // Smaller circle.
    .stroke(); // Apply stroke.
  
  // HEADER - Elegant hotel logo and branding with decorative elements.
  // HOTEL LOGO - Stylized text-based logo design with elegant borders
  const logoY = 105; // Y position for logo.
  const logoWidth = 280; // Width of logo box.
  const logoHeight = 70; // Height of logo box.
  const logoX = centerX - logoWidth / 2; // Center logo horizontally.
  
  // Draw elegant logo background box with cream color
  doc.rect(logoX, logoY, logoWidth, logoHeight) // Draw rectangle for logo.
    .fillColor(colors.cream) // Use warm cream background.
    .fill(); // Fill the rectangle.
  
  // Draw gold border around logo box
  doc.lineWidth(3) // Thick border for logo prominence.
    .strokeColor(colors.accent) // Gold border.
    .rect(logoX, logoY, logoWidth, logoHeight) // Draw border around logo.
    .stroke(); // Apply stroke.
  
  // Draw inner decorative border
  doc.lineWidth(1) // Thin line.
    .strokeColor(colors.accentDark) // Darker gold.
    .rect(logoX + 6, logoY + 6, logoWidth - 12, logoHeight - 12) // Inner border.
    .stroke(); // Apply stroke.
  
  // Draw "RORI" in large decorative letters
  doc.fontSize(42) // Very large font for hotel name.
    .font('Helvetica-Bold') // Bold font for prominence.
    .fillColor(colors.accent) // Gold color for luxury.
    .text('RORI', 0, logoY + 12, { align: 'center', width: pageWidth }); // Draw hotel name.
  
  // Draw "HOTEL" beneath with elegant styling
  doc.fontSize(16) // Medium font.
    .font('Helvetica') // Regular font.
    .fillColor(colors.primary) // Dark color.
    .text('H O T E L', 0, logoY + 48, { align: 'center', width: pageWidth, characterSpacing: 4 }); // Draw with letter spacing.
  
  // Decorative corner accents on logo box
  const cornerSize = 12; // Size of corner decorations.
  // Top-left corner
  doc.lineWidth(2).strokeColor(colors.accentDark);
  doc.moveTo(logoX, logoY + cornerSize).lineTo(logoX, logoY).lineTo(logoX + cornerSize, logoY).stroke();
  // Top-right corner
  doc.moveTo(logoX + logoWidth - cornerSize, logoY).lineTo(logoX + logoWidth, logoY).lineTo(logoX + logoWidth, logoY + cornerSize).stroke();
  // Bottom-left corner
  doc.moveTo(logoX, logoY + logoHeight - cornerSize).lineTo(logoX, logoY + logoHeight).lineTo(logoX + cornerSize, logoY + logoHeight).stroke();
  // Bottom-right corner
  doc.moveTo(logoX + logoWidth - cornerSize, logoY + logoHeight).lineTo(logoX + logoWidth, logoY + logoHeight).lineTo(logoX + logoWidth, logoY + logoHeight - cornerSize).stroke();
  
  // Location with elegant styling below logo
  doc.fontSize(11) // Set font for location.
    .font('Helvetica') // Use regular font.
    .fillColor(colors.accent) // Use gold color for location.
    .text('Hawassa, Ethiopia', 0, logoY + logoHeight + 10, { align: 'center', width: pageWidth }); // Draw centered location.
  
  // CERTIFICATE TITLE - Elegant typography with decorative elements.
  doc.moveDown(1) // Add vertical spacing.
    .fontSize(28) // Set large font size for title.
    .font('Helvetica-Bold') // Use bold font.
    .fillColor(colors.primary) // Use dark color.
    .text('Certificate of Completion', 0, 210, { align: 'center', width: pageWidth }); // Draw centered title.
  
  // Subtitle with elegant serif styling
  doc.fontSize(14) // Set medium font.
    .font('Helvetica') // Regular font.
    .fillColor(colors.secondary) // Gray color.
    .text('Internship Program', 0, 245, { align: 'center', width: pageWidth }); // Draw subtitle.
  
  // PRESENTATION TEXT - "This certifies that" with elegant spacing.
  doc.moveDown(0.8) // Add spacing.
    .fontSize(11) // Set small font size.
    .font('Helvetica') // Use regular font.
    .fillColor(colors.secondary) // Use gray color.
    .text('This is to certify that', 0, 270, { align: 'center', width: pageWidth }); // Draw centered text.
  
  // STUDENT NAME - Most prominent element with gold color and shadow effect.
  doc.moveDown(0.5) // Add small spacing.
    .fontSize(46) // Set very large font for student name.
    .font('Helvetica-Bold') // Use bold font for emphasis.
    .fillColor(colors.accent) // Use gold color for prominence.
    .text(studentName, 0, 290, { align: 'center', width: pageWidth }); // Draw centered student name in gold.
  
  // Elegant ornamental underline beneath name with decorative ends.
  const nameUnderlineY = 345; // Y position for underline.
  const underlineLength = 250; // Length of main underline.
  // Main underline
  doc.lineWidth(2.5) // Set line width.
    .strokeColor(colors.accent) // Use gold color.
    .moveTo(centerX - underlineLength/2, nameUnderlineY) // Start left of center.
    .lineTo(centerX + underlineLength/2, nameUnderlineY) // End right of center.
    .stroke(); // Draw line.
  // Left decorative circle
  doc.circle(centerX - underlineLength/2 - 8, nameUnderlineY, 3) // Small circle on left.
    .fillColor(colors.accent) // Gold fill.
    .fill(); // Fill circle.
  // Right decorative circle
  doc.circle(centerX + underlineLength/2 + 8, nameUnderlineY, 3) // Small circle on right.
    .fillColor(colors.accent) // Gold fill.
    .fill(); // Fill circle.
  
  // UNIVERSITY INFO - Clean display of student details.
  doc.moveDown(1.2) // Add spacing.
    .fontSize(11) // Set small font.
    .font('Helvetica') // Regular font.
    .fillColor(colors.secondary) // Gray color.
    .text(`${universityName}`, 0, 365, { align: 'center', width: pageWidth }); // Draw university name.
  
  // Student ID on separate line
  doc.fontSize(10) // Smaller font for ID.
    .fillColor(colors.secondary) // Gray color.
    .text(`Student ID: ${studentIdNumber}`, 0, 380, { align: 'center', width: pageWidth }); // Draw student ID.
  
  // COMPLETION STATEMENT - Professional text block with elegant formatting.
  const completionText = 'has successfully completed the comprehensive internship program at Rori Hotel, demonstrating exceptional dedication, professionalism, and outstanding commitment to excellence in hospitality management and service delivery.'; // Define completion text.
  doc.moveDown(0.8) // Add spacing.
    .fontSize(11) // Set readable font size.
    .font('Helvetica') // Regular font.
    .fillColor(colors.primary) // Dark color for readability.
    .text(completionText, 120, 405, { 
      align: 'center', // Center align.
      width: pageWidth - 240, // Set width with padding.
      lineGap: 5 // Add line spacing for readability.
    }); // Draw completion text.
  
  // PERFORMANCE SECTION - Elegant card design with gold accents.
  const cardY = 455; // Y position for performance card.
  const cardHeight = 85; // Height of performance card.
  
  // Draw elegant background card with cream color
  doc.rect(110, cardY, pageWidth - 220, cardHeight) // Draw rectangle for card.
    .fillColor(colors.cream) // Use warm cream background.
    .fill(); // Fill the rectangle.
  
  // Performance card border with gold accent
  doc.lineWidth(2) // Medium border.
    .strokeColor(colors.accent) // Gold border.
    .rect(110, cardY, pageWidth - 220, cardHeight) // Draw border around card.
    .stroke(); // Apply stroke.
  
  // Gold accent bars on left and right sides of card
  doc.rect(110, cardY, 6, cardHeight) // Draw thin vertical bar on left.
    .fillColor(colors.accent) // Use gold color.
    .fill(); // Fill the bar.
  doc.rect(pageWidth - 116, cardY, 6, cardHeight) // Draw thin vertical bar on right.
    .fillColor(colors.accent) // Use gold color.
    .fill(); // Fill the bar.
  
  // PERFORMANCE DATA - Display in elegant columns with improved spacing.
  const col1X = 180; // X position for first column.
  const col2X = 390; // X position for second column.
  const col3X = 570; // X position for third column.
  const dataY = cardY + 18; // Y position for data rows.
  
  // Overall Score - Large and prominent with elegant styling.
  doc.fontSize(12) // Medium font.
    .font('Helvetica-Bold') // Bold font.
    .fillColor(colors.primary) // Dark color.
    .text('Overall Performance', col1X, dataY); // Draw label.
  
  doc.fontSize(32) // Large font for score.
    .fillColor(colors.accent) // Gold color.
    .text(`${overallScore}`, col1X, dataY + 20); // Draw score.
  
  doc.fontSize(9) // Small font for "out of".
    .fillColor(colors.secondary) // Gray color.
    .text('/100', col1X + 42, dataY + 38); // Draw denominator.
  
  // Best Department with icon.
  doc.fontSize(12) // Medium font.
    .font('Helvetica-Bold') // Bold font.
    .fillColor(colors.primary) // Dark color.
    .text('Excellence In', col2X, dataY); // Draw label.
  
  doc.fontSize(14) // Medium-large font.
    .font('Helvetica-Bold') // Bold font for department.
    .fillColor(colors.accent) // Gold color.
    .text(bestDepartment, col2X, dataY + 22, { width: 140 }); // Draw department name.
  
  doc.fontSize(9) // Small font.
    .font('Helvetica') // Regular font.
    .fillColor(colors.secondary) // Gray color.
    .text('Top Rated Department', col2X, dataY + 45); // Draw subtitle.
  
  // Badges count with star icon.
  doc.fontSize(12) // Medium font.
    .font('Helvetica-Bold') // Bold font.
    .fillColor(colors.primary) // Dark color.
    .text('Achievements', col3X, dataY); // Draw label.
  
  doc.fontSize(32) // Large font for count.
    .fillColor(colors.accent) // Gold color.
    .text(`${badges.length}`, col3X, dataY + 20); // Draw badge count.
  
  doc.fontSize(9) // Small font.
    .fillColor(colors.secondary) // Gray color.
    .text('Badges Earned', col3X, dataY + 53); // Draw subtitle.
  
  // INTERNSHIP PERIOD - Elegant display with decorative elements.
  doc.moveDown(0.5) // Add spacing.
    .fontSize(10) // Small font.
    .font('Helvetica-Bold') // Bold font.
    .fillColor(colors.secondary) // Gray color.
    .text(`Program Duration`, 0, cardY + cardHeight + 20, { 
      align: 'center', 
      width: pageWidth 
    }); // Draw period label.
  
  doc.fontSize(11) // Slightly larger font.
    .font('Helvetica') // Regular font.
    .fillColor(colors.accent) // Gold color for dates.
    .text(`${internshipPeriod.startDate}  —  ${internshipPeriod.endDate}`, 0, cardY + cardHeight + 35, { 
      align: 'center', 
      width: pageWidth 
    }); // Draw period dates.
  
  // SIGNATURE SECTION - Elegant signature lines with decorative elements.
  const sigY = pageHeight - 110; // Y position for signatures near bottom.
  const sigLineLength = 140; // Length of signature lines.
  
  // Left signature line with decorative elements.
  const leftSigX = 200; // X position for left signature.
  doc.lineWidth(1.5) // Medium line.
    .strokeColor(colors.accent) // Gold color.
    .moveTo(leftSigX, sigY) // Start position.
    .lineTo(leftSigX + sigLineLength, sigY) // End position.
    .stroke(); // Draw line.
  
  // Left signature label with elegant spacing.
  doc.fontSize(11) // Medium font.
    .font('Helvetica-Bold') // Bold font.
    .fillColor(colors.primary) // Dark color.
    .text('HR Manager', leftSigX, sigY + 12, { width: sigLineLength, align: 'center' }); // Draw label.
  
  doc.fontSize(9) // Smaller font.
    .font('Helvetica') // Regular font.
    .fillColor(colors.accent) // Gold color.
    .text('Human Resources', leftSigX, sigY + 28, { width: sigLineLength, align: 'center' }); // Draw department.
  
  // Right signature line with decorative elements.
  const rightSigX = pageWidth - 340; // X position for right signature.
  doc.lineWidth(1.5) // Medium line.
    .strokeColor(colors.accent) // Gold color.
    .moveTo(rightSigX, sigY) // Start position.
    .lineTo(rightSigX + sigLineLength, sigY) // End position.
    .stroke(); // Draw line.
  
  // Right signature label with elegant spacing.
  doc.fontSize(11) // Medium font.
    .font('Helvetica-Bold') // Bold font.
    .fillColor(colors.primary) // Dark color.
    .text('Hotel Director', rightSigX, sigY + 12, { width: sigLineLength, align: 'center' }); // Draw label.
  
  doc.fontSize(9) // Smaller font.
    .font('Helvetica') // Regular font.
    .fillColor(colors.accent) // Gold color.
    .text('Rori Hotel', rightSigX, sigY + 28, { width: sigLineLength, align: 'center' }); // Draw hotel name.
  
  // FOOTER - Elegant certificate metadata with decorative divider.
  const footerY = pageHeight - 55; // Y position for footer.
  
  // Decorative divider line above footer with gold accent.
  doc.lineWidth(1.5) // Medium line.
    .strokeColor(colors.accent) // Gold color.
    .moveTo(120, footerY - 8) // Start position.
    .lineTo(pageWidth - 120, footerY - 8) // End position.
    .stroke(); // Draw line.
  
  // Certificate ID and date in elegant styling.
  doc.fontSize(8) // Small font.
    .font('Helvetica') // Regular font.
    .fillColor(colors.secondary) // Gray color.
    .text(`Certificate No: ${certificateId}`, 120, footerY + 5); // Draw ID on left.
  
  doc.text(`Issue Date: ${generatedDate}`, 0, footerY + 5, { 
    align: 'right', 
    width: pageWidth - 120 
  }); // Draw date on right.
  
  // Issuing authority with elegant center alignment.
  doc.fontSize(7) // Tiny font.
    .fillColor(colors.accent) // Gold color for authority.
    .text('Authenticated by Rori Hotel Human Resources Department', 0, footerY + 22, { 
      align: 'center', 
      width: pageWidth 
    }); // Draw issuer centered.
  
  // DECORATIVE BOTTOM ACCENT - Matching gold medallion and lines.
  // Bottom left accent line
  doc.lineWidth(3) // Thick line for accent.
    .strokeColor(colors.accent) // Gold color.
    .moveTo(100, pageHeight - 28) // Start from left.
    .lineTo(centerX - 80, pageHeight - 28) // Draw to center with gap.
    .stroke(); // Apply stroke.
  
  // Bottom right accent line
  doc.lineWidth(3) // Thick line.
    .strokeColor(colors.accent) // Gold color.
    .moveTo(centerX + 80, pageHeight - 28) // Start from center.
    .lineTo(pageWidth - 100, pageHeight - 28) // Draw to right.
    .stroke(); // Apply stroke.
  
  // Bottom center medallion circle
  doc.lineWidth(2) // Set circle line width.
    .strokeColor(colors.accent) // Gold color.
    .circle(centerX, pageHeight - 28, 15) // Draw circle at center.
    .stroke(); // Apply stroke without fill.
  
  // Inner medallion circle for depth
  doc.lineWidth(1) // Thinner line.
    .strokeColor(colors.accentDark) // Darker gold.
    .circle(centerX, pageHeight - 28, 12) // Smaller circle.
    .stroke(); // Apply stroke.
  
  // Finalize PDF document.
  doc.end(); // Close and finalize the PDF document to trigger write completion.
  
  // Return promise that resolves when file is completely written to disk.
  return new Promise((resolve, reject) => { // Create promise for async file writing.
    stream.on('finish', () => { // Listen for finish event when write stream completes.
      console.log('[Certificate] Modern certificate generated at:', filepath); // Log successful generation with file path.
      resolve(filepath); // Resolve promise with full file path for database storage.
    }); // Close finish event handler.
    stream.on('error', (err) => { // Listen for error event if write fails.
      console.error('[Certificate] Error generating certificate:', err); // Log error details.
      reject(err); // Reject promise with error for calling code to handle.
    }); // Close error event handler.
  }); // Close promise.
} // Close generateCertificate function.

// Export generateCertificate function for use in scores routes.
module.exports = { generateCertificate }; // Export as named export.
