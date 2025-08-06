import Comment from '../model/comment.model.js';
import { createClient } from 'redis';

class CommentController {
  constructor() {
    this.redisClient = null;
    this.redisSubscriber = null;
    this.initializeRedis();
  }

  async initializeRedis() {
    const redisOptions = {
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    };

    if (process.env.REDIS_URL?.includes('upstash.io')) {
      redisOptions.socket = {
        tls: true,
        rejectUnauthorized: false
      };
    }

    this.redisClient = createClient(redisOptions);
    this.redisSubscriber = this.redisClient.duplicate();

    await this.redisClient.connect();
    await this.redisSubscriber.connect();

    this.redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });
  }

  async createComment(req, res) {
    try {
      const { videoId, text, parentCommentId } = req.body;
      const userId = req.user._id;

      const commentData = {
        videoId,
        author: userId,
        text
      };

      if (parentCommentId) {
        commentData.parentComment = parentCommentId;
      }

      const comment = await Comment.create(commentData);

      if (parentCommentId) {
        await Comment.findByIdAndUpdate(
          parentCommentId,
          { $push: { replies: comment._id } }
        );
      }

      const populatedComment = await Comment.populate(comment, {
        path: 'author',
        select: 'username avatar'
      });

      await this.redisClient.publish(
        `comments:${videoId}`,
        JSON.stringify({ type: 'NEW_COMMENT', comment: populatedComment })
      );

      res.status(201).json(populatedComment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCommentsByVideo(req, res) {
    try {
      const { videoId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const comments = await Comment.find({ videoId, parentComment: null })
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getReplies(req, res) {
    try {
      const { commentId } = req.params;
      const replies = await Comment.find({ parentComment: commentId })
        .populate('author', 'username avatar');

      res.json(replies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateComment(req, res) {
    try {
      const { commentId } = req.params;
      const { text } = req.body;
      const userId = req.user._id;

      const comment = await Comment.findOneAndUpdate(
        { _id: commentId, author: userId },
        { text },
        { new: true }
      ).populate('author', 'username avatar');

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found or unauthorized' });
      }

      await this.redisClient.publish(
        `comments:${comment.videoId}`,
        JSON.stringify({ type: 'UPDATE_COMMENT', comment })
      );

      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteComment(req, res) {
    try {
      const { commentId } = req.params;
      const userId = req.user._id;

      const comment = await Comment.findOneAndUpdate(
        { _id: commentId, author: userId },
        { isDeleted: true, text: '[deleted]' },
        { new: true }
      );

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found or unauthorized' });
      }

      await this.redisClient.publish(
        `comments:${comment.videoId}`,
        JSON.stringify({ type: 'DELETE_COMMENT', commentId })
      );

      res.json({ message: 'Comment marked as deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async likeComment(req, res) {
    try {
      const { commentId } = req.params;
      const comment = await Comment.findByIdAndUpdate(
        commentId,
        { $inc: { likes: 1 } },
        { new: true }
      ).populate('author', 'username avatar');

      await this.redisClient.publish(
        `comments:${comment.videoId}`,
        JSON.stringify({ 
          type: 'LIKE_COMMENT', 
          commentId, 
          likes: comment.likes 
        })
      );

      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async dislikeComment(req, res) {
    try {
      const { commentId } = req.params;
      const comment = await Comment.findByIdAndUpdate(
        commentId,
        { $inc: { dislikes: 1 } },
        { new: true }
      ).populate('author', 'username avatar');

      await this.redisClient.publish(
        `comments:${comment.videoId}`,
        JSON.stringify({ 
          type: 'DISLIKE_COMMENT', 
          commentId, 
          dislikes: comment.dislikes 
        })
      );

      res.json(comment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCommentStats(req, res) {
    try {
      const { commentId } = req.params;
      const comment = await Comment.findById(commentId)
        .select('likes dislikes');

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      res.json({
        likes: comment.likes,
        dislikes: comment.dislikes
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default CommentController;







