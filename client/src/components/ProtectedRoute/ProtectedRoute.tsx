import './ProtectedRoute.scss';

import React, { useEffect, useState } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';
import { verifyUser } from '../Redux/userSlice';

interface ProtectedRouteProps extends RouteProps {
  authenticationPath: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  authenticationPath,
  ...routerProps
}) => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('/api/users/verify', { headers: { token: token } })
      .then((data) => {
        setLoggedIn(true);
        dispatch(verifyUser(data.data));
      })
      .catch((err) => {
        setLoggedIn(false);
      });
  }, [axios, loggedIn]);
  // }
  return (
    <div>
      {loggedIn == true && <Route {...routerProps} />}
      {loggedIn == false && <Redirect to="/login" />}
      {loggedIn == null && <div></div>}
    </div>
  );
};

export default ProtectedRoute;
