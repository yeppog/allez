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
import { useEffect, useState } from 'react';

import { LoginCredentials } from '../../../interface/Credentials';
import React from 'react';
import { useDispatch } from 'react-redux';
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

  useEffect(() => {
    dispatch(checkLoggedInUser());
  }, []);

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
    if (credentials.email && credentials.password) {
      const email = credentials.email;
      const password = credentials.password;
      const credential = { email, password } as LoginCredentials;
      dispatch(loginUser(credential));
      console.log('Request dispatched to server');
    } else {
      console.log('Form is invalid');
    }
  };

  return (
    <div className="LoginComponent" data-testid="LoginComponent">
      <Card className="loginForm" variant="outlined">
        <h2>Login</h2>
        <form onSubmit={(e) => onSubmit(e)}>
          <Grid>
            <Grid item>
              <FormControl fullWidth variant="filled">
                <InputLabel>Username / Email</InputLabel>
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
                <InputLabel>Password</InputLabel>
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
            <Grid item className="loginButton">
              <Button
                fullWidth
                className="loginButton"
                variant="text"
                color="default"
                type="submit"
              >
                Login
              </Button>
            </Grid>
            <Grid item className="registerButton">
              <Button
                fullWidth
                className="registerButton"
                variant="text"
                color="default"
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
