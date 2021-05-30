import './ResetComponent.scss';

import {
  Button,
  Card,
  CircularProgress,
  Fade,
  FormControl,
  Grid,
  Input,
  InputLabel,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Alert } from '@material-ui/lab';
import { ResetCredentials } from '../../../interface/Credentials';
import axios from 'axios';

interface Token {
  token: string;
}

interface State {
  token: string;
  password: string;
  confirmPassword: string;
  postState: string;
  message: string;
}

const ResetComponent: React.FC = () => {
  const history = useHistory();
  const token = useParams<Token>();
  const [state, setState] = useState({
    token: token.token,
    password: '',
    confirmPassword: '',
    postState: '',
    message: '',
  });

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setState({ ...state, [prop]: event.target.value });
    };

  const onSubmit = (e: any): void => {
    // preventDefault prevents the page from refreshing when the form is submitted
    e.preventDefault();
    // simple validator for now
    // TODO: Better validation for email and password
    if (validator(state)) {
      const token = state.token;
      const password = state.password;
      const credential = { token, password } as ResetCredentials;
      reset(credential);
    } else {
      console.log('Form is invalid or passwords do not match');
    }
  };

  const reset = (credentials: ResetCredentials): void => {
    setState({ ...state, postState: 'idle' });
    try {
      const url = '/api/users/reset/end';
      axios
        .post(url, credentials, HTTPOptions)
        .then((data) => {
          console.log(data);
          setState({ ...state, postState: 'success' });
        })
        .catch((err) => {
          setState({ ...state, postState: 'error', message: err.message });
        });
      setTimeout(() => history.push('/login'), 3000);
    } catch (err) {
      setState({ ...state, postState: 'error', message: err.message });
    }
  };

  const validator = (form: State): boolean => {
    return form.password === form.confirmPassword;
  };

  const HTTPOptions = {
    headers: { 'Content-Type': 'application/json' },
  };

  return (
    <div className="ResetComponent" data-testid="ResetComponent">
      <Grid container alignItems="center" justify="center">
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Card className="form" variant="outlined">
            {state.postState === 'success' && (
              <div>
                <h3>🎉 Hooray! 🎉</h3>
                <h4>Your password has been reset</h4>
                <p>You will be redirected to the login page shortly</p>
                <p>
                  If you're somehow not redirected, click{' '}
                  <a href="" onClick={() => history.push('/login')}>
                    here.
                  </a>
                </p>
              </div>
            )}
            {state.postState === '' && (
              <div>
                <h2>Password Reset</h2>
                <form onSubmit={(e) => onSubmit(e)}>
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
                  {state.message && (
                    <Fade in={state.message ? true : false}>
                      <div className="errorAlert">
                        <Alert
                          severity="error"
                          onClose={() => setState({ ...state, message: '' })}
                          className="errorAlert"
                        >
                          {state.message}
                        </Alert>
                      </div>
                    </Fade>
                  )}
                  <Grid item className="button">
                    <Button
                      fullWidth
                      className="button"
                      variant="text"
                      color="default"
                      type="submit"
                    >
                      Reset
                    </Button>
                  </Grid>
                </form>
              </div>
            )}
            {state.postState === 'idle' && (
              <div>
                <h3>😎 Loading... 😎</h3>
                <p>Hang on tight! We'll be there in a jiffy!</p>
                <CircularProgress></CircularProgress>
              </div>
            )}
            {state.postState === 'error' && (
              <div>
                <h3>😕 Woah there! 😕</h3>
                <h4>Something went wrong</h4>
                <p>
                  There is something wrong with the link provided. Or perhaps
                  you might be lost.
                </p>
                <p>
                  Here is something useful! <br />
                  <em>{state.message}</em>
                </p>
                <p>
                  Find your way back! Click{' '}
                  <a href="" onClick={() => history.push('/login')}>
                    here.
                  </a>
                </p>
              </div>
            )}
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ResetComponent;
