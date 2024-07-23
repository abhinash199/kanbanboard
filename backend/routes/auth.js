// Import required modules
const express = require('express'); // Import Express framework
const User = require('../models/User'); // Import User model for interacting with the database
const jwt = require('jsonwebtoken'); // Import JSON Web Token for generating and verifying tokens
const { OAuth2Client } = require('google-auth-library'); // Import OAuth2Client for Google authentication

// Initialize the Express router
const router = express.Router();
const upload = require('../middleware/multerConfig'); // Import middleware for handling file uploads

// Initialize Google OAuth2 client with the client ID from environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID; 
const client = new OAuth2Client(CLIENT_ID);

// Route for user registration
router.post('/register', upload.single('profileImage'), async (req, res) => {
    const { name, username, email, contactNumber, password } = req.body;
    const profileImage = req.file ? req.file.path : null; // Get the path of the uploaded profile image

    try {
        // Check if user already exists with the same username or email
        let user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            return res.json({ message: 'User already exists with this username or email' });
        }

        // Create a new user instance and save it to the database
        user = new User({
            name,
            username,
            email,
            contactNumber,
            password,
            profileImage
        });

        await user.save();
        // Generate a JWT token for the newly registered user
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token }); // Send the token in response
    } catch (err) {
        console.error(err.message); // Log any errors
        res.status(500).send('Server error'); // Send a generic server error message
    }
});

// Route for user login
router.post('/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    try {
        // Find user by username or email
        const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' }); // User not found
        }

        // Check if the provided password matches the stored password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' }); // Password mismatch
        }

        // Generate a JWT token for the authenticated user
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
       // res.json({ token, name: user.name});
        res.json({ token, name: user.name,userID:user._id  });
        
    } catch (err) {
        console.error(err.message); // Log any errors
        res.status(500).send('Server error'); // Send a generic server error message
    }
});

// Route for Google login
router.post('/google-login', async (req, res) => {
    const { tokenId } = req.body;
    try {
        // Verify the Google ID token using OAuth2Client
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload(); // Get the payload from the token
        const { sub: googleId, email, name, picture } = payload; // Extract user information from the payload

        // Check if a user with the given Google ID already exists
        let user = await User.findOne({ googleId });
        if (!user) {
            // Create a new user if not found
            user = new User({ googleId, email, name, profileImage: picture });
            await user.save();
        }

        // Generate a JWT token for the authenticated user
        const jwtPayload = { userId: user._id };
        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, name: user.name, userID:user._id}); // Send the token and user name in response
    } catch (err) {
        console.error('Error verifying Google token:', err); // Log any errors
        res.status(401).json({ message: 'Invalid Google token' }); // Send an error response for invalid Google token
    }
});

module.exports = router;
