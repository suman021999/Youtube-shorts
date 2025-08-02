// comment.controller.js
import asyncHandler from 'express-async-handler';
import Comment from '../model/comment.model.js';
import Chat from '../model/chat.model.js';

class CommentController {
  constructor() {}

  // Business logic methods (not directly used as route handlers)
  async createComment({ text, videoId, userId, parentCommentId = null }) {
    const comment = new Comment({
      text,
      videoId,
      author: userId,
      parentComment: parentCommentId
    });

    await comment.save();

    // Add to chat
    let chat = await Chat.findOne({ videoId });
    if (!chat) {
      chat = new Chat({ videoId });
    }

    chat.comments.push(comment._id);
    chat.totalComments += 1;
    await chat.save();

    // If it's a reply, add to parent comment
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id }
      });
    }

    return comment.populate('author', 'username avatar');
  }

  async getComments(videoId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    return await Comment.find({ videoId, parentComment: null })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      });
  }

  async getCommentById(commentId) {
    return await Comment.findById(commentId)
      .populate('author', 'username avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      });
  }

  async updateComment(commentId, userId, text) {
    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, author: userId },
      { text, isEdited: true },
      { new: true }
    ).populate('author', 'username avatar');

    if (!comment) {
      throw new Error('Comment not found or unauthorized');
    }

    return comment;
  }

  async deleteComment(commentId, userId) {
    const comment = await Comment.findOneAndDelete({
      _id: commentId,
      author: userId
    });

    if (!comment) {
      throw new Error('Comment not found or unauthorized');
    }

    // Remove from chat
    await Chat.updateOne(
      { videoId: comment.videoId },
      { $pull: { comments: commentId }, $inc: { totalComments: -1 } }
    );

    // Remove from parent comment if it's a reply
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: comment._id }
      });
    }

    return comment;
  }

  async likeComment(commentId, userId) {
    return await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { likes: 1 } },
      { new: true }
    ).populate('author', 'username avatar');
  }

  async dislikeComment(commentId, userId) {
    return await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { dislikes: 1 } },
      { new: true }
    ).populate('author', 'username avatar');
  }

  // Route handlers using asyncHandler
  create = asyncHandler(async (req, res) => {
    const { text, videoId, parentCommentId } = req.body;
    const userId = req.user._id;
    
    const comment = await this.createComment({
      text,
      videoId,
      userId,
      parentCommentId
    });
    
    res.status(201).json(comment);
  });

  list = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const comments = await this.getComments(
      videoId,
      parseInt(page),
      parseInt(limit)
    );
    
    res.json(comments);
  });

  show = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const comment = await this.getCommentById(commentId);
    
    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }
    
    res.json(comment);
  });

  update = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;
    
    const updatedComment = await this.updateComment(
      commentId,
      userId,
      text
    );
    
    res.json(updatedComment);
  });

  destroy = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;
    
    const deletedComment = await this.deleteComment(
      commentId,
      userId
    );
    
    res.json({ message: 'Comment deleted successfully', deletedComment });
  });

  like = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;
    
    const likedComment = await this.likeComment(commentId, userId);
    
    res.json(likedComment);
  });

  dislike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;
    
    const dislikedComment = await this.dislikeComment(
      commentId,
      userId
    );
    
    res.json(dislikedComment);
  });
}

export default CommentController;