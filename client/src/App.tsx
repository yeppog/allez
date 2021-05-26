import './App.scss';

import { Redirect, Route, Switch } from 'react-router-dom';

import BotNavComponent from './components/BotNavComponent/BotNavComponent';
import ConfirmComponent from './components/Auth/ConfirmComponent/ConfirmComponent';
import HomeComponent from './components/HomeComponent/HomeComponent';
import LoginComponent from './components/Auth/LoginComponent/LoginComponent';
import NotFoundComponent from './components/Auth/NotFoundComponent/NotFoundComponent';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import React from 'react';
import RegisterComponent from './components/Auth/RegisterComponent/RegisterComponent';
import TopNavComponent from './components/TopNavComponent/TopNavComponent';
import { getStatus } from './components/Redux/userSlice';
import { useSelector } from 'react-redux';

function App() {
  return (
    <div className="App">
      <TopNavComponent />
      <Switch>
        <Route path="/confirm/token=:token" component={ConfirmComponent} />
        <Route path="/login" component={LoginComponent} />
        <Route path="/register" component={RegisterComponent} />
        <Redirect exact from="/" to="/login" />
        <ProtectedRoute
          exact
          path="/home"
          component={HomeComponent}
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
