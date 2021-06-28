import { Comment, Post } from './interface/Schemas';

import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URI || '';

export async function addFollow(headers: { user: string; target: string }) {
  console.log(headers);
  return new Promise<object | Error>((resolve, reject) => {
    axios
      .get('/api/users/addFollow', { headers: headers })
      // TODO: update the redux store, inject the new follower
      .then((data: object) => resolve(data))
      .catch((err: Error) => reject(err));
  });
}

export async function removeFollow(headers: { user: string; target: string }) {
  return new Promise<object | Error>((resolve, reject) => {
    axios
      .get('/api/users/removeFollow', { headers: headers })
      // TODO: update the redux store remove the follower
      .then((data: object) => resolve(data))
      .catch((err: Error) => reject(err));
  });
}

export async function fetchPost(headers: { slug: string }) {
  return new Promise<Post | Error>((resolve, reject) => {
    axios
      .get('/api/posts/getPost', { headers: headers })
      .then((data) => resolve(data.data as Post))
      .catch((err) => reject(err));
  });
}

export async function likePost(headers: { slug: string; token: string }) {
  return new Promise<Post | Error>((resolve, reject) => {
    axios
      .get('/api/posts/like', { headers: headers })
      .then((data) => resolve(data.data as Post))
      .catch((err) => reject(err));
  });
}

export async function deletePost(body: { token: string; slug: string }) {
  return new Promise((resolve, reject) => {
    axios.post('/api/posts/delete', body).then((data) => resolve(data));
  });
}
export async function addComment(req: {
  token: string;
  slug: string;
  body: string;
}) {
  return new Promise<Comment>((resolve, reject) => {
    axios
      .post('/api/posts/addCommentToPost', req)
      .then((data) => resolve(data.data))
      .catch((err) => reject(err));
  });
}

export async function deleteComment(body: {
  slug: string;
  token: string;
  id: string;
}) {
  console.log(body);
  return new Promise<Post>((resolve, reject) => {
    axios
      .post('/api/posts/deleteComment', body)
      .then((data) => resolve(data.data as Post))
      .catch((err) => reject(err));
  });
}

export async function editPost(
  body: FormData,
  headers: { token: string; slug: string }
) {
  return new Promise<Post>((resolve, reject) => {
    axios
      .post('/api/posts/editpost', body, { headers: headers })
      .then((data) => resolve(data.data as Post))
      .catch((err) => reject(err));
  });
}

export async function fetchUserPost(token: string, username: string) {
  return new Promise<Post[]>((resolve, reject) => {
    axios
      .get('/api/posts/fetchUserPosts', {
        headers: { token: token, username: username },
      })
      .then((data) => {
        const arr = [];
        for (const val of Object.values(
          data.data as { [key: string]: Post[] }
        )) {
          if (val !== null) {
            arr.push(...val);
          }
        }
        arr.reverse();
        resolve(arr as Post[]);
      })
      .catch((err) => reject(err));
  });
}

export async function fetchUserTagged(token: string, username: string) {
  return new Promise<Post[]>((resolve, reject) => {
    axios
      .get('/api/posts/fetchUserTagged', {
        headers: { token: token, username: username },
      })
      .then((data) => {
        const arr = [];
        for (const val of Object.values(
          data.data as { [key: string]: Post[] }
        )) {
          arr.push(...val);
        }
        arr.reverse();
        resolve(arr as Post[]);
      })
      .catch((err) => reject(err));
  });
}
