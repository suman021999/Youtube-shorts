
//chat.controller.js
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import asyncHandler from 'express-async-handler';
import CommentController from './comment.controller.js';

class ChatController {
  constructor(io) {
    this.io = io;
    this.commentController = new CommentController();
    this.initializeRedis();
    this.initializeSocket();
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

    this.pubClient = createClient(redisOptions);
    this.subClient = this.pubClient.duplicate();

    await Promise.all([this.pubClient.connect(), this.subClient.connect()]);
    this.io.adapter(createAdapter(this.pubClient, this.subClient));

    this.pubClient.on('error', (err) => console.error('Redis pub error:', err));
    this.subClient.on('error', (err) => console.error('Redis sub error:', err));
  }

  initializeSocket() {
    this.io.on('connection', (socket) => {
      console.log(`New connection: ${socket.id}`);

      socket.on('join-video', (videoId) => {
        socket.join(videoId);
        console.log(`Socket ${socket.id} joined video ${videoId}`);
      });

      socket.on('leave-video', (videoId) => {
        socket.leave(videoId);
        console.log(`Socket ${socket.id} left video ${videoId}`);
      });

      // Socket event handlers with asyncHandler
      socket.on('add-comment', asyncHandler(async (data) => {
        const comment = await this.commentController.createComment(data);
        this.io.to(data.videoId).emit('new-comment', comment);
      }));

      socket.on('edit-comment', asyncHandler(async (data) => {
        const comment = await this.commentController.updateComment(
          data.commentId,
          data.author,
          data.text
        );
        this.io.to(data.videoId).emit('comment-edited', comment);
      }));

      socket.on('delete-comment', asyncHandler(async (data) => {
        await this.commentController.deleteComment(data.commentId, data.author);
        this.io.to(data.videoId).emit('comment-deleted', data);
      }));

      socket.on('like-comment', asyncHandler(async (data) => {
        const comment = await this.commentController.likeComment(
          data.commentId,
          data.author
        );
        this.io.to(data.videoId).emit('comment-liked', comment);
      }));

      socket.on('disconnect', () => {
        console.log(`Disconnected: ${socket.id}`);
      });

      // Error handling middleware for socket events
      socket.use(([event, ...args], next) => {
        const ack = args[args.length - 1];
        if (typeof ack === 'function') {
          args[args.length - 1] = asyncHandler(ack);
        }
        next();
      });
    });

    // Global error handling
    this.io.on('error', (err) => {
      console.error('Socket.IO error:', err);
    });
  }

  async cleanup() {
    await this.pubClient.quit();
    await this.subClient.quit();
  }
}

export default ChatController;
