// import asyncHandler from 'express-async-handler';
// import { uploadOnCloudinary } from '../config/cloudinary.js'; 
// import { Video } from '../model/vedio.model.js'; 

// export const uploadVideo = asyncHandler(async (req, res) => {
    
//     if (!req.file) {
//         return res.status(400).json({
//             success: false,
//             message: 'No video file provided'
//         });
//     }

//     const cloudinaryResponse = await uploadOnCloudinary(req.file.buffer);
    
//     if (!cloudinaryResponse) {
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to upload video to Cloudinary'
//         });
//     }

//     const video = await Video.create({
//         description: req.body.description || '',
//         videoUrl: cloudinaryResponse.secure_url,
//         duration: cloudinaryResponse.duration,
//         format: cloudinaryResponse.format,
//         owner: req.user._id 
//     });

//     res.status(201).json({
//         success: true,
//         message: 'Video uploaded successfully',
//         data: video
//     });
// });



// import asyncHandler from 'express-async-handler';
// import fs from 'fs';
// import path from 'path';
// import { uploadOnCloudinary } from '../config/cloudinary.js';
// import { Video } from '../model/vedio.model.js';

// export const uploadVideo = asyncHandler(async (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({
//             success: false,
//             message: 'No video file provided'
//         });
//     }

//     // Save file temporarily to local disk
//     const tempFilePath = path.join('uploads', `${Date.now()}-${req.file.originalname}`);
//     fs.writeFileSync(tempFilePath, req.file.buffer); // save buffer to file

//     // Upload to Cloudinary
//     const cloudinaryResponse = await uploadOnCloudinary(tempFilePath);

//     // Delete temp file after upload (good practice)
//     fs.unlinkSync(tempFilePath);

//     if (!cloudinaryResponse) {
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to upload video to Cloudinary'
//         });
//     }

//     // Save to MongoDB
//     const video = await Video.create({
//         description: req.body.description || '',
//         videoUrl: cloudinaryResponse.secure_url,
//         duration: cloudinaryResponse.duration,
//         format: cloudinaryResponse.format,
//         owner: req.user._id
//     });

//     res.status(201).json({
//         success: true,
//         message: 'Video uploaded successfully',
//         data: video
//     });
// });




// // Get all videos controller
// export const getAllVideo = asyncHandler(async (req, res) => {
//     try {
//         // You can add pagination, filtering, etc. here
//         const videos = await Video.find().populate('owner', 'username email'); // Example population

//         return res.status(200).json({
//             success: true,
//             count: videos.length,
//             data: videos
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message || 'Failed to fetch videos'
//         });
//     }
// });











// controller/vedio.controller.js
import asyncHandler from 'express-async-handler';
import { uploadOnCloudinary } from '../config/cloudinary.js';
import { Video } from '../model/vedio.model.js';


export const uploadVideo = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No video file provided',
    });
  }

  const tempFilePath = req.file.path;

  const cloudinaryResponse = await uploadOnCloudinary(tempFilePath);

  if (!cloudinaryResponse) {
    return res.status(500).json({
      success: false,
      message: 'Failed to upload video to Cloudinary',
    });
  }

  const video = await Video.create({
    description: req.body.description || '',
    videoUrl: cloudinaryResponse.secure_url,
    duration: cloudinaryResponse.duration,
    format: cloudinaryResponse.format,
    owner: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Video uploaded successfully',
    data: video,
  });
});

export const getAllVideo = asyncHandler(async (req, res) => {
  try {
    const videos = await Video.find().populate('owner', 'username email');

    return res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch videos',
    });
  }
});
