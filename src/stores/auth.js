import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/axios';

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || '');
  let storedUser = null;
  try {
    const rawUser = localStorage.getItem('user');
    if (rawUser && rawUser !== 'undefined' && rawUser !== 'null') {
      storedUser = JSON.parse(rawUser);
    }
  } catch (e) {
    storedUser = null;
    localStorage.removeItem('user');
  }
  const user = ref(storedUser);

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  // Actions
  async function login(credentials) {
    try {
      const response = await api.post('/login', credentials);
      token.value = response.data.data.token;
      user.value = response.data.data.user;
      
      // Store in localStorage
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  }

  async function register(userData) {
    try {
      const response = await api.post('/register', userData);
      token.value = response.data.data.token;
      user.value = response.data.data.user;
      
      // Store in localStorage
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  }

  async function fetchProfile() {
    try {
      const response = await api.get('/profile');
      user.value = response.data.user;
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch profile';
    }
  }

  async function updateProfile(data) {
    try {
      const response = await api.put('/profile', data);
      user.value = response.data.user;
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update profile';
    }
  }

  async function changePassword(data) {
    try {
      const response = await api.put('/change-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to change password';
    }
  }

  function logout() {
    token.value = '';
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Initialize - restore auth state if token exists
  function initAuth() {
    if (token.value && user.value) {
      // Optionally verify token is still valid
      fetchProfile().catch(() => {
        logout();
      });
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    login,
    register,
    fetchProfile,
    updateProfile,
    changePassword,
    logout,
    initAuth,
  };
});