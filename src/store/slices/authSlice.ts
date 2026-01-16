import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storage } from '../../storage/mmkv';

interface UserState {
  expiration: string | null;
  userid: string | null;
  username: string | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  expiration: storage.getString('auth.expiration') || null,
  userid: storage.getString('auth.userid') || null,
  username: storage.getString('auth.username') || null,
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
        expiration: string;
        userid: string;
        username: string;
        token: string;
      }>,
    ) => {
      const { token, expiration, userid, username } = action.payload;
      state.expiration = expiration;
      state.userid = userid;
      state.username = username;
      state.token = token;
      state.isAuthenticated = true;

      storage.set('auth.token', token);
      storage.set('auth.expiration', expiration);
      storage.set('auth.userid', userid);
      storage.set('auth.username', username);
    },
    logout: state => {
      state.expiration = null;
      state.userid = null;
      state.username = null;
      state.token = null;
      state.isAuthenticated = false;
      storage.remove('auth.token');
      storage.remove('auth.expiration');
      storage.remove('auth.userid');
      storage.remove('auth.username');
    },
  },
});

export const { setLogin, logout } = authSlice.actions;
export default authSlice.reducer;
