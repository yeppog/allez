import './App.scss';

import { Redirect, Route, Switch } from 'react-router-dom';

import BotNavComponent from './components/BotNavComponent/BotNavComponent';
import ConfirmComponent from './components/Auth/ConfirmComponent/ConfirmComponent';
import HomeComponent from './components/HomeComponent/HomeComponent';
import LoginComponent from './components/Auth/LoginComponent/LoginComponent';
import NotFoundComponent from './components/Auth/NotFoundComponent/NotFoundComponent';
import ProfileComponent from './components/ProfileComponent/ProfileComponent';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import RegisterComponent from './components/Auth/RegisterComponent/RegisterComponent';
import ResetComponent from './components/Auth/ResetComponent/ResetComponent';
import ResetRequestComponent from './components/Auth/ResetRequestComponent/ResetRequestComponent';
import TopNavComponent from './components/TopNavComponent/TopNavComponent';
import { getStatus } from './components/Redux/userSlice';
import { useSelector } from 'react-redux';

function App() {
  return (
    <div className={'App '}>
      <TopNavComponent />
      <Switch>
        <Route path="/confirm/token=:token" component={ConfirmComponent} />
        <Route path="/login" component={LoginComponent} />
        <Route path="/register" component={RegisterComponent} />
        <Route path="/reset/token=:token" component={ResetComponent} />
        <Route path="/resetrequest" component={ResetRequestComponent} />
        <Route path="/profile" component={ProfileComponent} />
        <Redirect exact from="/" to="/home" />
        <ProtectedRoute
          exact
          component={HomeComponent}
          path="/home"
          authenticationPath="/login"
        />
        <Route path="*" component={NotFoundComponent} />
      </Switch>
      <footer className="footer">
        <BotNavComponent />
      </footer>
    </div>
  );
}

export default App;
