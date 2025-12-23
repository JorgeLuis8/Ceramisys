import axios from 'axios';
import Cookies from 'js-cookie'; // Importação nova

// URL Base global
export const API_BASE_URL = "http://localhost:5087";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Cola o token em TODA requisição que sair
api.interceptors.request.use((config) => {
  // O cookie funciona tanto no Next.js client quanto server-side (com configurações extras), 
  // mas aqui focamos no Client.
  if (typeof window !== 'undefined') {
    // AQUI: Mudamos para ler dos Cookies
    const token = Cookies.get('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});