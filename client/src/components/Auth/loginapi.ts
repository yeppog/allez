import axios, { AxiosResponse } from 'axios';

export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface ResetRequestCredentials {
  email: string;
}

export interface ResetCredentials {
  token: string;
  password: string;
}

const HTTPOptions = {
  headers: { 'Content-Type': 'application/json' },
};

axios.defaults.baseURL = process.env.REACT_APP_API_URI || '';

export class AuthAPI {
  static async login(cred: LoginCredentials) {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/users/login', cred, HTTPOptions)
        .then((user) => resolve(user))
        .catch((err) => reject(err));
    });
  }

  static async register(cred: RegisterCredentials) {
    return new Promise<AxiosResponse>((resolve, reject) => {
      axios
        .post('/api/users/register', cred, HTTPOptions)
        .then((user) => resolve(user))
        .catch((err) => reject(err));
    });
  }

  static async resetRequest(cred: ResetRequestCredentials) {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/users/reset', {
          headers: { ...HTTPOptions.headers, email: cred.email },
        })
        .then((user) => resolve(user))
        .catch((err) => reject(err));
    });
  }

  static async reset(cred: ResetCredentials) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          '/api/users/resetEnd',
          { password: cred.password },
          { headers: { ...HTTPOptions.headers, token: cred.token } }
        )

        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }

  static async confirm(token: string) {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/users/confirm', {
          headers: { ...HTTPOptions.headers, token: token },
        })
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }

  static async verify(token: string) {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/users/verify', {
          headers: { ...HTTPOptions.headers, token },
        })
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }
}
