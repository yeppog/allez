import './TopNavComponent.scss';

import { Button, Switch, Toolbar } from '@material-ui/core';
import { Menu, Search } from '@material-ui/icons';
import React, { useState } from 'react';
import { logoutUser, toggleDarkMode } from './../Redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';

import { AppBar } from '@material-ui/core';
import EventEmitter from 'events';
import IconButton from '@material-ui/core/IconButton';
import { NavLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router';

const TopNavComponent: React.FC = () => {
  const dispatch = useDispatch();

  const history = useHistory();

  const loginStatus = useSelector(
    (state: { user: { status: any; darkMode: boolean } }) => state.user.status
  );

  const darkMode = useSelector(
    (state: { user: { status: any; darkMode: boolean } }) => state.user.darkMode
  );

  console.log(darkMode);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleDarkMode());
  };

  const logoutHandler = (): void => {
    dispatch(logoutUser());
    history.push('/login');
  };
  return (
    <div className="TopNavComponent" data-testid="TopNavComponent">
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <IconButton
            aria-label="menu"
            onClick={() => console.log('a')}
            style={{ marginRight: '16px' }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <NavLink
              to="/home"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Allez
            </NavLink>
          </Typography>
          <Switch checked={darkMode} color="default" onChange={handleChange} />
          {loginStatus === 'succeeded' && (
            <Button type="button" onClick={logoutHandler}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TopNavComponent;
