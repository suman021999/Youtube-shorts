
import axios from 'axios';

const API_URL = import.meta.env.VITE_CHAT_URL; // Ensure this environment variable is set in your .env file

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getComments = async (videoId) => {
  try {
    const response = await axios.get(`${API_URL}/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const createComment = async (videoId, text, parentId = null) => {
  try {
    const requestBody = { videoId, text };
    if (parentId) {
      requestBody.parentId = parentId;
    }
    
    const response = await axios.post(
      API_URL,
      requestBody,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const updateComment = async (id, text) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}`,
      { text },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

export const deleteComment = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${id}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const likeComment = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/like/${id}`,
      {},
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error liking comment:', error);
    throw error;
  }
};

export const dislikeComment = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/dislike/${id}`,
      {},
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error disliking comment:', error);
    throw error;
  }
};

export const searchComments = async (videoId, query) => {
  try {
    const response = await axios.get(`${API_URL}/search/${videoId}?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching comments:', error);
    throw error;
  }
};