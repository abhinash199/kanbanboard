// Import required modules
const mongoose = require('mongoose'); // Import Mongoose for MongoDB schema and model
const bcrypt = require('bcryptjs'); // Import bcrypt for hashing passwords

// Define the User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String, // Field type: String
    required: true, // This field is required
  },
  username: {
    type: String, // Field type: String
    required: false, // This field is not required
    unique: true, // Ensure uniqueness of username
    sparse: true, // Allows the field to be unique only for documents that have a value
  },
  email: {
    type: String, // Field type: String
    required: true, // This field is required
    unique: true, // Ensure uniqueness of email
  },
  contactNumber: {
    type: String, // Field type: String
    default: '', // Default value if not provided
  },
  password: {
    type: String, // Field type: String
    required: false, // This field is not required (optional for Google users)
  },
  profileImage: {
    type: String, // Field type: String
    default: '', // Default value if not provided
  },
  googleId: {
    type: String, // Field type: String
    unique: true, // Ensure uniqueness of Google ID
    sparse: true, // Allows the field to be unique only for documents that have a value
  },
});

// Middleware to hash the password before saving the user
UserSchema.pre('save', async function(next) {
  // Check if the password is modified or not set
  if (!this.isModified('password') || !this.password) {
    return next(); // Skip hashing if not modified
  }

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Proceed to the next middleware or save the document
});

// Method to compare provided password with the hashed password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  // Throw an error if password is not set
  if (!this.password) {
    throw new Error('Password not set');
  }
  // Compare the candidate password with the stored hashed password
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the User model based on the schema
module.exports = mongoose.model('User', UserSchema);
