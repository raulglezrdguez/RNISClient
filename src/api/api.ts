import axios from 'axios';
import { storage } from '../storage/mmkv';

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
  // Debug: show full request URL for emulator troubleshooting
  try {
    // config.url may be relative
    const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
    console.log('[API REQUEST]', config.method?.toUpperCase(), fullUrl);
  } catch {
    // ignore
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    console.error(
      '[API ERROR]',
      err?.response?.status,
      err?.response?.data || err.message,
    );
    return Promise.reject(err);
  },
);

export default api;
