import './NotFoundComponent.scss';

import React, { useEffect } from 'react';

import Image from './../../../static/404.png';
import { useHistory } from 'react-router';

const NotFoundComponent: React.FC = () => {
  const history = useHistory();
  useEffect(() => {
    setTimeout(() => history.push('/login'), 3000);
  }, [history]);

  return (
    <div className="NotFoundComponent" data-testid="NotFoundComponent">
      <img src={Image} className="errorImage" alt="Error Graphic" />
      <h1>Well thats clearly not the right beta there.</h1>
      <h3>Looks like you hit a dead end.</h3>
      <p>
        Perhaps entered the incorrect link? No problem, you'll be redirected
        back to the login page shortly. If not, click{' '}
        <a href="#" onClick={() => history.push('/login')}>
          here
        </a>{' '}
        to head back.
      </p>
    </div>
  );
};

export default NotFoundComponent;
