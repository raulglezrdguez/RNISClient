import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLogin, logout as logoutAction } from '../store/slices/authSlice';
import { storage } from '../storage/mmkv';
import api from '../api/api';
import { LoginFormData, RegisterFormData } from '../utils/validationSchemas';

export const useAuth = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginFormData, rememberMe: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/Authenticate/login', data);
      const { token, expiration, userid, username } = response.data;

      dispatch(setLogin({ token, expiration, userid, username }));

      if (rememberMe) {
        storage.set('remembered_username', data.username);
      } else {
        storage.remove('remembered_username');
      }

      return true;
    } catch (err: any) {
      const msg =
        err.response?.data?.message || 'Error de conexión con el servidor';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const register = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);
    try {
      const url = '/Authenticate/register';
      const response = await api.post(url, data);

      if (response.data.status === 'Success') {
        return true;
      } else {
        setError(response.data.message || 'Error inesperado');
        return false;
      }
    } catch (err: any) {
      console.error(JSON.stringify(err));
      const msg = err.response?.data?.message || 'Error al crear la cuenta';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { register, login, logout, loading, error, setError };
};
