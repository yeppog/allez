import React from 'react';
import './RegisterComponent.scss';
import { useState } from 'react'
import axios from 'axios'
import { RegisterCredentials } from '../../../interface/Credentials'

const RegisterComponent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')

  // Redudant code just to display in frontend instead of console.logging , can remove later
  const [message, setMessage] = useState('');

  /**
   * Passes the credentials the user has entered to the redux handler to log the user in.
   * 
   * @param e Event that is passed in when the form is submitted
   */

  const onSubmit = (e: any): void => {
    // preventDefault prevents the page from refreshing when the form is submitted
    e.preventDefault();
    // simple validator for now
    // TODO: Better validation for email and password
    if (username && email && password && (password === confirmPassword)) {
      const credential = { username, email, password } as RegisterCredentials;
      registerLogin(credential);
      console.log(credential);
      setMessage("Valid");
    } else {
      console.log("Form is invalid or passwords do not match");
    }
  }

  const registerLogin = (credentials: RegisterCredentials): void => {
    try {
      console.log(credentials);
      const url = "http://localhost:3001/api/users/register";
      axios.post(url, credentials, HTTPOptions)
        .then(data => console.log(data))
        .catch(err => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }

  const HTTPOptions = {
    headers: { 'Content-Type': 'application/json' }
  }


  return (
    <div className="RegisterComponent" data-testid="RegisterComponent">
      <form action="" className="registerForm" onSubmit={e => onSubmit(e)}>
        <h2>Registration</h2>
        <input
          type="text"
          className="username"
          placeholder="username"
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type="text"
          className="email"
          placeholder="email"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="text"
          className="password"
          placeholder="password"
          onChange={e => setPassword(e.target.value)}
        />

        <input
          type="text"
          className="confirm_password"
          placeholder="Confirm Password"
          onChange={e => setConfirmPassword(e.target.value)}
        />

        <button className="submit" type="submit">Register</button>
        <p>username: {username}</p>
        <p>email: {email}</p>
        <p>password: {password}</p>
        <p>confirm_password: {confirmPassword}</p>

        {message ?
          <p>
            {message}
          </p>
          : <div></div>
        }


      </form>
    </div>
  )
};

export default RegisterComponent;
