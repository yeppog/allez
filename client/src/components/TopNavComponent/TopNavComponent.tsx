import './TopNavComponent.scss';

import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import {
  Avatar,
  Button,
  Grid,
  Switch,
  TextField,
  Toolbar,
} from '@material-ui/core';
import React, { useState } from 'react';
import { logoutUser, toggleDarkMode } from './../Redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';

import { AppBar } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Menu } from '@material-ui/icons';
import { NavLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { User } from '../../interface/Schemas';
import { useHistory } from 'react-router';

const TopNavComponent: React.FC = () => {
  const dispatch = useDispatch();

  const filterOptions = createFilterOptions({
    limit: 5,
    stringify: (option: { username: string; name: string }) => option.username,
  });

  const history = useHistory();

  const [search, setSearch] = useState<string>('');

  const loginStatus = useSelector(
    (state: { user: { status: any; darkMode: boolean } }) => state.user.status
  );

  const user = useSelector(
    (state: { user: { user: User } }) => state.user.user
  );

  const users = useSelector(
    (state: { user: { search: [{ username: string; name: string }] } }) =>
      state.user.search
  );

  const darkMode = useSelector(
    (state: { user: { status: any; darkMode: boolean } }) => state.user.darkMode
  );

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
          <Typography variant="h6">
            <NavLink
              to="/home"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Allez
            </NavLink>
          </Typography>
          <div
            style={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
            }}
            className="desktopNav"
          >
            {loginStatus === 'succeeded' && (
              <Autocomplete
                style={{ width: '70%' }}
                options={users.filter((x) => search.length > 1)}
                filterOptions={filterOptions}
                getOptionLabel={(option) => option.username}
                // autoHighlight
                renderInput={(params) => (
                  // <Input {...params.inputProps} />
                  <TextField
                    {...params}
                    style={{ marginBottom: '15px' }}
                    type="text"
                    label="Search Profile"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(KeyboardEvent) => {
                      if (KeyboardEvent.key === 'Enter') {
                        history.push(`/profile/${search}`);
                      }
                      setSearch('');
                    }}
                  />
                )}
                renderOption={(option) => {
                  return (
                    <Grid
                      container
                      direction="row"
                      onClick={() =>
                        history.push(`/profile/${option.username}`)
                      }
                    >
                      <Grid item>
                        <Avatar
                          style={{
                            width: '30px',
                            height: 'auto',
                            paddingRight: '10px',
                          }}
                          src="http://localhost:3001/api/images/avatar/avatar_de32507b28d512705ba027318fc2cd11.png"
                        />
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          alignItems="flex-start"
                          direction="column"
                        >
                          <Grid item>
                            <Typography variant="subtitle2">
                              {option.username}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="caption">
                              {option.name}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                }}
              />
            )}
          </div>
          <Switch checked={darkMode} color="default" onChange={handleChange} />
          {loginStatus === 'succeeded' && (
            <div className="navProfile">
              <IconButton
                onClick={() => history.push(`/profile/${user.username}`)}
              >
                <Avatar src={user.avatarPath} />
              </IconButton>
              <Button type="button" onClick={logoutHandler}>
                Logout
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TopNavComponent;
