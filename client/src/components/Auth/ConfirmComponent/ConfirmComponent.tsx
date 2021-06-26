import './ConfirmComponent.scss';

import { Card, CircularProgress } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { ConfirmCredentials } from '../../../interface/Credentials';
import axios from 'axios';

interface Token {
  token: string;
}

const ConfirmComponent: React.FC = () => {
  const token = useParams<Token>() as ConfirmCredentials;
  /** State for conditional rendering */
  const [state, setState] = useState<string>('idle');
  const [error, setError] = useState<string>('');
  const history = useHistory();

  // TODO: Better error handler
  useEffect(() => {
    /**
     * Sends a get request to the API server to activate the account
     *
     * @param body Holds the token for the get request
     */
    const confirmUser = async (body: ConfirmCredentials) => {
      await axios
        .get('/api/users/confirm', { headers: { token: body.token } })
        .then((data) => {
          setState('success');
          setTimeout(() => history.push('/login'), 3000);
        })
        .catch((err) => {
          // setTimeout(() => history.push('/login'), 3000);
          setState('error');
          setError(err.message);
        });
    };
    // TODO: Remove setTimeout when finalising build
    setTimeout(() => confirmUser(token), 5000);
  }, [history, token]);

  return (
    <div className="ConfirmComponent" data-testid="ConfirmComponent">
      <Card className="message">
        {state === 'idle' && (
          <div className="messageContent">
            <h3>😎 Confirming your account... 😎</h3>
            <p>Hang on tight! We'll be there in a jiffy!</p>
            <CircularProgress></CircularProgress>
          </div>
        )}
        {state === 'error' && (
          <div className="messageContent">
            <h3>😕 Woah there! 😕</h3>
            <h4>Something went wrong</h4>
            <p>
              There is something wrong with the link provided. Or perhaps you
              might be lost.
            </p>
            <p>
              Here is something useful! <br />
              <em>{error}</em>
            </p>
            <p>
              Find your way back! Click{' '}
              <a
                className="anchorLink"
                role="button"
                onClick={() => history.push('/login')}
              >
                here.
              </a>
            </p>
          </div>
        )}
        {state === 'success' && (
          <div className="messageContent">
            <h3>🎉 Hooray! 🎉</h3>
            <h4>Your account has been activated</h4>
            <p>You will be redirected to the login page shortly</p>
            <p>
              If you're somehow not redirected, click{' '}
              <a href="" onClick={() => history.push('/login')}>
                here.
              </a>
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ConfirmComponent;
