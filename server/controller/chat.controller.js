// import Comment from '../model/comment.model.js';
// import { createClient } from 'redis';
// import { createAdapter } from '@socket.io/redis-adapter';

// class ChatController  {
//   constructor(io) {
//     this.io = io;
//     this.redisClient = null;
//     this.redisSubscriber = null;
//     this.messageBuffer = [];
//     this.MAX_BUFFER_SIZE = 50;
//     this.initializeRedis();
//     this.setupSocketIO();
//   }

//   async initializeRedis() {
//     try {
//       const redisOptions = {
//         url: process.env.REDIS_URL || 'redis://localhost:6379'
//       };

//       if (process.env.REDIS_URL?.includes('upstash.io')) {
//         redisOptions.socket = {
//           tls: true,
//           rejectUnauthorized: false
//         };
//         console.log(' 🛒 Redis configuration for Upstash');
//       }

//       this.redisClient = createClient(redisOptions);
//       this.redisSubscriber = this.redisClient.duplicate();

//       await Promise.all([
//         this.redisClient.connect(),
//         this.redisSubscriber.connect()
//       ]);

//       this.io.adapter(createAdapter(this.redisClient, this.redisSubscriber));

//       this.redisClient.on('error', (err) => {
//         console.error('Redis Client Error:', err);
//       });
//     } catch (error) {
//       console.error('Redis initialization failed:', error);
//     }
//   }

//   setupSocketIO() {
//     this.io.on('connection', (socket) => {
//       console.log('New client connected:', socket.id);

//       // Chat-related socket events
//       socket.on('joinRoom', (room) => {
//         socket.join(room);
//         console.log(`User joined room: ${room}`);
//       });

//       socket.on('leaveRoom', (room) => {
//         socket.leave(room);
//         console.log(`User left room: ${room}`);
//       });

//       socket.on('privateMessage', async (data) => {
//         await this.handlePrivateMessage(socket, data);
//       });

//       // Comment-related socket events
//       socket.on('subscribeToComments', (videoId) => {
//         socket.join(`comments:${videoId}`);
//         console.log(`User subscribed to comments for video: ${videoId}`);
//       });

//       socket.on('unsubscribeFromComments', (videoId) => {
//         socket.leave(`comments:${videoId}`);
//         console.log(`User unsubscribed from comments for video: ${videoId}`);
//       });

//       socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//       });
//     });
//   }

//   /* ************** CHAT METHODS ************** */

//   async handlePrivateMessage(socket, data) {
//     try {
//       const { senderId, receiverId, text, chatId } = data;
      
//       const message = {
//         sender: senderId,
//         text,
//         chatId,
//         createdAt: new Date()
//       };

//       this.messageBuffer.push(message);

//       if (this.messageBuffer.length >= this.MAX_BUFFER_SIZE) {
//         await this.flushMessageBuffer();
//       }

//       const messagePayload = {
//         senderId,
//         text,
//         timestamp: new Date()
//       };

//       // Emit to both receiver and sender
//       this.io.to(receiverId).emit('newMessage', messagePayload);
//       socket.emit('newMessage', messagePayload);

//     } catch (error) {
//       console.error('Error handling private message:', error);
//     }
//   }

//   async flushMessageBuffer() {
//     if (this.messageBuffer.length === 0) return;

//     try {
//       const messagesByChat = this.messageBuffer.reduce((acc, msg) => {
//         if (!acc[msg.chatId]) {
//           acc[msg.chatId] = [];
//         }
//         acc[msg.chatId].push({
//           sender: msg.sender,
//           text: msg.text,
//           readBy: [],
//           createdAt: msg.createdAt
//         });
//         return acc;
//       }, {});

//       const updatePromises = Object.entries(messagesByChat).map(([chatId, messages]) => {
//         const lastMessage = messages[messages.length - 1];
//         return Chat.findByIdAndUpdate(
//           chatId,
//           {
//             $push: { messages: { $each: messages } },
//             $set: { lastMessage: lastMessage._id }
//           }
//         );
//       });

//       await Promise.all(updatePromises);
//       this.messageBuffer = [];
//     } catch (error) {
//       console.error('Error flushing message buffer:', error);
//     }
//   }

//   async createChat(req, res) {
//     try {
//       const { participantIds } = req.body;
      
//       if (!Array.isArray(participantIds)) {
//         return res.status(400).json({ error: 'participantIds must be an array' });
//       }

//       if (participantIds.length < 2) {
//         return res.status(400).json({ error: 'At least 2 participants required' });
//       }

//       const existingChat = await Chat.findOne({
//         participants: { $all: participantIds, $size: participantIds.length }
//       });

//       if (existingChat) {
//         return res.status(200).json(existingChat);
//       }

//       const chat = await Chat.create({
//         participants: participantIds,
//         messages: []
//       });

//       res.status(201).json(chat);
//     } catch (error) {
//       console.error('Error creating chat:', error);
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async getChat(req, res) {
//     try {
//       const { chatId } = req.params;
//       const chat = await Chat.findById(chatId)
//         .populate('participants', 'username avatar')
//         .populate('messages.sender', 'username avatar');

//       if (!chat) {
//         return res.status(404).json({ error: 'Chat not found' });
//       }

//       res.json(chat);
//     } catch (error) {
//       console.error('Error getting chat:', error);
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async getUserChats(req, res) {
//     try {
//       const userId = req.user._id;
//       const chats = await Chat.find({ participants: userId })
//         .populate('participants', 'username avatar')
//         .populate('lastMessage', 'text createdAt')
//         .sort({ updatedAt: -1 });

//       res.json(chats);
//     } catch (error) {
//       console.error('Error getting user chats:', error);
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async markMessagesAsRead(req, res) {
//     try {
//       const { chatId } = req.params;
//       const userId = req.user._id;

//       const result = await Chat.updateMany(
//         { _id: chatId, 'messages.readBy': { $ne: userId } },
//         { $addToSet: { 'messages.$[].readBy': userId } }
//       );

//       if (result.matchedCount === 0) {
//         return res.status(404).json({ error: 'Chat not found' });
//       }

//       res.json({ message: 'Messages marked as read' });
//     } catch (error) {
//       console.error('Error marking messages as read:', error);
//       res.status(500).json({ error: error.message });
//     }
//   }

//   /* ************** COMMENT METHODS ************** */

//   async createComment(req, res) {
//     try {
//       const { videoId, text, parentCommentId } = req.body;
//       const userId = req.user._id;

//       const commentData = {
//         videoId,
//         author: userId,
//         text
//       };

//       if (parentCommentId) {
//         commentData.parentComment = parentCommentId;
//       }

//       const comment = await Comment.create(commentData);

//       if (parentCommentId) {
//         await Comment.findByIdAndUpdate(
//           parentCommentId,
//           { $push: { replies: comment._id } }
//         );
//       }

//       const populatedComment = await Comment.populate(comment, {
//         path: 'author',
//         select: 'username avatar'
//       });

//       await this.redisClient.publish(
//         `comments:${videoId}`,
//         JSON.stringify({ type: 'NEW_COMMENT', comment: populatedComment })
//       );

//       res.status(201).json(populatedComment);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async getCommentsByVideo(req, res) {
//     try {
//       const { videoId } = req.params;
//       const { page = 1, limit = 50 } = req.query;

//       const comments = await Comment.find({ videoId, parentComment: null })
//         .populate('author', 'username avatar')
//         .sort({ createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(parseInt(limit));

//       res.json(comments);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async getReplies(req, res) {
//     try {
//       const { commentId } = req.params;
//       const replies = await Comment.find({ parentComment: commentId })
//         .populate('author', 'username avatar');

//       res.json(replies);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async updateComment(req, res) {
//     try {
//       const { commentId } = req.params;
//       const { text } = req.body;
//       const userId = req.user._id;

//       const comment = await Comment.findOneAndUpdate(
//         { _id: commentId, author: userId },
//         { text },
//         { new: true }
//       ).populate('author', 'username avatar');

//       if (!comment) {
//         return res.status(404).json({ error: 'Comment not found or unauthorized' });
//       }

//       await this.redisClient.publish(
//         `comments:${comment.videoId}`,
//         JSON.stringify({ type: 'UPDATE_COMMENT', comment })
//       );

//       res.json(comment);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async deleteComment(req, res) {
//     try {
//       const { commentId } = req.params;
//       const userId = req.user._id;

//       const comment = await Comment.findOneAndUpdate(
//         { _id: commentId, author: userId },
//         { isDeleted: true, text: '[deleted]' },
//         { new: true }
//       );

//       if (!comment) {
//         return res.status(404).json({ error: 'Comment not found or unauthorized' });
//       }

//       await this.redisClient.publish(
//         `comments:${comment.videoId}`,
//         JSON.stringify({ type: 'DELETE_COMMENT', commentId })
//       );

//       res.json({ message: 'Comment marked as deleted' });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async likeComment(req, res) {
//     try {
//       const { commentId } = req.params;
//       const comment = await Comment.findByIdAndUpdate(
//         commentId,
//         { $inc: { likes: 1 } },
//         { new: true }
//       ).populate('author', 'username avatar');

//       await this.redisClient.publish(
//         `comments:${comment.videoId}`,
//         JSON.stringify({ 
//           type: 'LIKE_COMMENT', 
//           commentId, 
//           likes: comment.likes 
//         })
//       );

//       res.json(comment);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async dislikeComment(req, res) {
//     try {
//       const { commentId } = req.params;
//       const comment = await Comment.findByIdAndUpdate(
//         commentId,
//         { $inc: { dislikes: 1 } },
//         { new: true }
//       ).populate('author', 'username avatar');

//       await this.redisClient.publish(
//         `comments:${comment.videoId}`,
//         JSON.stringify({ 
//           type: 'DISLIKE_COMMENT', 
//           commentId, 
//           dislikes: comment.dislikes 
//         })
//       );

//       res.json(comment);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async getCommentStats(req, res) {
//     try {
//       const { commentId } = req.params;
//       const comment = await Comment.findById(commentId)
//         .select('likes dislikes');

//       if (!comment) {
//         return res.status(404).json({ error: 'Comment not found' });
//       }

//       res.json({
//         likes: comment.likes,
//         dislikes: comment.dislikes
//       });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// }

// export default ChatController;

//-------------------------------------------------------------

import Comment from '../model/comment.model.js';
import Chat from '../model/chat.model.js';

class ChatController  {
  constructor(io) {
    this.io = io;
    this.messageBuffer = [];
    this.MAX_BUFFER_SIZE = 50;
    this.setupSocketIO();
  }

  setupSocketIO() {
    this.io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      // Chat-related socket events
      socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
      });

      socket.on('leaveRoom', (room) => {
        socket.leave(room);
        console.log(`User left room: ${room}`);
      });

      socket.on('privateMessage', async (data) => {
        await this.handlePrivateMessage(socket, data);
      });

      // Comment-related socket events
      socket.on('subscribeToComments', (videoId) => {
        socket.join(`comments:${videoId}`);
        console.log(`User subscribed to comments for video: ${videoId}`);
      });

      socket.on('unsubscribeFromComments', (videoId) => {
        socket.leave(`comments:${videoId}`);
        console.log(`User unsubscribed from comments for video: ${videoId}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  /* ************** CHAT METHODS ************** */

  async handlePrivateMessage(socket, data) {
    try {
      const { senderId, receiverId, text, chatId } = data;
      
      const message = {
        sender: senderId,
        text,
        chatId,
        createdAt: new Date()
      };

      this.messageBuffer.push(message);

      if (this.messageBuffer.length >= this.MAX_BUFFER_SIZE) {
        await this.flushMessageBuffer();
      }

      const messagePayload = {
        senderId,
        text,
        timestamp: new Date()
      };

      // Emit to both receiver and sender
      this.io.to(receiverId).emit('newMessage', messagePayload);
      socket.emit('newMessage', messagePayload);

    } catch (error) {
      console.error('Error handling private message:', error);
    }
  }

  async flushMessageBuffer() {
    if (this.messageBuffer.length === 0) return;

    try {
      const messagesByChat = this.messageBuffer.reduce((acc, msg) => {
        if (!acc[msg.chatId]) {
          acc[msg.chatId] = [];
        }
        acc[msg.chatId].push({
          sender: msg.sender,
          text: msg.text,
          readBy: [],
          createdAt: msg.createdAt
        });
        return acc;
      }, {});

      const updatePromises = Object.entries(messagesByChat).map(([chatId, messages]) => {
        const lastMessage = messages[messages.length - 1];
        return Chat.findByIdAndUpdate(
          chatId,
          {
            $push: { messages: { $each: messages } },
            $set: { lastMessage: lastMessage._id }
          }
        );
      });

      await Promise.all(updatePromises);
      this.messageBuffer = [];
    } catch (error) {
      console.error('Error flushing message buffer:', error);
    }
  }

  async createChat(req, res) {
    try {
      const { participantIds } = req.body;
      
      if (!Array.isArray(participantIds)) {
        return res.status(400).json({ error: 'participantIds must be an array' });
      }

      if (participantIds.length < 2) {
        return res.status(400).json({ error: 'At least 2 participants required' });
      }

      const existingChat = await Chat.findOne({
        participants: { $all: participantIds, $size: participantIds.length }
      });

      if (existingChat) {
        return res.status(200).json(existingChat);
      }

      const chat = await Chat.create({
        participants: participantIds,
        messages: []
      });

      res.status(201).json(chat);
    } catch (error) {
      console.error('Error creating chat:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getChat(req, res) {
    try {
      const { chatId } = req.params;
      const chat = await Comment.findById(chatId)
        .populate('participants', 'username avatar')
        .populate('messages.sender', 'username avatar');

      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      res.json(chat);
    } catch (error) {
      console.error('Error getting chat:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getUserChats(req, res) {
    try {
      const userId = req.user._id;
      const chats = await Comment.find({ participants: userId })
        .populate('participants', 'username avatar')
        .populate('lastMessage', 'text createdAt')
        .sort({ updatedAt: -1 });

      res.json(chats);
    } catch (error) {
      console.error('Error getting user chats:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async markMessagesAsRead(req, res) {
    try {
      const { chatId } = req.params;
      const userId = req.user._id;

      const result = await Chat.updateMany(
        { _id: chatId, 'messages.readBy': { $ne: userId } },
        { $addToSet: { 'messages.$[].readBy': userId } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      res.json({ message: 'Messages marked as read' });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /* ************** COMMENT METHODS ************** */

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

      // Emit directly via socket.io instead of Redis
      this.io.to(`comments:${videoId}`).emit('NEW_COMMENT', { comment: populatedComment });

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

      // Emit directly via socket.io instead of Redis
      this.io.to(`comments:${comment.videoId}`).emit('UPDATE_COMMENT', { comment });

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

      // Emit directly via socket.io instead of Redis
      this.io.to(`comments:${comment.videoId}`).emit('DELETE_COMMENT', { commentId });

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

      // Emit directly via socket.io instead of Redis
      this.io.to(`comments:${comment.videoId}`).emit('LIKE_COMMENT', { 
        commentId, 
        likes: comment.likes 
      });

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

      // Emit directly via socket.io instead of Redis
      this.io.to(`comments:${comment.videoId}`).emit('DISLIKE_COMMENT', { 
        commentId, 
        dislikes: comment.dislikes 
      });

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

export default ChatController;
