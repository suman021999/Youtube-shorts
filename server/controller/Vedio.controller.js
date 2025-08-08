// controllers/video.controller.js
import asyncHandler from 'express-async-handler';
import { uploadOnCloudinary } from '../config/cloudinary.js';
import { Video } from '../model/vedio.model.js';




export const uploadVideo = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No video file provided',
            });
        }
       
        // Upload to Cloudinary directly from memory
        const cloudinaryResponse = await uploadOnCloudinary(req.file.buffer);

        if (!cloudinaryResponse) {
            return res.status(500).json({
                success: false,
                message: 'Failed to upload video to Cloudinary',
            });
        }
        // Create video record in database
        const video = await Video.create({
            description: req.body.description || '',
            videoUrl: cloudinaryResponse.secure_url,
            duration: cloudinaryResponse.duration,
            format: cloudinaryResponse.format,
             likes: 0, 
            dislike: 0,
            views:0,
            owner: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: 'Video uploaded successfully',
            data: video,
        });

    } catch (error) {
        console.error('Error in uploadVideo:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Video upload failed',
        });
    }
});

export const getAllVideo = asyncHandler(async (req, res) => {
    try {
        // Get user ID from request
        const { ownerID } = req.params; // This will work if auth middleware runs first
        console.log(ownerID)
        // Fetch videos for the logged-in user using correct field name
        const videos = await Video.find({ owner: ownerID }).populate('owner', 'username email avatar');
        // Note: Changed 'id' to 'user' assuming that's your reference field name
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

export const getAllVideos = asyncHandler(async (req, res) => {
    

    try {
        // Fetch all videos from all users and populate user details
        const videos = await Video.find().populate('owner', 'username email avatar');
        // console.log(videos)
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

export const getSingleVideo = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        
        // Fetch single video by ID and populate user details
        const video = await Video.findById(id).populate('owner', 'username email avatar');
        
        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found',
            });
        }
        
        return res.status(200).json({
            success: true,
            data: video,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch video',
        });
    }
});


