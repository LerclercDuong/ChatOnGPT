import React from 'react';
import axios from 'axios';
import { Navigate } from "react-router-dom";
import { useState } from 'react';
import styles from './login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform login logic here, such as making an API request
    const information = {
      username,
      password
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_PUBLIC_URL}/auth/login`, information);
      if (response.data.data) {
        const token = response.data.data.tokenID;
        setAuthenticated(true);
        localStorage.setItem('tokenID', token);
      }
      setLoginMessage(response.data.message);
    } catch (error) {
      // Handle error if needed
    }

    console.log('Logging in with:', username, password);
  };

  function handleSignUp(e){
    e.preventDefault();
  }
  return authenticated ? (
    <Navigate to="/" replace />
  ) : (
    <div className="modal">
      <form onSubmit={handleSubmit} className={styles.login_form}>
        <h2>Login</h2>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <p className="login_message">{loginMessage}</p>
        <button type="submit">Login</button>
      </form>
      <p>Doesn't have account yet <a href="/register" 
      >Sign Up</a></p>
    </div>
  );
  
}

export default Login;
