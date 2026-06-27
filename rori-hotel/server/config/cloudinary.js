// Import the Cloudinary library version 2 to access cloud storage API methods for file uploads.
const cloudinary = require('cloudinary').v2; // Load Cloudinary v2 API for file management.
// Import CloudinaryStorage to create a multer storage engine that uploads files directly to Cloudinary cloud service.
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // Load Cloudinary Storage adapter for multer middleware.

// Configure Cloudinary with account credentials from environment variables for secure authentication.
cloudinary.config({ // Set up Cloudinary connection with API credentials from .env file.
  // Set the Cloudinary account cloud name identifier from environment variable.
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary account name for API requests.
  // Set the Cloudinary API key for authentication from environment variable.
  api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API key for secure access to cloud storage.
  // Set the Cloudinary API secret for secure authorization from environment variable.
  api_secret: process.env.CLOUDINARY_API_SECRET // Cloudinary API secret for authentication verification.
}); // Close Cloudinary configuration block.

// Log successful Cloudinary configuration to console for debugging and confirmation.
console.log('[Cloudinary] Configured with cloud name:', process.env.CLOUDINARY_CLOUD_NAME); // Display which cloud account is being used.

// Create a CloudinaryStorage instance to handle file uploads through multer middleware with dynamic folder organization.
const storage = new CloudinaryStorage({ // Initialize Cloudinary storage engine for multer file upload handling.
  cloudinary: cloudinary, // Pass the configured Cloudinary instance as the connection reference for uploads.
  // Configure upload parameters as an async function to dynamically set folder and resource type based on file field.
  params: async (req, file) => { // Define async function that receives request and file objects to determine upload settings.
    // Log the file being processed for debugging to track which files are uploaded and their types.
    console.log('[Cloudinary] Processing file:', file.fieldname, file.mimetype, file.originalname); // Log field name, MIME type, and original filename.

    // Check if the uploaded file is a PDF based on MIME type or file extension for correct resource type.
    const isPDF = file.mimetype === 'application/pdf' || // Check MIME type equals PDF format.
                  file.originalname.toLowerCase().endsWith('.pdf'); // Also check file extension ends with .pdf case insensitive.

    // Declare folder path variable that will be set based on the type of file being uploaded.
    let folder = 'rori-hotel-uploads'; // Default folder for all uploads if no specific field matched.
    // Declare resource type variable that will be set based on whether file is image or document.
    let resourceType = 'image'; // Default resource type is image for photos.

    // Check if the uploaded file is a profile photo and set appropriate folder and resource type.
    if (file.fieldname === 'profilePhoto') { // If file field name is profilePhoto.
      folder = 'rori-hotel-uploads/profile-photos'; // Store profile photos in dedicated subfolder for organization.
      resourceType = 'image'; // Set resource type to image for photos so Cloudinary can optimize them.
    } // End profile photo check.

    // Check if the uploaded file is an internship letter and set folder and resource type based on file type detection.
    if (file.fieldname === 'internshipLetter') { // If file field name is internshipLetter.
      // Check if file is a PDF by examining MIME type and file extension to set correct resource type.
      const isPDF = file.mimetype === 'application/pdf' || // Check if MIME type is application/pdf.
                    file.originalname.toLowerCase().endsWith('.pdf'); // Check if filename ends with .pdf extension case-insensitive.
      // Check if file is an image by examining MIME type and common image extensions to set correct resource type.
      const isImage = file.mimetype.startsWith('image/') || // Check if MIME type starts with image/ (image/jpeg, image/png, etc).
                      file.originalname.toLowerCase().endsWith('.jpg') || // Check if filename ends with .jpg extension.
                      file.originalname.toLowerCase().endsWith('.jpeg') || // Check if filename ends with .jpeg extension.
                      file.originalname.toLowerCase().endsWith('.png') || // Check if filename ends with .png extension.
                      file.originalname.toLowerCase().endsWith('.webp'); // Check if filename ends with .webp extension.
      
      if (isPDF) { // If file is identified as a PDF document.
        folder = 'rori-hotel-uploads/internship-letters'; // Store PDF letters in internship-letters subfolder.
        resourceType = 'raw'; // Use raw resource type for PDFs so Cloudinary stores them as-is without processing.
        console.log('[Cloudinary] Internship letter is PDF - using raw resource type'); // Log PDF detection for debugging.
      } else if (isImage) { // If file is identified as an image (JPG, PNG, etc).
        folder = 'rori-hotel-uploads/internship-letters'; // Store image letters in internship-letters subfolder.
        resourceType = 'image'; // Use image resource type for images so Cloudinary serves them with image/upload URL.
        console.log('[Cloudinary] Internship letter is IMAGE - using image resource type'); // Log image detection for debugging.
      } else { // If file type cannot be identified as PDF or image.
        folder = 'rori-hotel-uploads/internship-letters'; // Store unknown type letters in internship-letters subfolder.
        resourceType = 'raw'; // Use raw resource type as fallback for unknown file types.
        console.log('[Cloudinary] Internship letter is unknown type - using raw as fallback'); // Log unknown type for debugging.
      } // Close file type detection checks.
    } // End internship letter check.

    // Check if the uploaded file is a settings photo for profile updates and set appropriate folder.
    if (file.fieldname === 'profilePhoto' || file.fieldname === 'settingsPhoto') { // If updating profile photo from settings page.
      folder = 'rori-hotel-uploads/profile-photos'; // Store settings photos in profile photos subfolder.
      resourceType = 'image'; // Set resource type to image for profile photo updates.
    } // End settings photo check.

    // Create the upload parameters object with all required settings for public accessible uploads without signing.
    const params = { // Define configuration object for this specific file upload to Cloudinary.
      folder: folder, // Cloudinary folder path where file will be stored organized by file type.
      resource_type: resourceType, // Resource type - image for photos/image letters, raw for PDFs to prevent corruption.
      type: 'upload', // Upload type set to upload means publicly stored NOT authenticated private - this fixes 401 errors.
      access_mode: 'public', // Access mode set to public means no authentication needed to view files - critical for fixing 401 errors.
      sign_url: false, // Sign URL set to false prevents generating signed tokens that expire causing 404 errors - URLs are plain public.
      invalidate: true, // Invalidate true clears CDN cache when file is updated ensuring latest version is served.
      overwrite: false, // Overwrite false prevents replacing existing files if same name exists protecting previous uploads.
      unique_filename: true, // Unique filename true ensures Cloudinary generates unique IDs preventing filename collisions.
      use_filename: false // Use filename false means Cloudinary generates random public ID instead of using original filename for security.
    }; // Close params object definition.
    
    // Add format parameter for PDFs to force .pdf extension in the URL for proper file type identification.
    if (isPDF) { // Check if the file is a PDF document based on earlier detection.
      params.format = 'pdf'; // Force pdf extension to be added to Cloudinary URL so browsers recognize file type correctly.
      console.log('[Cloudinary] Adding .pdf format to URL'); // Log format parameter being added for debugging.
    } else if (file.fieldname === 'internshipLetter' && resourceType === 'image') { // If internship letter is an image type.
      params.format = undefined; // Leave format undefined for images so Cloudinary uses original format (jpg, png, etc).
      console.log('[Cloudinary] No format parameter for image letters - using original format'); // Log that original format will be preserved.
    } // Close format parameter checks.
    
    // Add upload preset if configured in environment variables for using predefined Cloudinary settings.
    if (process.env.CLOUDINARY_UPLOAD_PRESET) { // Check if upload preset is defined in .env file.
      params.upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET; // Use the predefined upload preset from environment variable.
      console.log('  upload_preset:', params.upload_preset); // Log preset name being used for debugging.
    } // End upload preset check.

    // Log the upload parameters for debugging to verify correct settings are being applied.
    console.log('[Cloudinary] Upload params:', JSON.stringify(params)); // Display all upload parameters as JSON string for inspection.
    return params; // Return configuration object to Cloudinary for processing this file upload.
  } // Close params function.
}); // Close CloudinaryStorage configuration.

// Log successful storage configuration to console for confirmation.
console.log('[Cloudinary] Storage configured successfully'); // Display success message after storage engine setup.

// Export both cloudinary instance and storage engine for use in route handlers.
module.exports = { cloudinary, storage }; // Export Cloudinary API instance and storage engine for importing in routes.
