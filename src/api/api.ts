import axios from 'axios';
import { storage } from '../storage/mmkv';

const api = axios.create({
  baseURL: 'https://pruebareactjs.test-class.com/Api/',
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

export default api;
