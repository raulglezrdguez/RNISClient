import axios from 'axios';
import { storage } from '../storage/mmkv';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';

const api = axios.create({
  baseURL: 'https://pruebareactjs.test-class.com/Api/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = storage.getString('auth.token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      console.warn('Sesión expirada o token inválido. Cerrando sesión...');
      store.dispatch(logout());
    }
    return Promise.reject(err);
  },
);

export default api;
