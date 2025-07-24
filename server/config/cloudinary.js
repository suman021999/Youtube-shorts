
// // config/cloudinary.js
// import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv'
// import fs from "fs";


// dotenv.config();


// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//     timeout: 1200000 // 20 mins
// });

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null;

//         const res = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "video",
//             chunk_size: 6000000,
//             timeout: 1200000,
            
//         });

//         console.log("upload success", res.secure_url);
//         fs.unlinkSync(localFilePath); // Clean up
//         return res;
//     } catch (err) {
//         console.error("Upload error:", err);
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath);
//         }
//         return null;
//     }
// };

// export { uploadOnCloudinary };







// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'


dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadOnCloudinary = async (fileBuffer) => {
    try {
        if (!fileBuffer) {
            throw new Error('No file buffer provided');
        }

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'video',
                    chunk_size: 6000000, // 6MB chunks
                    timeout: 120000, // 2 minutes timeout,
                    folder:"video_shorts"
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        console.log('Video uploaded to Cloudinary:', result.secure_url);
                        resolve(result);
                    }
                }
            );

            // Write the buffer to the upload stream
            uploadStream.end(fileBuffer);
        });
    } catch (error) {
        console.error('Error in uploadVideoToCloudinary:', error);
        throw error;
    }
};

export { uploadOnCloudinary};