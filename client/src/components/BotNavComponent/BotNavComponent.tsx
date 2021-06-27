import './BotNavComponent.scss';

import { AccountCircle, Home, Search } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { User } from '../../interface/Schemas';
import axios from 'axios';
import { useHistory } from 'react-router';
import { verifyUser } from '../Redux/userSlice';

const BotNavComponent: React.FC = () => {
  const history = useHistory();
  const [value, setValue] = useState('home');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };

  const myProfile = useSelector(
    (state: { user: { user: User } }) => state.user.user.username
  );
  const loginStatus = useSelector(
    (state: { user: { loginStatus: string } }) => state.user.loginStatus
  );
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

  return (
    <div className="BotNavComponent" data-testid="BotNavComponent">
      {loginStatus == 'succeeded' && (
        <BottomNavigation value={value} onChange={handleChange} color="primary">
          <BottomNavigationAction
            label="Home"
            value="home"
            icon={<Home />}
            onClick={() => history.push('/home')}
          />
          <BottomNavigationAction
            label="Search"
            value="search"
            icon={<Search />}
            // onClick={() => history.push('/login')}
          />
          <BottomNavigationAction
            label="Profile"
            value="profile"
            icon={<AccountCircle />}
            onClick={() => history.push(`/profile/${myProfile}`)}
          />
          {/* <BottomNavigationAction
          label="Folder"
          value="folder"
          icon={<FolderIcon />}
        /> */}
        </BottomNavigation>
      )}
    </div>
  );
};

export default BotNavComponent;
