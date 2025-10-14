import { create } from 'zustand';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { user, accessToken } = response.data.data;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
      toast.success('Login successful!');
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const response = await axios.post('/auth/register', userData);
      set({ isLoading: false });
      toast.success(response.data.message);
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  },

  verifyOTP: async (mobile, otp) => {
    set({ isLoading: true });
    try {
      const response = await axios.post('/auth/verify-otp', { mobile, otp });
      const { user, accessToken } = response.data.data;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
      toast.success('OTP verified successfully!');
      return true;
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'OTP verification failed');
      return false;
    }
  },

  logout: async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
      toast.success('Logged out successfully');
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      const response = await axios.get('/auth/me');
      const user = response.data.data;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  updateUser: (userData) => {
    const updatedUser = { ...JSON.parse(localStorage.getItem('user')), ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },
}));
