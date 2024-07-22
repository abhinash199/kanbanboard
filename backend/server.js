// Importing required modules
const express = require('express'); // Import Express framework
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction
const bodyParser = require('body-parser'); // Import bodyParser to parse incoming request bodies
const cors = require('cors'); // Import CORS middleware to handle cross-origin requests
require('dotenv').config(); // Import and configure dotenv to load environment variables from a .env file

// Create an instance of the Express application
const app = express();

// Define the port on which the server will listen. Defaults to 5000 if not specified in environment variables
const PORT = process.env.PORT || 4000;

// Middleware setup
app.use(bodyParser.json()); // Parse JSON bodies from incoming requests
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI);

// Get the Mongoose connection object
const db = mongoose.connection;

// Handle connection errors
db.on('error', console.error.bind(console, 'connection error:'));

// Log a message when the connection is successfully opened
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Import and use routes
const authRouter = require('./routes/auth'); // Import routes for authentication
app.use('/api/auth', authRouter); // Mount the auth router on the /api/auth path

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log a message when the server starts
});
