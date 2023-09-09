import React, { useEffect } from 'react';
import axios from 'axios';
import { Navigate } from "react-router-dom";
import { useState } from 'react';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import styles from './login.module.css';

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform login logic here, such as making an API request
    const information = {
      username,
      password
    };
    // console.log(props.auth);
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
  };

  function handleLogin(e) {
    e.preventDefault();
    props.loginAction(username, password);
  }
  useEffect(() => {
    if(props.authData.user != null){
    setAuthenticated(true)
  }
  },[props.authData])
  
  return authenticated ? (
    <Navigate to="/" replace />
  ) : (
    <div className="modal">
      <form onSubmit={handleLogin} className={styles.login_form}>
        <h2>Login</h2>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
const mapStateToProps = (state) =>{
  return {
    authData: state.auth
  }
}

const mapDispatchToProps = (dispatch) =>{
  return{
    loginAction: (username, password) => dispatch(login(username, password))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
