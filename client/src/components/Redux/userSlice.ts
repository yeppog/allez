import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { LoginCredentials } from '../../interface/Credentials';
import { User } from '../../interface/Schemas';
import axios from 'axios';

// sets the default axios baseURL to the environmental variable
axios.defaults.baseURL = process.env.REACT_APP_API_URI || '';

interface UsersState {
  user: User[];
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  loginStatus: 'idle' | 'succeeded' | 'failed';
  error: string | null | undefined;
  darkMode: boolean;
}

const initialState = {
  user: [],
  loginStatus: 'idle',
  status: 'idle',
  error: null,
  darkMode: localStorage.getItem('darkMode') === 'true' ? true : false,
} as UsersState;

export const checkLoggedInUser = createAsyncThunk(
  'user/checkLoggedInUser',
  async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw Error('No Token');
    } else {
      const res = await axios.get('/api/users/verify', {
        headers: { ...HTTPOptions.headers, token: token },
      });
      return res.data;
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (data: FormData) => {
    const res = await axios.post('api/users/updateProfile', data, {
      headers: { 'Content-Type': 'multipart/form' },
    });
    return res.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      localStorage.setItem('token', action.payload.token);
      state.user = action.payload.user;
      state.status = 'succeeded';
    },
    logoutUser: (state) => {
      localStorage.removeItem('token');
      state.user = [];
      state.status = 'idle';
    },
    toggleDarkMode: (state) => {
      console.log(localStorage.getItem('darkMode'));
      localStorage.setItem('darkMode', `${!state.darkMode}`);
      state.darkMode = !state.darkMode;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkLoggedInUser.pending, (state, action) => {
      state.status = 'pending';
    });
    builder.addCase(checkLoggedInUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.loginStatus = 'succeeded';
      state.user = [action.payload];
    });
    builder.addCase(checkLoggedInUser.rejected, (state, action) => {
      state.status = 'failed';
      state.loginStatus = 'failed';
      state.error = action.error.message;
    });
    builder.addCase(updateUserProfile.pending, (state, action) => {
      state.status = 'pending';
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.user = [action.payload];
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.status = 'failed';
    });
  },
});

const HTTPOptions = {
  headers: { 'Content-Type': 'application/json' },
};

export default userSlice.reducer;
export const getUser = (state: UsersState) => state.user;
export const getStatus = (state: UsersState) => state.status;
export const { loginUser, logoutUser, toggleDarkMode } = userSlice.actions;
