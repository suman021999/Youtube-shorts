// // import { v2 as cloudinary } from 'cloudinary';
// // import fs from "fs"

// //     cloudinary.config({ 
// //         cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
// //         api_key:process.env.CLOUDINARY_API_KEY, 
// //         api_secret:process.env.CLOUDINARY_API_SECRET
//            timeout: 1200000 // 20 minutes in milliseconds (maximum allowed by Cloudinary)
// //     });
    

// // const uploadOnCloudinary=async(localFilePath)=>{
// //     try {

// //         if(!localFilePath) return null
// //          const res=await cloudinary.uploader.upload(localFilePath,
// //             {
// //                 resource_type:"video" //video 

//                 chunk_size: 6000000, 
//             timeout: 1200000 
// //             }
// //         )
// //         console.log("upload",res.url)
// //         return res
        
// //     } catch (err) {
// //         fs.unlinkSync(localFilePath) 
// //         return null
// //     }
// // }

// // export {uploadOnCloudinary}
 



// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 1200000 // 20 mins
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "video",
            chunk_size: 6000000,
            timeout: 1200000
        });

        console.log("upload success", res.secure_url);
        fs.unlinkSync(localFilePath); // Clean up
        return res;
    } catch (err) {
        console.error("Upload error:", err);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

export { uploadOnCloudinary };
