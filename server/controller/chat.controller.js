import Chat from '../model/chat.model.js';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

class ChatController {
  constructor(io) {
    this.io = io;
    this.redisClient = null;
    this.redisSubscriber = null;
    this.initializeRedis();
    this.setupSocketIO();
    this.messageBuffer = [];
    this.MAX_BUFFER_SIZE = 50;
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
      console.log(' 🛒 Redis configuration for Upstash');
    }

    this.redisClient = createClient(redisOptions);
    this.redisSubscriber = this.redisClient.duplicate();

    await this.redisClient.connect();
    await this.redisSubscriber.connect();

    // Create Redis adapter for Socket.IO
    const pubClient = this.redisClient;
    const subClient = this.redisSubscriber;
    this.io.adapter(createAdapter(pubClient, subClient));

    this.redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });
  }

  setupSocketIO() {
    this.io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      // Join room for private messaging
      socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
      });

      // Leave room
      socket.on('leaveRoom', (room) => {
        socket.leave(room);
        console.log(`User left room: ${room}`);
      });

      // Handle private messages
      socket.on('privateMessage', async (data) => {
        try {
          const { senderId, receiverId, text, chatId } = data;
          
          // Add to buffer
          this.messageBuffer.push({
            sender: senderId,
            text,
            chatId,
            createdAt: new Date()
          });

          // If buffer reaches max size, save to MongoDB
          if (this.messageBuffer.length >= this.MAX_BUFFER_SIZE) {
            await this.flushMessageBuffer();
          }

          // Emit to receiver
          this.io.to(receiverId).emit('newMessage', {
            senderId,
            text,
            timestamp: new Date()
          });

          // Also emit to sender for their own UI update
          socket.emit('newMessage', {
            senderId,
            text,
            timestamp: new Date()
          });

        } catch (error) {
          console.error('Error handling private message:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  async flushMessageBuffer() {
    if (this.messageBuffer.length === 0) return;

    try {
      // Group messages by chatId
      const messagesByChat = {};
      this.messageBuffer.forEach(msg => {
        if (!messagesByChat[msg.chatId]) {
          messagesByChat[msg.chatId] = [];
        }
        messagesByChat[msg.chatId].push({
          sender: msg.sender,
          text: msg.text,
          readBy: [],
          createdAt: msg.createdAt
        });
      });

      // Update each chat with its messages
      for (const chatId in messagesByChat) {
        await Chat.findByIdAndUpdate(
          chatId,
          {
            $push: { messages: { $each: messagesByChat[chatId] } },
            $set: { lastMessage: messagesByChat[chatId][messagesByChat[chatId].length - 1]._id }
          }
        );
      }

      // Clear buffer
      this.messageBuffer = [];
    } catch (error) {
      console.error('Error flushing message buffer:', error);
    }
  }

  async createChat(req, res) {
    try {
      const { participantIds } = req.body;
      
      if (participantIds.length < 2) {
        return res.status(400).json({ error: 'At least 2 participants required' });
      }

      // Check if chat already exists
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
      res.status(500).json({ error: error.message });
    }
  }

  async getChat(req, res) {
    try {
      const { chatId } = req.params;
      const chat = await Chat.findById(chatId)
        .populate('participants', 'username avatar')
        .populate('messages.sender', 'username avatar');

      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserChats(req, res) {
    try {
      const userId = req.user._id;
      const chats = await Chat.find({ participants: userId })
        .populate('participants', 'username avatar')
        .populate('lastMessage', 'text createdAt')
        .sort({ updatedAt: -1 });

      res.json(chats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async markMessagesAsRead(req, res) {
    try {
      const { chatId } = req.params;
      const userId = req.user._id;

      await Chat.updateMany(
        { _id: chatId, 'messages.readBy': { $ne: userId } },
        { $addToSet: { 'messages.$[].readBy': userId } }
      );

      res.json({ message: 'Messages marked as read' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default ChatController;