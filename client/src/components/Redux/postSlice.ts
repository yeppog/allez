import { Post, User } from '../../interface/Schemas';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';

// sets the default axios baseURL to the environmental variable
axios.defaults.baseURL = process.env.REACT_APP_API_URI || '';

/**
 * User refers to the authenticated user
 * Users refer to the array of users that were loaded while the app is running.
 */

interface PostState {
  posts: {};
  status: string;
  error: string | null | undefined;
}

const initialState = {
  posts: {},
  status: 'idle',
  error: null,
} as PostState;

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (data: { token: string; date: Date; duration: number }) => {
    const res = await axios.post(
      'api/posts/fetchFollowPosts',
      { date: data.date, duration: data.duration },
      { headers: { token: data.token } }
    );
    console.log(res.data);
    return res.data;
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state, action) => {
      state.status = 'pending';
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.posts = { ...action.payload };
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

export default postSlice.reducer;
