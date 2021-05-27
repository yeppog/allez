import './TopNavComponent.scss';

import { Button, Switch, Toolbar } from '@material-ui/core';
import { Menu, Search } from '@material-ui/icons';

import { AppBar } from '@material-ui/core';
import EventEmitter from 'events';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { logoutUser } from './../Redux/userSlice';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

const TopNavComponent: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //TODO: Handle theme change and checked
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
            Allez
          </Typography>
          <Switch checked={true} color="default" onChange={handleChange} />
          <Button type="button" onClick={logoutHandler}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TopNavComponent;
