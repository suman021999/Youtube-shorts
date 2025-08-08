// chat.service.js
import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_CHAT_URL;

// Singleton socket instance
let socket = null;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const getSocket = () => {
  if (!socket) {
    socket = io(API_URL, {
      autoConnect: false,
      withCredentials: true,
      auth: (cb) => {
        cb({ token: localStorage.getItem('token') });
      }
    });
  }
  return socket;
};

export const chatService = {
  // Socket.IO methods
  connectSocket() {
    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }
    return socket;
  },

  disconnectSocket() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  subscribeToComments(videoId, callback) {
    const socket = getSocket();
    socket.emit('subscribeToComments', videoId);
    socket.on(`comments:${videoId}`, callback);
    return () => {
      socket.off(`comments:${videoId}`, callback);
    };
  },

  unsubscribeFromComments(videoId) {
    const socket = getSocket();
    socket.emit('unsubscribeFromComments', videoId);
  },

  // Chat methods
  async createChat(participants) {
    const response = await axios.post(`${API_URL}/chats`, { participants }, getAuthHeaders());
    return response.data;
  },

  async getChat(chatId) {
    const response = await axios.get(`${API_URL}/chats/${chatId}`, getAuthHeaders());
    return response.data;
  },

  async getUserChats() {
    const response = await axios.get(`${API_URL}/chats`, getAuthHeaders());
    return response.data;
  },

  async markMessagesAsRead(chatId) {
    const response = await axios.patch(`${API_URL}/chats/${chatId}/read`, {}, getAuthHeaders());
    return response.data;
  },

  // Comment methods
  async createComment(videoId, text, parentId = null) {
    const response = await axios.post(
      `${API_URL}/comments`,
      { videoId, text, parentId },
      getAuthHeaders()
    );
    return response.data;
  },

  async getCommentsByVideo(videoId) {
    const response = await axios.get(`${API_URL}/comments/video/${videoId}`);
    return response.data;
  },

  async getReplies(commentId) {
    const response = await axios.get(`${API_URL}/comments/${commentId}/replies`);
    return response.data;
  },

  async updateComment(commentId, text) {
    const response = await axios.put(
      `${API_URL}/comments/${commentId}`,
      { text },
      getAuthHeaders()
    );
    return response.data;
  },

  async deleteComment(commentId) {
    const response = await axios.delete(`${API_URL}/comments/${commentId}`, getAuthHeaders());
    return response.data;
  },

  async likeComment(commentId) {
    const response = await axios.post(`${API_URL}/comments/${commentId}/like`, {}, getAuthHeaders());
    return response.data;
  },

  async dislikeComment(commentId) {
    const response = await axios.post(`${API_URL}/comments/${commentId}/dislike`, {}, getAuthHeaders());
    return response.data;
  },

  async getCommentStats(commentId) {
    const response = await axios.get(`${API_URL}/comments/${commentId}/stats`);
    return response.data;
  }
};