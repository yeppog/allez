import './App.scss';

import { Redirect, Route, Switch } from 'react-router-dom';

import ConfirmComponent from './components/Auth/ConfirmComponent/ConfirmComponent';
import LoginComponent from './components/Auth/LoginComponent/LoginComponent';
import NotFoundComponent from './components/Auth/NotFoundComponent/NotFoundComponent';
import React from 'react';
import RegisterComponent from './components/Auth/RegisterComponent/RegisterComponent';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/confirm/token=:token" component={ConfirmComponent} />
        <Route path="/login" component={LoginComponent} />
        <Route path="/register" component={RegisterComponent} />
        <Redirect exact from="/" to="/login" />
        <Route path="*" component={NotFoundComponent} />
      </Switch>
    </div>
  );
}

export default App;
