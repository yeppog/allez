import './BotNavComponent.scss';

import { AccountCircle, Home, Search } from '@material-ui/icons';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import React from 'react';
import { useHistory } from 'react-router';

const BotNavComponent: React.FC = () => {
  const history = useHistory();
  const [value, setValue] = React.useState('home');

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="BotNavComponent" data-testid="BotNavComponent">
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
          onClick={() => history.push('/login')}
        />
        <BottomNavigationAction
          label="Profile"
          value="profile"
          icon={<AccountCircle />}
          onClick={() => history.push('/profile')}
        />
        {/* <BottomNavigationAction
          label="Folder"
          value="folder"
          icon={<FolderIcon />}
        /> */}
      </BottomNavigation>
    </div>
  );
};

export default BotNavComponent;
