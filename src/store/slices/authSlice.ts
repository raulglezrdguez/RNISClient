import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storage } from '../../storage/mmkv';

interface UserState {
  id: string;
  nombre: string;
  apellidos: string;
  identificacion: string;
  imagen: string;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  id: '',
  nombre: '',
  apellidos: '',
  identificacion: '',
  imagen: '',
  token: storage.getString('auth.token') || null,
  isAuthenticated: !!storage.getString('auth.token'),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (
      state,
      action: PayloadAction<{
        user: Omit<UserState, 'token' | 'isAuthenticated'>;
        token: string;
      }>,
    ) => {
      const { user, token } = action.payload;
      state.id = user.id;
      state.nombre = user.nombre;
      state.apellidos = user.apellidos;
      state.identificacion = user.identificacion;
      state.imagen = user.imagen;
      state.token = token;
      state.isAuthenticated = true;

      // Persistir el token de inmediato
      storage.set('auth.token', token);
      storage.set('user.data', JSON.stringify(user));
    },
    logout: state => {
      state.id = '';
      state.nombre = '';
      state.apellidos = '';
      state.identificacion = '';
      state.imagen = '';
      state.token = null;
      state.isAuthenticated = false;
      storage.remove('auth.token');
      storage.remove('user.data');
    },
  },
});

export const { setLogin, logout } = authSlice.actions;
export default authSlice.reducer;
