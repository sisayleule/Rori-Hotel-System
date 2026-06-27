// This script fixes existing student internship letter URLs in the database that have wrong raw/upload resource type for images.
// Images uploaded as JPG/PNG but stored with raw/upload URLs cause 404 errors. This script converts them to image/upload.
require('dotenv').config(); // Load environment variables from .env file for MongoDB connection string.
const mongoose = require('mongoose'); // Import mongoose to connect to MongoDB database.

// Connect to MongoDB using local database connection.
mongoose.connect('mongodb://localhost:27017/rori-hotel') // Connect to local MongoDB database.
  .then(async () => { // Execute async block after successful connection.
    console.log('✅ Connected to MongoDB'); // Log successful database connection.
    
    const Student = require('./models/Student'); // Import Student model to query and update records.
    
    // Find all students who have an internship letter URL stored in database.
    const students = await Student.find({ // Query students collection.
      internshipLetter: { $exists: true, $ne: '' } // Filter for students with non-empty internshipLetter field.
    }); // Close find query.
    
    console.log(`\n📊 Found ${students.length} students with internship letters\n`); // Log total count of students with letters.
    
    let fixedCount = 0; // Initialize counter for how many records we fix.
    
    // Loop through each student to check and fix their internship letter URL if needed.
    for (const student of students) { // Iterate through each student document.
      const url = student.internshipLetter; // Get the internship letter URL from student record.
      
      if (!url) continue; // Skip if URL is empty or null.
      
      // Check if URL has an image file extension (jpg, jpeg, png, webp, gif).
      const isImageExtension = url.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i); // Regex to detect image extensions.
      // Check if URL currently uses wrong raw/upload resource type.
      const hasRawUpload = url.includes('/raw/upload/'); // Check if URL contains raw/upload path.
      
      console.log(`\nStudent: ${student._id}`); // Log student ID being checked.
      console.log(`  URL: ${url}`); // Log current URL value.
      console.log(`  Has image extension: ${!!isImageExtension}`); // Log if URL has image file extension.
      console.log(`  Has raw/upload: ${hasRawUpload}`); // Log if URL uses raw resource type.
      
      // Fix URL if it's an image file with wrong raw/upload resource type.
      if (isImageExtension && hasRawUpload) { // Check both conditions - is image AND has wrong resource type.
        const fixedUrl = url.replace('/raw/upload/', '/image/upload/'); // Replace raw with image in URL path.
        console.log('  ✅ FIXING: raw/upload -> image/upload'); // Log that we're fixing this URL.
        console.log(`  Before: ${url}`); // Log original broken URL.
        console.log(`  After:  ${fixedUrl}`); // Log fixed URL with correct resource type.
        
        student.internshipLetter = fixedUrl; // Update student document with fixed URL.
        await student.save(); // Save updated document to database.
        fixedCount++; // Increment counter of fixed records.
      } else { // URL doesn't need fixing.
        console.log('  ℹ️  No fix needed'); // Log that this URL is already correct or not an image.
      } // End fix check.
    } // End student loop.
    
    console.log(`\n\n═══════════════════════════════════════`); // Log separator.
    console.log(`✅ COMPLETE!`); // Log completion message.
    console.log(`   Total records fixed: ${fixedCount}`); // Log how many URLs were fixed.
    console.log(`   Total records checked: ${students.length}`); // Log total records examined.
    console.log(`═══════════════════════════════════════\n`); // Log separator.
    
    process.exit(0); // Exit script successfully with code 0.
  }) // Close then block.
  .catch(err => { // Catch connection errors.
    console.error('\n❌ DATABASE CONNECTION ERROR:', err.message); // Log connection error.
    console.error('Make sure MongoDB is running and connection string is correct!\n'); // Log helpful message.
    process.exit(1); // Exit script with error code 1.
  }); // Close catch block.
