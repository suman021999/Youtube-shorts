import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_VIDEO_URL;

export const searchVideos = async (query) => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const response = await axios.get(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, {
      headers: headers
    });
    
    return response.data.data || [];
  } catch (error) {
    console.error('Error searching videos:', error);
    // Fallback to empty array instead of throwing error
    return [];
  }
};

export const getAllVideos = async () => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const response = await axios.get(`${API_BASE_URL}/all`, {
      headers: headers
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};