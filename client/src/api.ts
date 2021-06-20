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
