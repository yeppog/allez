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
  posts: { [key: string]: Post[] };
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
    return res.data;
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (data: { token: string; slug: string }) => {
    const res = await axios.get('/api/posts/like', { headers: data });
    return res.data;
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    removePost: (state, action) => {
      const posts = state.posts;
      const slug = action.payload.slug;
      const date = new Date(action.payload.date);
      const key = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`;
      var arr = [...posts[key]];
      arr = arr.filter((x) => x.slug != slug);
      posts[key] = arr;
      state.posts = posts;
      state.status = 'succeeded';
    },
  },
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
    builder.addCase(likePost.fulfilled, (state, action) => {
      const post = { ...state.posts };
      const slug = action.payload.slug;
      // TODO: Make this more efficient. Change the structure of the post array perhaps..
      for (const [key, value] of Object.entries(post)) {
        for (let i = 0; i < value.length; i++) {
          for (const [key2, value2] of Object.entries(value[i])) {
            if (value2 == slug) {
              const newVal = [...value];
              newVal[i] = action.payload;
              post[key] = newVal;
            }
          }
        }
      }
      state.posts = post;
      state.status = 'succeeded';
    });
    builder.addCase(likePost.rejected, (state, action) => {
      state.error = action.error.message;
      state.status = 'failed';
    });
    builder.addCase(likePost.pending, (state, action) => {
      state.status = 'pending';
    });
  },
});

export default postSlice.reducer;
export const { removePost } = postSlice.actions;
