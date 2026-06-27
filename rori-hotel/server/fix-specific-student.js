// Fix specific student with wrong URL
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/rori-hotel')
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    const Student = require('./models/Student');
    
    // Find the specific student with this problematic URL
    const student = await Student.findOne({
      internshipLetter: { $regex: 'zh5tplzya4oitszibl7' }
    }).populate('userId', 'fullName email');
    
    if (!student) {
      console.log('❌ Student not found with that URL');
      process.exit(0);
    }
    
    console.log('Found student:', student.userId?.fullName || 'Unknown');
    console.log('Email:', student.userId?.email || 'Unknown');
    console.log('Old URL:', student.internshipLetter);
    
    const newUrl = student.internshipLetter.replace('/raw/upload/', '/image/upload/');
    console.log('New URL:', newUrl);
    
    student.internshipLetter = newUrl;
    await student.save();
    
    console.log('\n✅ Fixed!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
