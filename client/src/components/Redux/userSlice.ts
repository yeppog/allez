import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { User } from '../../interface/Schemas';
import axios from 'axios';

// sets the default axios baseURL to the environmental variable
axios.defaults.baseURL = process.env.REACT_APP_API_URI || '';

/**
 * User refers to the authenticated user
 * Users refer to the array of users that were loaded while the app is running.
 */

interface UsersState {
  user: User;
  search: { [key: string]: any }[];
  users: { [key: string]: any }[];
  gym: { [key: string]: any }[];
  routes: { [key: string]: any }[];
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  loginStatus: 'idle' | 'succeeded' | 'failed';
  error: string | null | undefined;
  darkMode: boolean;
}

const initialState = {
  user: {} as User,
  search: [],
  gym: [],
  users: [],
  routes: [],
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

export const fetchGyms = createAsyncThunk('user/fetchGyms', async () => {
  const res = await axios.get('/api/gyms/gyms');
  return res.data;
});
export const fetchUsers = createAsyncThunk('user/fetchUsers', async () => {
  const res = await axios.get('/api/users/users');
  return res.data;
});
export const fetchRoutes = createAsyncThunk('user/fetchRoutes', async () => {
  const res = await axios.get('/api/routes/routes');
  return res.data;
});

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
      localStorage.setItem('token', action.payload);
      state.user = action.payload.user;
      state.status = 'succeeded';
      state.loginStatus = 'succeeded';
    },
    logoutUser: (state) => {
      localStorage.removeItem('token');
      state.user = {} as User;
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
    updateUser: (state, action) => {
      state.user = action.payload;
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
      state.user = { ...action.payload };
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
      state.user = { ...action.payload };
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.status = 'failed';
    });
    builder.addCase(fetchGyms.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.search = [...state.search, ...action.payload];
      state.gym = [...state.gym, ...action.payload];
    });
    builder.addCase(fetchGyms.rejected, (state, action) => {
      state.status = 'failed';
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.users = [...state.users, ...action.payload];
      state.search = [...state.search, ...action.payload];
    });
    builder.addCase(fetchRoutes.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.routes = [...state.routes, ...action.payload];
    });
  },
});

const HTTPOptions = {
  headers: { 'Content-Type': 'application/json' },
};

export default userSlice.reducer;
export const getUser = () => (state: UsersState) => state.user;
export const getStatus = (state: UsersState) => state.status;
export const { loginUser, logoutUser, toggleDarkMode, verifyUser, updateUser } =
  userSlice.actions;
