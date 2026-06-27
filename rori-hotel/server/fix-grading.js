// Quick script to enable grading for all approved students
const mongoose = require('mongoose'); // Import mongoose for database connection
const Student = require('./models/Student'); // Import Student model

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rori-hotel') // Connect to local MongoDB
  .then(async () => { // When connected
    console.log('Connected to MongoDB'); // Log success
    
    // Find all approved students
    const students = await Student.find({ status: 'approved' }); // Find approved students
    console.log(`Found ${students.length} approved students`); // Log count
    
    // Update each student to enable grading
    for (const student of students) { // Loop through students
      student.isApprovedForGrading = true; // Enable grading
      await student.save(); // Save student
      console.log(`Enabled grading for student: ${student._id}`); // Log success
    } // End loop
    
    console.log('All done!'); // Log completion
    process.exit(0); // Exit process
  }) // End then
  .catch(err => { // Catch errors
    console.error('Error:', err); // Log error
    process.exit(1); // Exit with error
  }); // End catch
