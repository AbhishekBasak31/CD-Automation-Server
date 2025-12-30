import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resourceType, // Use "auto"
            use_filename: true,          // Use the actual filename from the server
            unique_filename: true        // Append random characters to avoid name conflicts
        });
        
        // Remove local file after upload
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        console.log("File uploaded successfully:", response.secure_url);
        return response;

    } catch (error) {
        console.log("Cloudinary Upload Error:", error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

export default uploadOnCloudinary;

// // Added 'originalFilename' parameter
// const uploadOnCloudinary = async (localFilePath, resourceType = "auto", originalFilename = "") => {
//     try {
//         if (!localFilePath) return null;

//         const options = {
//             resource_type: resourceType
//         };

//         // FIX: If it's a RAW file (PDF/DOC), explicitly set the public_id with extension
//         if (resourceType === "raw" && originalFilename) {
//             // Extract extension (e.g., 'pdf')
//             const ext = originalFilename.split('.').pop();
//             // Create a clean filename: "resume_1715623_timestamp.pdf"
//             const cleanName = originalFilename.split('.')[0].replace(/[^a-zA-Z0-9]/g, "_"); 
//             options.public_id = `${cleanName}_${Date.now()}.${ext}`;
            
//             // These options ensure the name sticks
//             options.use_filename = true;
//             options.unique_filename = false;
//         }

//         const response = await cloudinary.uploader.upload(localFilePath, options);
        
//         fs.unlinkSync(localFilePath);
//         console.log("File uploaded successfully:", response.url);
//         return response;

//     } catch (error) {
//         console.log("Cloudinary Upload Error:", error);
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath);
//         }
//         return null;
//     }
// };

// export default uploadOnCloudinary;