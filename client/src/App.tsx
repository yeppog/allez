import React from 'react';
import logo from './logo.svg';
import './App.scss';
import LoginComponent from './components/Auth/LoginComponent/LoginComponent';
import RegisterComponent from './components/Auth/RegisterComponent/RegisterComponent';


function App() {
  return (
    <div className="App">
        <LoginComponent>

        </LoginComponent>
        <RegisterComponent/>
    </div>
  );
}

export default App;
