import './App.scss';

import {
  BrowserRouter,
  NavLink,
  Redirect,
  Route,
  Switch,
  useLocation,
  withRouter,
} from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, { PropsWithChildren } from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import BotNavComponent from './components/BotNavComponent/BotNavComponent';
import ConfirmComponent from './components/Auth/ConfirmComponent/ConfirmComponent';
import { CssBaseline } from '@material-ui/core';
import HomeComponent from './components/HomeComponent/HomeComponent';
import LoginComponent from './components/Auth/LoginComponent/LoginComponent';
import NotFoundComponent from './components/Auth/NotFoundComponent/NotFoundComponent';
import ProfileComponent from './components/ProfileComponent/ProfileComponent';
import ProfileSettingsComponent from './components/ProfileSettingsComponent/ProfileSettingsComponent';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import RegisterComponent from './components/Auth/RegisterComponent/RegisterComponent';
import ResetComponent from './components/Auth/ResetComponent/ResetComponent';
import ResetRequestComponent from './components/Auth/ResetRequestComponent/ResetRequestComponent';
import TopNavComponent from './components/TopNavComponent/TopNavComponent';
import { blueGrey } from '@material-ui/core/colors';
import { getStatus } from './components/Redux/userSlice';
import { useSelector } from 'react-redux';

function App() {
  const darkMode = useSelector(
    (state: { user: { darkMode: boolean } }) => state.user.darkMode
  );
  const theme = createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: blueGrey,
    },
    typography: {
      button: {
        textTransform: 'none',
      },
    },
    overrides: {
      MuiInputBase: {
        input: {
          '&:-webkit-autofill': {
            transitionDelay: '999999s',
            // transitionProperty: 'background-color, color',
          },
        },
      },
    },
  });
  console.log(darkMode);
  const refNode = React.useRef(null);
  const routes = [
    { path: '/login', name: 'Login', Component: LoginComponent },
    { path: '/register', name: 'Register', Component: RegisterComponent },
    {
      path: '/reset',
      name: 'Request Password Reset',
      Component: ResetRequestComponent,
    },
    {
      path: '/reset/token=:token',
      name: 'Reset Password',
      Component: ResetComponent,
    },
    {
      path: '/confirm/token=:token',
      name: 'Confirm',
      Component: ConfirmComponent,
    },
    { path: '/home', name: 'Home', Component: HomeComponent },
    // {
    //   path: '/profile/:id',
    //   name: 'Profile',
    //   Component: ProfileComponent,
    // },
    {
      path: '/edit/profile',
      name: 'Profile Edit',
      Component: ProfileSettingsComponent,
    },
  ];

  /**
   * Experimental CSS Transition with React Router
   * Extremely buggy at the moment, needs to be debugged.
   */
  // const AnimatedSwitch = withRouter(({ location }) => (
  //   <div style={{ position: 'relative' }}>
  //     <TransitionGroup>
  //       <CSSTransition
  //         key={location.key}
  //         classNames="pages"
  //         timeout={1000}
  //         refNode={refNode}
  //         unmountOnExit
  //       >
  //         <Switch location={location}>
  //           {routes.map((route: { path: string; Component: React.FC }) => (
  //             <Route key={route.path} exact path={route.path}>
  //               <div
  //                 ref={refNode}
  //                 style={{ position: 'absolute' }}
  //                 className="pages"
  //               >
  //                 <route.Component />
  //               </div>
  //             </Route>
  //           ))}

  //           <Redirect exact from="/" to="/home" />

  //           <Route path="/home">
  //             <ProtectedRoute
  //               exact
  //               component={HomeComponent}
  //               path="/home"
  //               authenticationPath="login"
  //             />
  //           </Route>

  //           <Route path="*" component={NotFoundComponent} />
  //         </Switch>
  //       </CSSTransition>
  //     </TransitionGroup>
  //   </div>
  // ));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={'App '}>
        <TopNavComponent />
        <Switch>
          <ProtectedRoute
            exact
            component={HomeComponent}
            path="/home"
            authenticationPath="/login"
          />
          <Route path="/profile/:id">
            <ProtectedRoute
              exact
              component={ProfileComponent}
              path="/profile/:id"
              authenticationPath="login"
            />
          </Route>
          <Route path="/confirm/token=:token" component={ConfirmComponent} />
          {routes.map((route: { path: string; Component: React.FC }) => (
            <Route key={route.path} exact path={route.path}>
              <route.Component />
            </Route>
          ))}
          <Redirect exact from="/" to="/home" />
          <Route path="*" component={NotFoundComponent} />
        </Switch>
        {/* <AnimatedSwitch /> */}
        <footer className="footer">
          <BotNavComponent />
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
