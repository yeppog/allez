import './TopNavComponent.scss';

import { Menu, Search } from '@material-ui/icons';

import { AppBar } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import { Toolbar } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const TopNavComponent: React.FC = () => (
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
        <IconButton aria-label="search">
          <Search />
        </IconButton>
      </Toolbar>
    </AppBar>
  </div>
);

export default TopNavComponent;
