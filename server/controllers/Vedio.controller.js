// controllers/video.controller.js
import { uploadOnCloudinary } from '../config/cloudinary.js';
import asyncHandler from 'express-async-handler';

import { Video } from '../models/vedio.model.js';




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

export const getAllUserVideos = asyncHandler(async (req, res) => {
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

export const getRandomVideo = asyncHandler(async (req, res) => {
    try {
        // Get total count of videos
        const count = await Video.countDocuments();
        
        if (count === 0) {
            return res.status(404).json({
                success: false,
                message: 'No videos found',
            });
        }
        
        // Get a random video
        const randomIndex = Math.floor(Math.random() * count);
        const video = await Video.findOne().skip(randomIndex).populate('owner', 'username email avatar');
        
        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'No video found',
            });
        }
        
        return res.status(200).json({
            success: true,
            data: video,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch random video',
        });
    }
});

export const searchVideos = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const videos = await Video.find({
      description: { $regex: q, $options: 'i' } // Case-insensitive search
    }).populate('owner', 'username avatar');

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching videos",
      error: error.message
    });
  }
};

export const likeVideo = asyncHandler(async (req, res) => {
  const userId = req.user._id; 
  const { videoId } = req.params; 

  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ message: 'Video not found' });
  }

  const alreadyLiked = video.likedBy.includes(userId);
  if (alreadyLiked) {
    video.likedBy.pull(userId);
    video.likes = Math.max(video.likes - 1, 0);
  } else {
    video.likedBy.push(userId);
    video.likes += 1;
    if (video.dislikedBy.includes(userId)) {
      video.dislikedBy.pull(userId);
      video.dislikes = Math.max(video.dislikes - 1, 0);
    }
  }

  await video.save();

  res.status(200).json({
    message: 'Like updated',
    likes: video.likes,
    likedBy: video.likedBy,
    dislikes: video.dislikes,
    dislikedBy: video.dislikedBy,
    currentUserId: userId   // 👈 send back for frontend
  });
});

export const dislikeVideo = asyncHandler(async (req, res) => {
  const userId = req.user._id; 
  const { videoId } = req.params; 

  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ message: 'Video not found' });
  }

  const alreadyDisliked = video.dislikedBy.includes(userId);
  if (alreadyDisliked) {
    video.dislikedBy.pull(userId);
    video.dislikes = Math.max(video.dislikes - 1, 0);
  } else {
    video.dislikedBy.push(userId);
    video.dislikes += 1;

    if (video.likedBy.includes(userId)) {
      video.likedBy.pull(userId);
      video.likes = Math.max(video.likes - 1, 0);
    }
  }

  await video.save();

  res.status(200).json({
    message: 'Dislike updated',
    dislikes: video.dislikes,
    dislikedBy: video.dislikedBy,
    likes: video.likes,
    likedBy: video.likedBy,
    currentUserId: userId   // 👈 send back for frontend
  });
});


export const views= async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
