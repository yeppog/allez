import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import store from './components/Redux/store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store = {store}>
      <Router>
        <Route exact path = "/auth">

          </Route>
        <App />
        {/* <Route exact path = "/confirm">
          <ConfirmComponent/>
        </Route> */}
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
