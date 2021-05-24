import React from 'react';
import './LoginComponent.scss';
import { useState, useEffect } from 'react'
import { LoginCredentials } from '../../../interface/Credentials';
import { checkLoggedInUser, loginUser } from '../../Redux/userSlice';
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom';

const LoginComponent: React.FC = () => {

  const [ username, setUsername ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  // Redudant code just to display in frontend instead of console.logging , can remove later
  const [ message, setMessage ] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(checkLoggedInUser());
  }, [])


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
    if (username && email && password) {
      const credential = { username, email, password } as LoginCredentials;
      dispatch(loginUser(credential));
      console.log(credential);
      setMessage("Valid");
    } else {
      console.log("Form is invalid");
    } 
  }

  // const handleLogin = (credentials: LoginCredentials): void => {
  //   try {
  //     const url = "http://localhost:3001/api/users/login";
  //     axios.post(url, credentials, HTTPOptions)
  //       .then(data => console.log(data))
  //       .catch(err => console.log(err));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }



  return (
    <div className="LoginComponent" data-testid="LoginComponent">
      <form action="" className="loginForm" onSubmit={e => onSubmit(e)}>
        <h2>Login</h2>
        <input 
          type="text" 
          className="username" 
          placeholder= "username" 
          onChange={e => setUsername(e.target.value)}
        />

        <input 
          type="text" 
          className="email"
          placeholder = "email"
          onChange={e => setEmail(e.target.value)}
        />
        <input 
          type="text" 
          className="password" 
          placeholder = "password"
          onChange={e => setPassword(e.target.value)}
        />

        <button className="submit" type="submit">Submit</button>
        <button className="register" type="button" onClick={() => history.push('/register')}>Register for an account</button> 

        <p>username: {username}</p>
        <p>email: {email}</p>
        <p>password: {password}</p>
        
        {message ? 
          <p>
            {message}
          </p>
        :<div></div>
        }


      </form>
    </div>
  )
};

export default LoginComponent;
