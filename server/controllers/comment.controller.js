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
    const userId = req.user?._id; // Optional - user might not be logged in

    const comments = await Comment.find({ videoId, parentId: null })
      .populate('author', 'username avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      })
      .sort({ createdAt: -1 });

    // Format comments and add user interaction info
    const formattedComments = await Promise.all(
      comments.map(async (comment) => {
        const formatted = await formatComment(comment);
        
        // Add user interaction info if user is logged in
        if (userId) {
          formatted.userLiked = comment.likedBy.includes(userId);
          formatted.userDisliked = comment.dislikedBy.includes(userId);
        }
        
        // Process replies too
        if (formatted.replies) {
          formatted.replies = await Promise.all(
            formatted.replies.map(async (reply) => {
              if (userId) {
                reply.userLiked = comment.likedBy.includes(userId);
                reply.userDisliked = comment.dislikedBy.includes(userId);
              }
              return reply;
            })
          );
        }
        
        return formatted;
      })
    );

    res.json({
      success: true,
      comments: formattedComments
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

    // First check if user already disliked this comment
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user already liked this comment
    if (comment.likedBy.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You already liked this comment'
      });
    }

    // Remove from dislikedBy if user previously disliked
    if (comment.dislikedBy.includes(userId)) {
      comment.dislikedBy.pull(userId);
      comment.dislikes -= 1;
    }

    // Add to likedBy and increment likes
    comment.likedBy.push(userId);
    comment.likes += 1;

    await comment.save();

    const formattedComment = await formatComment(comment);

    res.json({
      success: true,
      comment: formattedComment,
      userInteractions: {
        liked: true,
        disliked: false
      }
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

    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user already disliked this comment
    if (comment.dislikedBy.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You already disliked this comment'
      });
    }

    // Remove from likedBy if user previously liked
    if (comment.likedBy.includes(userId)) {
      comment.likedBy.pull(userId);
      comment.likes -= 1;
    }

    // Add to dislikedBy and increment dislikes
    comment.dislikedBy.push(userId);
    comment.dislikes += 1;

    await comment.save();

    const formattedComment = await formatComment(comment);

    res.json({
      success: true,
      comment: formattedComment,
      userInteractions: {
        liked: false,
        disliked: true
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to dislike comment',
      error: error.message
    });
  }
};



