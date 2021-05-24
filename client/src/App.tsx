import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import './App.scss';
import LoginComponent from './components/Auth/LoginComponent/LoginComponent';
import RegisterComponent from './components/Auth/RegisterComponent/RegisterComponent';
import ConfirmComponent from './components/Auth/ConfirmComponent/ConfirmComponent';


function App() {
  return (
    <div className="App">
      <Switch>
        <Route path = "/confirm/token=:token" component = {ConfirmComponent} />
        <Route path = "/login" component = {LoginComponent} />
        <Route path = "/register" component = {RegisterComponent} />
        <Redirect from="*" to="/login"/>


      </Switch>
    </div>
  );
}

export default App;
