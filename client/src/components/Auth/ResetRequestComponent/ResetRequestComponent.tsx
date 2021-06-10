import './ResetRequestComponent.scss';

import {
  Button,
  Card,
  Fade,
  FormControl,
  Grid,
  Input,
  InputLabel,
} from '@material-ui/core';
import React, { useState } from 'react';

import { Alert } from '@material-ui/lab';
import { CSSTransition } from 'react-transition-group';
import { ResetRequestCredentials } from '../../../interface/Credentials';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

interface State {
  email: string;
  postSuccess: boolean;
  message: string;
}

const ResetRequestComponent: React.FC = () => {
  const nodeRef = React.useRef(null);
  const history = useHistory();
  const [confirm, setConfirm] = useState<string>('');
  const [state, setState] = useState({
    email: '',
    postSuccess: false,
    message: '',
  });

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setState({ ...state, [prop]: event.target.value });
    };

  const HTTPOptions: object = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const reset = (credentials: ResetRequestCredentials): void => {
    const url = '/api/users/reset';
    axios
      .post(url, credentials, HTTPOptions)
      .then((data) => {
        /**
         * Might not need depending on the API
         */
        console.log(data);
        setConfirm(data.data.token);
        setState({ ...state, postSuccess: true });
      })
      .catch((err) => {
        setState({ ...state, message: err.message });
      });
  };

  const handleClose = (): void => {
    setState({ ...state, message: '' });
  };

  const validator = (form: State): boolean => {
    if (form.email) {
      const email = form.email;
      // regex email checker
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
    return false;
  };

  const onSubmit = (e: any): void => {
    // preventDefault prevents the page from refreshing when the form is submitted
    e.preventDefault();
    if (validator(state)) {
      const email = state.email;
      const credential = { email } as ResetRequestCredentials;
      reset(credential);
    } else {
      console.log('Form is invalid or passwords do not match');
    }
  };

  return (
    <div className="ResetRequestComponent" data-testid="ResetRequestComponent">
      <Grid container justify="center" alignItems="center" direction="row">
        <Grid item xs={10} sm={8} md={4} lg={4}>
          <Card className="form" variant="outlined">
            {state.postSuccess ? (
              <div className="successBox">
                <Grid item sm={12}>
                  <h2>Thank you for your request</h2>
                  <p>
                    Please check your email account for a link to reset your
                    password
                  </p>
                  <Button onClick={() => history.push('/login')}>
                    Login Page
                  </Button>
                  {/* //TODO: Remove this section once SMTP is working */}
                  <p>
                    Well since SMTP isn't working 🤷, click{' '}
                    <a
                      href=""
                      onClick={() => history.push(`reset/token=${confirm}`)}
                    >
                      here
                    </a>{' '}
                    to reset your password.
                  </p>
                </Grid>
              </div>
            ) : (
              <div>
                <h2>Forgot your password?</h2>
                <form onSubmit={(e) => onSubmit(e)}>
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
                          Invalid email
                        </Alert>
                      </div>
                    </CSSTransition>
                  </div>

                  <Grid item>
                    <Button
                      fullWidth
                      className="button"
                      variant="text"
                      color="default"
                      type="submit"
                    >
                      Confirm
                    </Button>
                  </Grid>
                </form>
              </div>
            )}
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ResetRequestComponent;
