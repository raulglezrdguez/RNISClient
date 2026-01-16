// src/storage/mmkv.ts
import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

// Adaptador para Redux Persist (si decides usarlo) o uso directo
export const reduxStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key: string) => {
    storage.remove(key);
    return Promise.resolve();
  },
};
