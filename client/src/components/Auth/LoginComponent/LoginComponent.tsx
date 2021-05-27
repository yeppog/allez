import './LoginComponent.scss';

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
import { checkLoggedInUser, loginUser } from '../../Redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { Alert } from '@material-ui/lab';
import { LoginCredentials } from '../../../interface/Credentials';
import React from 'react';
import axios from 'axios';
import { debug } from 'console';
import { useHistory } from 'react-router-dom';

interface State {
  email: string;
  password: string;
  showPassword: boolean;
}

const LoginComponent: React.FC = () => {
  const [credentials, setCredentials] = useState<State>({
    email: '',
    password: '',
    showPassword: false,
  });

  const [message, setMessage] = useState<string>();
  const dispatch = useDispatch();
  const history = useHistory();

  /**
   * Helper to set state for hooks
   */
  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setCredentials({ ...credentials, [prop]: event.target.value });
    };

  /**
   * Helper to toggle the input type of the pasword field
   */
  const handleClickShowPassword = () => {
    setCredentials({ ...credentials, showPassword: !credentials.showPassword });
  };

  const handleClose = (): void => {
    setMessage('');
  };

  /**
   * DEPRECATED
   * Passes the credentials the user has entered to the redux handler to log the user in.
   *
   * @param e Event that is passed in when the form is submitted
   */

  // const onSubmit = async (e: any) => {
  //   // preventDefault prevents the page from refreshing when the form is submitted
  //   e.preventDefault();
  //   // simple validator for now
  //   // TODO: Better validation for email and password
  //   if (credentials.email && credentials.password) {
  //     const email = credentials.email;
  //     const password = credentials.password;
  //     const credential = { email, password } as LoginCredentials;
  //     dispatch(loginUser(credential));
  //   } else {
  //     console.log('Form is invalid');
  //   }
  // };

  const HTTPOptions: object = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const email = credentials.email;
    const password = credentials.password;
    const credential = { email, password } as LoginCredentials;
    await axios
      .post('/api/users/login', credential, HTTPOptions)
      .then((data) => {
        if (data.status === 200) {
          dispatch(loginUser(data.data));
          history.push('/home');
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage(err.message);
      });
  };

  return (
    <div className="LoginComponent" data-testid="LoginComponent">
      <Card className="form" variant="outlined">
        <h2>Login</h2>
        <form onSubmit={(e) => onSubmit(e)}>
          <Grid>
            <Grid item>
              <FormControl fullWidth variant="filled">
                <InputLabel className="label">Username / Email</InputLabel>
                <Input
                  fullWidth
                  className="username"
                  type="text"
                  id="email"
                  value={credentials.email}
                  onChange={handleChange('email')}
                ></Input>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth variant="filled">
                <InputLabel className="label">Password</InputLabel>
                <Input
                  fullWidth
                  className="password"
                  type={credentials.showPassword ? 'text' : 'password'}
                  id="standard-adornment-password"
                  value={credentials.password}
                  onChange={handleChange('password')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                      >
                        {credentials.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            {message && (
              <Alert
                severity="error"
                onClose={() => handleClose()}
                style={{ marginTop: '10px' }}
                className="errorAlert"
              >
                Incorrect Email or Password Combination
              </Alert>
            )}
            <Grid item className="spacing">
              <Button
                fullWidth
                className={'button'}
                variant="text"
                type="submit"
              >
                Login
              </Button>
            </Grid>
            <Grid item className="spacing">
              <Button
                fullWidth
                className={'button'}
                variant="text"
                type="button"
                onClick={() => history.push('/register')}
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </div>
  );
};

export default LoginComponent;
