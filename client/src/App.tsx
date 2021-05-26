import './App.scss';

import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import BotNavComponent from './components/BotNavComponent/BotNavComponent';
import ConfirmComponent from './components/Auth/ConfirmComponent/ConfirmComponent';
import HomeComponent from './components/HomeComponent/HomeComponent';
import LoginComponent from './components/Auth/LoginComponent/LoginComponent';
import NotFoundComponent from './components/Auth/NotFoundComponent/NotFoundComponent';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import RegisterComponent from './components/Auth/RegisterComponent/RegisterComponent';
import TopNavComponent from './components/TopNavComponent/TopNavComponent';
import { getStatus } from './components/Redux/userSlice';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

function App() {
  /**
   * Theming
   */
  const [lightTheme, setLightTheme] = useState(true);
  const useStyles = lightTheme
    ? makeStyles({
        bars: {
          background: '#819CA9',
          color: 'white',
        },
        main: {
          background: 'white',
          color: 'black',
        },
        dialogs: {
          background: '#EAEAEA',
          color: 'black',
        },
        button: {
          background: '#546E7A',
          color: 'white',
        },
      })
    : makeStyles({
        bars: {
          background: '#102027',
          color: 'white',
        },
        main: {
          background: '#37474f',
          color: 'white',
        },
        dialogs: {
          background: '#29434e',
          color: 'white',
        },
        button: {
          background: '#546E7A',
          color: 'white',
        },
      });
  const classes = useStyles();
  return (
    <div className={'App ' + classes.bars}>
      <TopNavComponent
        classes={classes}
        lightTheme={lightTheme}
        setLightTheme={setLightTheme}
      />
      <Switch>
        <Route path="/confirm/token=:token" component={ConfirmComponent} />
        <Route
          path="/login"
          render={(props) => (
            <LoginComponent
              classes={classes}
              lightTheme={lightTheme}
              setLightTheme={setLightTheme}
            />
          )}
        />
        <Route path="/register" component={RegisterComponent} />
        <Redirect exact from="/" to="/login" />
        <ProtectedRoute
          exact
          component={HomeComponent}
          path="/home"
          authenticationPath="/login"
        />
        <Route path="*" component={NotFoundComponent} />
      </Switch>
      <footer>
        <BotNavComponent />
      </footer>
    </div>
  );
}

export default App;
