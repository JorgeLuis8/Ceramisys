import axios from 'axios';
import Cookies from 'js-cookie';

export const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5087'
    : 'https://api.cjmcanelas.shop';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = Cookies.get('auth_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
