import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Login failed';
  }
};

export const register = async (email, password) => {
  try {
    const response = await api.post('/register', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Registration failed';
  }
};

export const getReviews = async (user_id) => {
  try {
    const response = await api.get(`/users/${user_id}/reviews`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch reviews';
  }
};

export const postReview = async (user_id, reviewData) => {
  try {
    const response = await api.post(`/users/${user_id}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to post review';
  }
};

export const updateReview = async (review_id, reviewData) => {
  try {
    const response = await api.put(`/reviews/${review_id}`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to update review';
  }
};

export const deleteReview = async (review_id) => {
  try {
    await api.delete(`/reviews/${review_id}`);
    return true;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to delete review';
  }
};