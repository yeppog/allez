import './TopNavComponent.scss';

import { Menu, Search } from '@material-ui/icons';
import { Switch, Toolbar } from '@material-ui/core';

import { AppBar } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Props } from '../../interface/Props';
import React from 'react';
import Typography from '@material-ui/core/Typography';

const TopNavComponent: React.FC<Props> = (props) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setLightTheme(!props.lightTheme);
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
          <Switch
            checked={props.lightTheme}
            color="default"
            onChange={handleChange}
          />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TopNavComponent;
