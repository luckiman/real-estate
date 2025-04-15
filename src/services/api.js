import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProperties = async (filters = {}) => {
  try {
    console.log('Fetching properties with filters:', filters);
    const response = await api.get('/products', { params: filters });
    console.log('Properties response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error.response?.data || error.message);
    throw error;
  }
};

export const getAllProperties = async () => {
  try {
    console.log('Fetching all properties');
    const response = await api.get('/products/all');
    console.log('All properties response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching all properties:', error.response?.data || error.message);
    throw error;
  }
};

export const getPropertyDetails = async (id) => {
  try {
    console.log('Fetching property details for ID:', id);
    const response = await api.get(`/product/${id}`);
    console.log('Property details response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching property details:', error.response?.data || error.message);
    throw error;
  }
}; 