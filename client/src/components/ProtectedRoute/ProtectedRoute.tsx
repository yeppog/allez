import './ProtectedRoute.scss';

import React, { useEffect } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { checkLoggedInUser } from '../Redux/userSlice';

interface ProtectedRouteProps extends RouteProps {
  authenticationPath: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  authenticationPath,
  ...routerProps
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkLoggedInUser());
  }, []);
  const isAuthenticated = useSelector(
    (state: { user: { status: any } }) => state.user.status
  );
  // }
  return (
    <div>
      {isAuthenticated === 'succeeded' ? (
        <Route {...routerProps} />
      ) : isAuthenticated === 'failed' ? (
        <Redirect to="/login" />
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default ProtectedRoute;
