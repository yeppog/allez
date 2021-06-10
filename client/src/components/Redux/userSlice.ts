import { PublicUser, User } from '../../interface/Schemas';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { LoginCredentials } from '../../interface/Credentials';
import axios from 'axios';

// sets the default axios baseURL to the environmental variable
axios.defaults.baseURL = process.env.REACT_APP_API_URI || '';

/**
 * User refers to the authenticated user
 * Users refer to the array of users that were loaded while the app is running.
 */

interface UsersState {
  user: User[];
  users: string;
  // { [key: string]: User | PublicUser };
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  loginStatus: 'idle' | 'succeeded' | 'failed';
  error: string | null | undefined;
  darkMode: boolean;
}

const initialState = {
  user: [],
  users: '',
  loginStatus: 'idle',
  status: 'idle',
  error: null,
  darkMode: localStorage.getItem('darkMode') === 'true' ? true : false,
} as UsersState;

export const fetchPublicUser = createAsyncThunk(
  'user/fetchPublicUser',
  async (username: string) => {
    if (!username) {
      throw Error('No Username');
    } else {
      console.log(username);
      const res = await axios.get('api/users/getPublicProfile', {
        headers: { ...HTTPOptions.headers, username: username },
      });

      return res.data;
    }
  }
);

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
      console.log(action.payload.user.username);
      localStorage.setItem('token', action.payload.token);
      state.user = action.payload.user;
      state.status = 'succeeded';
      state.loginStatus = 'succeeded';
    },
    logoutUser: (state) => {
      localStorage.removeItem('token');
      state.user = [];
      state.status = 'idle';
      state.loginStatus = 'idle';
    },
    toggleDarkMode: (state) => {
      localStorage.setItem('darkMode', `${!state.darkMode}`);
      state.darkMode = !state.darkMode;
    },
    verifyUser: (state, action) => {
      state.user = action.payload;
      state.loginStatus = 'succeeded';
      state.status = 'succeeded';
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
    builder.addCase(fetchPublicUser.pending, (state, action) => {
      state.status = 'pending';
    });
    builder.addCase(fetchPublicUser.fulfilled, (state, action) => {
      // console.log(action.payload);
      // state.status = 'succeeded';
      // const hold = { ...state.users };
      // hold[action.payload.username] = action.payload;
      state.users = 'a';
    });
    builder.addCase(fetchPublicUser.rejected, (state, action) => {
      state.status = 'failed';
    });
  },
});

const HTTPOptions = {
  headers: { 'Content-Type': 'application/json' },
};

export default userSlice.reducer;
export const getUser = () => (state: UsersState) => state.user;
export const getStatus = (state: UsersState) => state.status;
export const { loginUser, logoutUser, toggleDarkMode, verifyUser } =
  userSlice.actions;
