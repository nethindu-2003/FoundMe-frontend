import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001/api/auth',  // adjust if deployed or using a proxy
  withCredentials: false, // optional, set to true if you're using cookies
});

export const signup = (userData) => API.post('/signup', userData);

export const login = (credentials) => API.post('/login', credentials);

export const forgotPassword = (email) => API.post('/forgot-password', { email });

export const resetPassword = (token, newPassword) =>
  API.post(`/reset-password/${token}`, { password: newPassword });

export const verifyEmail = (token) => API.get(`/verify-email/${token}`);
