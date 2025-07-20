import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import Chat from '../model/chat.model.js';

class ChatController {
  constructor(io) {
    this.io = io;
    
    // Configure Redis connection
    const redisOptions = {
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    };

    // Add TLS options if using Upstash Redis
    if (process.env.REDIS_URL?.includes('upstash.io')) {
      redisOptions.socket = {
        tls: true,
        rejectUnauthorized: false
      };
    }

    // Create Redis clients
    this.redisClient = createClient(redisOptions);
    this.pubClient = createClient(redisOptions);
    this.subClient = this.pubClient.duplicate();
    
    // Add error listeners
    this.redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    this.pubClient.on('error', (err) => console.error('Pub Client Error:', err));
    this.subClient.on('error', (err) => console.error('Sub Client Error:', err));

    this.initializeRedis();
    if (io) this.initializeSocket();
  }

  /* ======================
     REDIS INITIALIZATION
  ====================== */
  async initializeRedis() {
    try {
      await Promise.all([
        this.redisClient.connect(),
        this.pubClient.connect(),
        this.subClient.connect()
      ]);
      
      if (this.io) {
        this.io.adapter(createAdapter(this.pubClient, this.subClient));
      }
      console.log('Redis connected successfully');
    } catch (err) {
      console.error('Redis connection error:', err);
      // Implement retry logic here if needed
    }
  }

  /* ======================
     SOCKET.IO HANDLERS
  ====================== */
  initializeSocket() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Join video chat room
      socket.on('joinVideoChat', async (videoId, userId) => {
        await this.handleJoinVideoChat(socket, videoId, userId);
      });

      // Send message
      socket.on('sendVideoMessage', async (data) => {
        await this.handleSendVideoMessage(data);
      });

      // Leave video chat
      socket.on('leaveVideoChat', async (videoId, userId) => {
        await this.handleLeaveVideoChat(socket, videoId, userId);
      });

      // Disconnect
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }

  /* ======================
     HTTP ROUTE HANDLERS
  ====================== */
  async getChatHistory(req, res) {
    try {
      const { videoId } = req.params;
      const messages = await this.getVideoChatMessages(videoId, req.query.start || 0, req.query.end || 49);
      res.json(messages);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async likeMessage(req, res) {
    try {
      const result = await this.handleLikeMessage(
        req.params.videoId,
        req.params.messageId,
        req.user.id
      );
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async dislikeMessage(req, res) {
    try {
      const result = await this.handleDislikeMessage(
        req.params.videoId,
        req.params.messageId,
        req.user.id
      );
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getActiveUsers(req, res) {
    try {
      const users = await this.getActiveUsersInVideo(req.params.videoId);
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /* ======================
     CORE CHAT FUNCTIONALITY
  ====================== */
  async handleJoinVideoChat(socket, videoId, userId) {
    try {
      socket.join(videoId);
      await this.redisClient.hSet(`video:${videoId}:users`, userId, socket.id);
      const messages = await this.getVideoChatMessages(videoId, 0, 49);
      socket.emit('chatHistory', messages);
    } catch (err) {
      console.error('Error joining video chat:', err);
    }
  }

  async handleSendVideoMessage({ videoId, userId, message }) {
    try {
      const timestamp = Date.now();
      const chatMessage = await this.storeVideoMessage(videoId, userId, message, timestamp);
      this.io.to(videoId).emit('newVideoMessage', chatMessage);
    } catch (err) {
      console.error('Error handling video message:', err);
    }
  }

  async handleLeaveVideoChat(socket, videoId, userId) {
    try {
      socket.leave(videoId);
      await this.redisClient.hDel(`video:${videoId}:users`, userId);
    } catch (err) {
      console.error('Error leaving video chat:', err);
    }
  }

  async handleLikeMessage(videoId, messageId, userId) {
    const messages = await this.redisClient.zRange(`video:${videoId}:messages`, 0, -1);
    
    for (const msg of messages) {
      const parsedMsg = JSON.parse(msg);
      if (parsedMsg.id === messageId) {
        if (!parsedMsg.likedBy) parsedMsg.likedBy = [];
        if (parsedMsg.likedBy.includes(userId)) {
          return { success: false, message: 'Already liked' };
        }
        
        parsedMsg.likes += 1;
        parsedMsg.likedBy.push(userId);
        
        await this.updateMessageInRedis(videoId, parsedMsg);
        this.io.to(videoId).emit('messageLiked', { messageId, likes: parsedMsg.likes });
        
        return { success: true, likes: parsedMsg.likes };
      }
    }
    return { success: false, message: 'Message not found' };
  }

  async handleDislikeMessage(videoId, messageId, userId) {
    const messages = await this.redisClient.zRange(`video:${videoId}:messages`, 0, -1);
    
    for (const msg of messages) {
      const parsedMsg = JSON.parse(msg);
      if (parsedMsg.id === messageId) {
        if (!parsedMsg.likedBy) parsedMsg.likedBy = [];
        if (!parsedMsg.dislikedBy) parsedMsg.dislikedBy = [];
        
        if (parsedMsg.likedBy.includes(userId)) {
          parsedMsg.likes -= 1;
          parsedMsg.likedBy = parsedMsg.likedBy.filter(id => id !== userId);
        }
        
        if (!parsedMsg.dislikedBy.includes(userId)) {
          parsedMsg.dislikes = (parsedMsg.dislikes || 0) + 1;
          parsedMsg.dislikedBy.push(userId);
        }
        
        await this.updateMessageInRedis(videoId, parsedMsg);
        this.io.to(videoId).emit('messageDisliked', { 
          messageId, 
          likes: parsedMsg.likes || 0,
          dislikes: parsedMsg.dislikes || 0
        });
        
        return { 
          success: true, 
          likes: parsedMsg.likes || 0,
          dislikes: parsedMsg.dislikes || 0
        };
      }
    }
    return { success: false, message: 'Message not found' };
  }

  /* ======================
     REDIS UTILITY METHODS
  ====================== */
  async storeVideoMessage(videoId, userId, message, timestamp) {
    const messageId = `msg:${timestamp}:${userId}`;
    const chatMessage = {
      id: messageId,
      videoId,
      userId,
      message,
      timestamp,
      likes: 0,
      dislikes: 0
    };
    
    await this.redisClient.zAdd(`video:${videoId}:messages`, {
      score: timestamp,
      value: JSON.stringify(chatMessage)
    });
    
    // MongoDB persistence
    await new Chat({
      videoId,
      userId,
      message,
      timestamp: new Date(timestamp),
      likes: 0,
      dislikes: 0
    }).save();
    
    await this.redisClient.expire(`video:${videoId}:messages`, 60 * 60 * 24 * 30);
    return chatMessage;
  }

  async updateMessageInRedis(videoId, messageObj) {
    await this.redisClient.zRem(`video:${videoId}:messages`, JSON.stringify(messageObj));
    await this.redisClient.zAdd(`video:${videoId}:messages`, {
      score: messageObj.timestamp,
      value: JSON.stringify(messageObj)
    });
  }

  async getVideoChatMessages(videoId, start = 0, end = 49) {
    try {
      const messages = await this.redisClient.zRange(
        `video:${videoId}:messages`,
        start,
        end,
        { REV: true }
      );
      return messages.map(msg => JSON.parse(msg));
    } catch (err) {
      console.error('Error getting chat messages:', err);
      return [];
    }
  }

  async getActiveUsersInVideo(videoId) {
    try {
      const users = await this.redisClient.hGetAll(`video:${videoId}:users`);
      return Object.keys(users);
    } catch (err) {
      console.error('Error getting active users:', err);
      return [];
    }
  }
}

export default ChatController;






