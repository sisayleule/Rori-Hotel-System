// Quick script to check if certificates exist in the database and on disk
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rori-hotel')
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    // Import models in correct order
    const User = require('./models/User');
    const Student = require('./models/Student');
    const FinalResult = require('./models/FinalResult');
    
    // Find all published results
    const results = await FinalResult.find({ isPublished: true })
      .populate({
        path: 'studentId',
        populate: {
          path: 'userId',
          select: 'fullName email'
        }
      });
    
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(`📊 CERTIFICATE STATUS REPORT`);
    console.log(`\n═══════════════════════════════════════════════════════════════\n`);
    console.log(`Found ${results.length} published result(s)\n`);
    
    if (results.length === 0) {
      console.log('❌ NO PUBLISHED RESULTS FOUND!\n');
      console.log('💡 TO CREATE A RESULT:\n');
      console.log('   1. Login as HR: hr@rorihotel.com / password123');
      console.log('   2. Approve a student application');
      console.log('   3. Have all 4 supervisors submit scores');
      console.log('   4. HR publishes the result');
      console.log('   5. Certificate auto-generates\n');
      console.log('═══════════════════════════════════════════════════════════════\n');
      process.exit(0);
    }
    
    let readyCount = 0;
    let missingCount = 0;
    
    // Check each result
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const studentName = result.studentId?.userId?.fullName || 'Unknown Student';
      const studentEmail = result.studentId?.userId?.email || 'No email';
      
      console.log(`\n${i + 1}. STUDENT: ${studentName}`);
      console.log(`   ─────────────────────────────────────────────────────────────`);
      console.log(`   📧 Email:        ${studentEmail}`);
      console.log(`   🆔 Student ID:   ${result.studentId._id}`);
      console.log(`   📊 Score:        ${result.overallScore}/100`);
      console.log(`   🏆 Best Dept:    ${result.bestDepartment}`);
      console.log(`   📅 Published:    ${new Date(result.publishedAt).toLocaleDateString()}`);
      console.log(`   🎖️  Badges:       ${result.badges?.length || 0} earned`);
      
      if (result.certificateUrl) {
        // Check if file exists
        const filePath = path.isAbsolute(result.certificateUrl)
          ? result.certificateUrl
          : path.join(__dirname, result.certificateUrl);
        
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          const fileName = path.basename(filePath);
          console.log(`   📜 Certificate:  ✅ READY TO DOWNLOAD`);
          console.log(`   📁 File:         ${fileName}`);
          console.log(`   💾 Size:         ${Math.round(stats.size / 1024)}KB`);
          console.log(`   \n   🎯 TEST THIS CERTIFICATE:`);
          console.log(`      1. Login as: ${studentEmail}`);
          console.log(`      2. Password: password123 (or your password)`);
          console.log(`      3. Go to "My Results" page`);
          console.log(`      4. Click "📜 Download Certificate" button`);
          console.log(`      5. Certificate should download automatically!`);
          readyCount++;
        } else {
          console.log(`   📜 Certificate:  ❌ FILE NOT FOUND`);
          console.log(`   ⚠️  URL in DB:    ${result.certificateUrl}`);
          console.log(`   🔍 Expected at:  ${filePath}`);
          console.log(`   \n   💡 FIX: HR needs to republish this result`);
          missingCount++;
        }
      } else {
        console.log(`   📜 Certificate:  ❌ NOT GENERATED`);
        console.log(`   ⚠️  URL in DB:    NULL`);
        console.log(`   \n   💡 FIX: HR needs to republish this result`);
        console.log(`      1. Login as HR: hr@rorihotel.com / password123`);
        console.log(`      2. Go to "Scores" page`);
        console.log(`      3. Find "${studentName}"`);
        console.log(`      4. Click "Publish Result" again`);
        missingCount++;
      }
    }
    
    console.log('\n\n═══════════════════════════════════════════════════════════════');
    console.log('SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(`   ✅ Ready to download:     ${readyCount} certificate(s)`);
    console.log(`   ❌ Need regeneration:     ${missingCount} certificate(s)`);
    console.log(`   📊 Total published:       ${results.length} result(s)`);
    
    if (readyCount > 0) {
      console.log('\n🎉 YOU CAN TEST NOW!');
      console.log('   Servers must be running:');
      console.log('   - Backend:  http://localhost:5000');
      console.log('   - Frontend: http://localhost:3000\n');
    }
    
    console.log('\n═══════════════════════════════════════════════════════════════\n');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ DATABASE ERROR:', err.message);
    console.error('\n💡 Make sure MongoDB is running!\n');
    process.exit(1);
  });
