// Import the User mongoose model from our models directory to perform user account operations.
const User = require('../models/User'); // Load User schema module.
// Import the QRToken mongoose model from our models directory to register department clock-in parameters.
const QRToken = require('../models/QRToken'); // Load QRToken schema module.
// Import bcryptjs module to perform secure hashing on our default accounts passwords.
const bcrypt = require('bcryptjs'); // Load bcrypt package.
// Import the uuid module to generate unique UUID v4 identifier strings for QR codes.
const { v4: uuidv4 } = require('uuid'); // Extract v4 renaming it to uuidv4.
// Declare the async seedData function to populate default databases records on installation boot.
const seedData = async () => { // Begin seedData function.
  // Use try catch blocks to handle any runtime failures during DB seeding process.
  try { // Start error trapping boundary block.
    // Define an array storing our 5 default hotel staff accounts properties.
    const defaultStaff = [ // Open staff array list.
      { // First item represents our HR Manager.
        fullName: 'HR Manager', // Name parameter configuration.
        email: 'hr@rorihotel.com', // Login email credential tracking parameter.
        password: 'hr123456', // Passphrase tracking parameter.
        role: 'hr' // System role registration code.
      }, // Close HR Manager object descriptor.
      { // Second item represents the Front Office Supervisor.
        fullName: 'Front Office Supervisor', // Name parameter configuration.
        email: 'fo@rorihotel.com', // Login email credential tracking parameter.
        password: 'sup123456', // Passphrase tracking parameter.
        role: 'supervisor_fo' // System role registration code.
      }, // Close Front Office Supervisor object descriptor.
      { // Third item represents the Housekeeping Supervisor.
        fullName: 'Housekeeping Supervisor', // Name parameter configuration.
        email: 'hk@rorihotel.com', // Login email credential tracking parameter.
        password: 'sup123456', // Passphrase tracking parameter.
        role: 'supervisor_hk' // System role registration code.
      }, // Close Housekeeping Supervisor object descriptor.
      { // Fourth item represents the Kitchen Supervisor.
        fullName: 'Kitchen Supervisor', // Name parameter configuration.
        email: 'kt@rorihotel.com', // Login email credential tracking parameter.
        password: 'sup123456', // Passphrase tracking parameter.
        role: 'supervisor_kt' // System role registration code.
      }, // Close Kitchen Supervisor object descriptor.
      { // Fifth item represents the Food & Beverage Supervisor.
        fullName: 'F&B Supervisor', // Name parameter configuration.
        email: 'fb@rorihotel.com', // Login email credential tracking parameter.
        password: 'sup123456', // Passphrase tracking parameter.
        role: 'supervisor_fb' // System role registration code.
      } // Close F&B Supervisor object descriptor.
    ]; // Close staff array mapping variable.
    // Execute a loops cycle targeting each staff record in sequence.
    for (let index = 0; index < defaultStaff.length; index++) { // Begin loop check.
      // Reference individual staff user properties using index keys.
      const staffMember = defaultStaff[index]; // Fetch staff dataset reference.
      // Encrypt the plain text password input parameters utilizing salt rounds score index 10.
      const hashedPassword = await bcrypt.hash(staffMember.password, 10); // Run hashing computation using bcrypt helper.
      // Query the database to inspect if a unique users record matches this email.
      const existingUser = await User.findOne({ email: staffMember.email }); // Search database using mongoose query helper.
      // If the email address is already taken we update files to ensure password hash is present.
      if (existingUser) { // Conditional logic check.
        existingUser.password = hashedPassword; // Update password hash.
        existingUser.fullName = staffMember.fullName; // Update full name.
        existingUser.role = staffMember.role; // Update user role.
        await existingUser.save(); // Save updated document.
        console.log(`Updated existing user: ${staffMember.email}`); // Output to console.
      // If user does not exist in local datastore, we proceed to registration steps.
      } else { // Handle creation logic.
        // Save the new user record onto Database collection by instantiating User model.
        await User.create({ // Invoke creation database process.
          fullName: staffMember.fullName, // Assign full name parameters.
          email: staffMember.email, // Assign login email credential parameter.
          password: hashedPassword, // Pass secure bcrypt hash.
          role: staffMember.role // Bind permission metadata role key.
        }); // Finish User model creation query trigger.
        // Print success logs upon registration event confirmation.
        console.log(`Created new staff user successfully: ${staffMember.email}`); // Log statement indicating success.
      } // Close user conditional check database branch.
    } // End staff iteration cycle.
    // Declare list array referencing our 4 main internship target hotel departments.
    const departments = ['Front Office', 'Housekeeping', 'Kitchen', 'F&B Service']; // Assign names array.
    // Intercept database records to check departments QR tokens logs.
    for (let deptIndex = 0; deptIndex < departments.length; deptIndex++) { // Begin department token generation loop.
      // Fetch department literal value mapping reference.
      const departmentName = departments[deptIndex]; // Assign literal references.
      // Check database if a validation QR record is already active for this department.
      const existingToken = await QRToken.findOne({ department: departmentName }); // Query database token records.
      // If we already have token we skip generating a new one.
      if (existingToken) { // Run conditional token presence match checks.
        // Skip with a blank line without doing anything else.
        continue; // Proceed with next department index loop.
      // Otherwise if token configuration is missing we register a new one.
      } else { // Handle missing tokens.
        // Generate a new UUID v4 token code block.
        const uniqueToken = uuidv4(); // Generate uuid token code.
        // Persist the new department QR records model into database collections.
        await QRToken.create({ // Create database logs.
          department: departmentName, // Assign department names.
          token: uniqueToken // Assign secure transaction tokens codes.
        }); // Complete QR record insertion logic.
        // Log progress tracking statement.
        console.log(`QR token created for ${departmentName}`); // Log transaction.
      } // Close token conditional logic checking branch.
    } // End department iteration code branch.
  } catch (error) { // Catch block to capture runtime seeding faults.
    // Log unexpected exceptions within running console logs.
    console.error('System Seeding database error:', error); // Report exception details.
  } // Terminate try-catch block structure.
}; // End async seedData function.
module.exports = { seedData }; // Export our seeding subroutine capability.
