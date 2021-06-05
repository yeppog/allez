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
import { CSSTransition } from 'react-transition-group';
import { LoginCredentials } from '../../../interface/Credentials';
import React from 'react';
import axios from 'axios';
import { debug } from 'console';
import { useHistory } from 'react-router-dom';

interface State {
  id: string;
  password: string;
  showPassword: boolean;
  loginStatus: boolean;
  message: string;
}

const LoginComponent: React.FC = () => {
  const nodeRef = React.useRef(null);
  const [state, setState] = useState<State>({
    id: '',
    password: '',
    showPassword: false,
    loginStatus: false,
    message: '',
  });

  const [message, setMessage] = useState<string>();
  const dispatch = useDispatch();
  const history = useHistory();

  /**
   * Helper to set state for hooks
   */
  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setState({ ...state, [prop]: event.target.value });
    };

  /**
   * Helper to toggle the input type of the pasword field
   */
  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword });
  };

  const handleClose = (): void => {
    setState({ ...state, message: '' });
  };

  useEffect(() => {
    dispatch(checkLoggedInUser());
  }, []);

  const loginStatus = useSelector(
    (s: { user: { status: any } }) => s.user.status
  );

  if (loginStatus === 'succeeded') {
    history.push('/home');
  }

  const HTTPOptions: object = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    let credential;
    const id = state.id;
    const password = state.password;
    // checks if the id is an email or username to post the correct body to the server
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(id).toLowerCase())) {
      credential = { email: id, password };
    } else {
      credential = { username: id, password };
    }
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
        setState({ ...state, message: err.message });
      });
  };

  return (
    <div className="LoginComponent" data-testid="LoginComponent">
      {loginStatus && loginStatus !== 'succeeded' && (
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
                    value={state.id}
                    onChange={handleChange('id')}
                  ></Input>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl fullWidth variant="filled">
                  <InputLabel className="label">Password</InputLabel>
                  <Input
                    fullWidth
                    className="password"
                    type={state.showPassword ? 'text' : 'password'}
                    id="standard-adornment-password"
                    value={state.password}
                    onChange={handleChange('password')}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                        >
                          {state.showPassword ? (
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
              <div className="errorAlert">
                <CSSTransition
                  nodeRef={nodeRef}
                  in={state.message ? true : false}
                  timeout={1000}
                  unmountOnExit
                  classNames="errorAlert"
                >
                  <div ref={nodeRef}>
                    <Alert
                      severity="error"
                      onClose={() => handleClose()}
                      className="errorAlert"
                    >
                      Incorrect Email or Password Combination
                    </Alert>
                  </div>
                </CSSTransition>
              </div>
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
              <Grid container justify="center">
                <Button
                  disableElevation={true}
                  size="small"
                  variant="text"
                  onClick={() => history.push('/reset')}
                  className={'button forgot'}
                >
                  Forgot your password?
                </Button>
              </Grid>
              <Grid container justify="center">
                <p>or</p>
              </Grid>
              <Grid item>
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
      )}
    </div>
  );
};

export default LoginComponent;
