import asyncHandler from 'express-async-handler';
import { uploadOnCloudinary } from '../config/cloudinary.js'; // Adjust path as needed
import { upload } from '../utils/upload.js'; // Adjust path as needed
import Video from '../model/vedio.model.js'; // You'll need a Video model

// Video upload controller
export const uploadVideo = asyncHandler(async (req, res) => {
    // Use Multer middleware to handle single file upload
    upload.single('video')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No video file provided'
            });
        }

        try {
            // Upload to Cloudinary
            const cloudinaryResponse = await uploadOnCloudinary(req.file.buffer);

            if (!cloudinaryResponse) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to upload video to Cloudinary'
                });
            }

            // Save video metadata to database
            const video = await Video.create({
                title: req.body.title || 'Untitled Video',
                description: req.body.description || '',
                videoUrl: cloudinaryResponse.secure_url,
                duration: cloudinaryResponse.duration,
                format: cloudinaryResponse.format,
                owner: req.user?._id // Assuming you have user authentication
            });

            return res.status(201).json({
                success: true,
                message: 'Video uploaded successfully',
                data: video
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Video upload failed'
            });
        }
    });
});

// Get all videos controller
export const getAllVideo = asyncHandler(async (req, res) => {
    try {
        // You can add pagination, filtering, etc. here
        const videos = await Video.find().populate('owner', 'username email'); // Example population

        return res.status(200).json({
            success: true,
            count: videos.length,
            data: videos
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch videos'
        });
    }
});