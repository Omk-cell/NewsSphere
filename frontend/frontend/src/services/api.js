import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const fetchNews = async (category = 'general', limit = 20) => {
  try {
    const response = await axios.get(`${API_URL}/news`, {
      params: { category, limit }
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};