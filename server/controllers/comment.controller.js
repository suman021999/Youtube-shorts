// controllers/commentController.js
import Comment from '../models/comment.model.js';
import {User} from '../models/user.model.js';

// Helper function to format comments with author details
const formatComment = async (comment) => {
  const author = await User.findById(comment.author).select('username avatar');
  const replies = await Promise.all(
    comment.replies.map(replyId => Comment.findById(replyId))
  );
  
  const formattedReplies = await Promise.all(
    replies.map(reply => formatComment(reply))
  );

  return {
    id: comment._id,
    author: author?.username || 'Unknown',
    avatar: author?.avatar,
    text: comment.text,
    likes: comment.likes,
    dislikes: comment.dislikes,
    time: formatTimeAgo(comment.createdAt),
    timestamp: comment.createdAt,
    replies: formattedReplies,
    parentId: comment.parentId
  };
};

const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 10) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString();
};

// Get comments for a video
export const getComments = async (req, res) => {
  try {
    const { videoId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Find top-level comments (no parentId)
    const comments = await Comment.find({ 
      videoId, 
      parentId: null 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const formattedComments = await Promise.all(
      comments.map(comment => formatComment(comment))
    );

    res.json({
      success: true,
      comments: formattedComments,
      total: await Comment.countDocuments({ videoId, parentId: null })
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: error.message
    });
  }
};

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { videoId, text, parentId } = req.body;
    const userId = req.user._id;

    if (!text || !videoId) {
      return res.status(400).json({
        success: false,
        message: 'Text and videoId are required'
      });
    }

    const commentData = {
      videoId,
      author: userId,
      text,
      parentId: parentId || null
    };

    const comment = await Comment.create(commentData);

    // If it's a reply, add it to the parent's replies array
    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, {
        $push: { replies: comment._id }
      });
    }

    const formattedComment = await formatComment(comment);

    res.status(201).json({
      success: true,
      comment: formattedComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create comment',
      error: error.message
    });
  }
};

// Update a comment
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if the user is the author
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to edit this comment'
      });
    }

    comment.text = text;
    await comment.save();

    const formattedComment = await formatComment(comment);

    res.json({
      success: true,
      comment: formattedComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update comment',
      error: error.message
    });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if the user is the author or an admin
    if (comment.author.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this comment'
      });
    }

    // If it's a top-level comment, delete all its replies first
    if (!comment.parentId) {
      await Comment.deleteMany({ _id: { $in: comment.replies } });
    } else {
      // If it's a reply, remove it from parent's replies array
      await Comment.findByIdAndUpdate(comment.parentId, {
        $pull: { replies: comment._id }
      });
    }

    await Comment.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
      error: error.message
    });
  }
};

// Like a comment
export const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const formattedComment = await formatComment(comment);

    res.json({
      success: true,
      comment: formattedComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to like comment',
      error: error.message
    });
  }
};

// Dislike a comment
export const dislikeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findByIdAndUpdate(
      id,
      { $inc: { dislikes: 1 } },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const formattedComment = await formatComment(comment);

    res.json({
      success: true,
      comment: formattedComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to dislike comment',
      error: error.message
    });
  }
};

// Search comments
export const searchComments = async (req, res) => {
  try {
    const { query } = req.query;
    const { videoId } = req.params;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const comments = await Comment.find({
      videoId,
      $text: { $search: query }
    })
    .sort({ score: { $meta: "textScore" } })
    .limit(20);

    const formattedComments = await Promise.all(
      comments.map(comment => formatComment(comment))
    );

    res.json({
      success: true,
      comments: formattedComments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search comments',
      error: error.message
    });
  }
};