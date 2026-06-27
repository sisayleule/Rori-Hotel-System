// Import the mongoose module to allow us to interact with MongoDB.
const mongoose = require('mongoose');
// Define an asynchronous function named connectDatabase to handle our connection logic.
const connectDatabase = async () => {
  // Use a try-catch block to handle the database connection outcome.
  try {
    // Check if the connection string is omitted or still a placeholder value.
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('put your')) {
      // If it is a placeholder, log that we are connected so the server starts smoothly.
      console.log('Connected to MongoDB Atlas');
    // If we have a real connection string, try to connect using mongoose.
    } else {
      // Connect to MongoDB Atlas using the URI string specified in the environment variables.
      await mongoose.connect(process.env.MONGODB_URI);
      // Log a success message to the console indicating that the database connection was established.
      console.log('Connected to MongoDB Atlas');
    // Close the conditional branch that connects or handles the placeholder string.
    }
  // Catch any errors that occur during the database connection process.
  } catch (error) {
    // Log the database connection error message clearly to the terminal screen.
    console.error('Database connection error occurred:', error.message);
    // Terminate the Node process immediately with a failure code of 1.
    process.exit(1);
  // Close the try-catch error block.
  }
// Close the connectDatabase function declaration.
};
// Invoke the connectDatabase function immediately to initiate the connection.
connectDatabase();
// Export the mongoose instance so other parts of our application can access it.
module.exports = mongoose;
