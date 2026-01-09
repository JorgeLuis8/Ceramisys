import axios from 'axios';
import Cookies from 'js-cookie';

// Define a URL base dinamicamente
// Se estiver rodando 'npm run dev', ele usa o localhost.
// Se estiver rodando 'npm run build/start' ou na Vercel/VPS, usa a URL de produção.
export const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? "http://localhost:5087"              // URL Local (Dev)
  : "https://api.ceramicacanelas.shop/"; // URL Produção

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Cola o token em TODA requisição que sair
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = Cookies.get('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});