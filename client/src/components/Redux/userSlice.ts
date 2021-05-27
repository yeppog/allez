import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { LoginCredentials } from '../../interface/Credentials';
import axios from 'axios';

// sets the default axios baseURL to the environmental variable
axios.defaults.baseURL = process.env.REACT_APP_API_URI;

interface UsersState {
  user: string[];
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

const initialState = {
  user: [],
  status: 'idle',
  error: null,
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      localStorage.setItem('token', action.payload.token);
      state.user = [action.payload.user];
      state.status = 'succeeded';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkLoggedInUser.pending, (state, action) => {
      state.status = 'pending';
    });
    builder.addCase(checkLoggedInUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.user = [action.payload];
    });
    builder.addCase(checkLoggedInUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

const HTTPOptions = {
  headers: { 'Content-Type': 'application/json' },
};

export default userSlice.reducer;
export const getUser = (state: UsersState) => state.user;
export const getStatus = (state: UsersState) => state.status;
export const { loginUser } = userSlice.actions;
