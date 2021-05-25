import './RegisterComponent.scss';

import {
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

import React from 'react';
import { RegisterCredentials } from '../../../interface/Credentials';
import axios from 'axios';
import { useState } from 'react';

const RegisterComponent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credentials, setCredentials] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Redudant code just to display in frontend instead of console.logging , can remove later
  const [message, setMessage] = useState('');

  interface State {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setCredentials({ ...credentials, [prop]: event.target.value });
    };

  /**
   * Passes the credentials the user has entered to the redux handler to log the user in.
   *
   * @param e Event that is passed in when the form is submitted
   */
  const onSubmit = (e: any): void => {
    // preventDefault prevents the page from refreshing when the form is submitted
    e.preventDefault();
    // simple validator for now
    // TODO: Better validation for email and password
    if (validator(credentials)) {
      const username = credentials.username;
      const email = credentials.email;
      const password = credentials.password;
      const credential = { username, email, password } as RegisterCredentials;
      registerLogin(credential);
      console.log(credential);
      setMessage('Valid');
    } else {
      console.log('Form is invalid or passwords do not match');
    }
  };

  const registerLogin = (credentials: RegisterCredentials): void => {
    try {
      console.log(credentials);
      const url = 'http://localhost:3001/api/users/register';
      axios
        .post(url, credentials, HTTPOptions)
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  const validator = (form: State): boolean => {
    if (form.name && form.email && form.username) {
      if (form.password === form.confirmPassword) {
        const email = form.email;
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }
    }
    return false;
  };

  const HTTPOptions = {
    headers: { 'Content-Type': 'application/json' },
  };

  return (
    <div className="RegisterComponent" data-testid="RegisterComponent">
      <Card className="registerForm" variant="outlined">
        <h2>Register</h2>
        <form onSubmit={(e) => onSubmit(e)}>
          <Grid>
            <Grid item>
              <FormControl fullWidth variant="filled">
                <InputLabel>Full Name</InputLabel>
                <Input
                  fullWidth
                  className="name"
                  type="text"
                  value={credentials.name}
                  onChange={handleChange('name')}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth variant="filled">
                <InputLabel>Username</InputLabel>
                <Input
                  fullWidth
                  className="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleChange('username')}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth variant="filled">
                <InputLabel>Email</InputLabel>
                <Input
                  fullWidth
                  className="email"
                  type="text"
                  value={credentials.email}
                  onChange={handleChange('email')}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth variant="filled">
                <InputLabel>Password</InputLabel>
                <Input
                  fullWidth
                  className="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleChange('password')}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth variant="filled">
                <InputLabel>Confirm Password</InputLabel>
                <Input
                  fullWidth
                  className="cpassword"
                  type="password"
                  value={credentials.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                />
              </FormControl>
            </Grid>
            <Grid item className="registerButton">
              <Button
                fullWidth
                className="loginButton"
                variant="text"
                color="default"
                type="submit"
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>

      {/* <form action="" className="registerForm" onSubmit={e => onSubmit(e)}>
        <h2>Registration</h2>
        <input
          type="text"
          className="username"
          placeholder="username"
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type="text"
          className="email"
          placeholder="email"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="text"
          className="password"
          placeholder="password"
          onChange={e => setPassword(e.target.value)}
        />

        <input
          type="text"
          className="confirm_password"
          placeholder="Confirm Password"
          onChange={e => setConfirmPassword(e.target.value)}
        />

        <button className="submit" type="submit">Register</button>
        <p>username: {username}</p>
        <p>email: {email}</p>
        <p>password: {password}</p>
        <p>confirm_password: {confirmPassword}</p>

        {message ?
          <p>
            {message}
          </p>
          : <div></div>
        }


      </form> */}
    </div>
  );
};

export default RegisterComponent;
