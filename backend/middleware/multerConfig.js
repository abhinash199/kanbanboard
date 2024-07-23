// Import required modules
const multer = require('multer'); // Import multer for handling file uploads


// Set up storage for uploaded files
const storage = multer.diskStorage({
    // Specify the destination folder for uploaded files
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Store files in the 'uploads' directory
    },
    // Define the filename for uploaded files
    filename: function (req, file, cb) {
       
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File filter to accept only certain file types
const fileFilter = (req, file, cb) => {
   
    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
   
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); 
    } else {
        cb(new Error('Invalid file type'), false); // Reject the file
    }
};

// Create an upload middleware instance with the defined storage and file filter
const upload = multer({ storage, fileFilter });

// Export the upload middleware to be used in other parts of the application
module.exports = upload;
