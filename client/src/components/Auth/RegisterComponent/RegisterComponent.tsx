import './RegisterComponent.scss';

import {
  Button,
  Card,
  FormControl,
  Grid,
  Input,
  InputLabel,
} from '@material-ui/core';

import { Alert } from '@material-ui/lab';
import { CSSTransition } from 'react-transition-group';
import React from 'react';
import { RegisterCredentials } from '../../../interface/Credentials';
import axios from 'axios';
import { useHistory } from 'react-router';
import { useState } from 'react';

interface State {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  postSuccess: boolean;
  message: string;
}

const RegisterComponent: React.FC = () => {
  const nodeRef = React.useRef(null);
  const history = useHistory();
  // temporary workaround as SMTP is not set up
  const [confirm, setConfirm] = useState<string>('');
  const [state, setState] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    postSuccess: false,
    message: '',
  });

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setState({ ...state, [prop]: event.target.value });
    };

  /**
   * Passes the state the user has entered to the redux handler to log the user in.
   *
   * @param e Event that is passed in when the form is submitted
   */
  const onSubmit = (e: any): void => {
    // preventDefault prevents the page from refreshing when the form is submitted
    e.preventDefault();
    // simple validator for now
    // TODO: Better validation for email and password
    if (validator(state)) {
      const username = state.username;
      const name = state.name;
      const email = state.email;
      const password = state.password;
      const credential = {
        name,
        username,
        email,
        password,
      } as RegisterCredentials;
      registerLogin(credential);
    }
  };

  const registerLogin = (credentials: RegisterCredentials): void => {
    const url = '/api/users/register';
    axios
      .post(url, credentials, HTTPOptions)
      .then((data) => {
        setConfirm(data.data.token);
        setState({ ...state, postSuccess: true });
      })
      .catch((err) => {
        setState({ ...state, message: err.message });
      });
  };

  const validator = (form: State): boolean => {
    if (form.name && form.email && form.username) {
      if (form.password === form.confirmPassword) {
        const email = form.email;
        // regex email checker
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(String(email).toLowerCase())) {
          return true;
        } else {
          setState({ ...state, message: 'Email is not valid' });
        }
      } else {
        setState({ ...state, message: 'Passwords do not match' });
      }
    } else {
      setState({
        ...state,
        message: 'Form is invalid. All fields are required',
      });
    }
    return false;
  };

  const HTTPOptions = {
    headers: { 'Content-Type': 'application/json' },
  };

  return (
    <div className="RegisterComponent" data-testid="RegisterComponent">
      {/* <Grid container>
        <Grid item xs={12}> */}
      <Card className="form" variant="outlined">
        {state.postSuccess ? (
          <div className="successBox">
            <Grid item sm={12}>
              <h2>Thank you for registering</h2>
              <p>
                Please check your email account for a verification mail we just
                sent to activate your account
              </p>
              <Button onClick={() => history.push('/login')}>Login Page</Button>
              {/* //TODO: Remove this section once SMTP is working */}
              <p>
                Well since SMTP isn't working 🤷, click{' '}
                <a
                  href=""
                  onClick={() => history.push(`confirm/token=${confirm}`)}
                >
                  here
                </a>{' '}
                to confirm your account.
              </p>
            </Grid>
          </div>
        ) : (
          <div>
            <h2>Register</h2>
            <form onSubmit={(e) => onSubmit(e)}>
              <Grid item sm={12}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Full Name</InputLabel>
                  <Input
                    fullWidth
                    className="name"
                    type="text"
                    value={state.name}
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
                    value={state.username}
                    onChange={handleChange('username')}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Email</InputLabel>
                  <Input
                    fullWidth
                    className="email"
                    type="email"
                    value={state.email}
                    onChange={handleChange('email')}
                    required
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
                    value={state.password}
                    onChange={handleChange('password')}
                    required
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
                    value={state.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    required
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
                      onClose={() => setState({ ...state, message: '' })}
                    >
                      {state.message}
                    </Alert>
                  </div>
                </CSSTransition>
              </div>

              <Grid item className="button">
                <Button
                  fullWidth
                  className="registerButton"
                  variant="text"
                  color="default"
                  type="submit"
                >
                  Register
                </Button>
              </Grid>
            </form>
          </div>
        )}
      </Card>
      {/* </Grid>
      </Grid> */}

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
