import React, {useEffect} from 'react';
import axios from 'axios';
import {Navigate} from "react-router-dom";
import {useState} from 'react';
import {connect} from 'react-redux';
import {login} from '../../actions/auth';
import { GoogleLogin } from '@react-oauth/google';
import styles from './login.module.css';

const Login = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);

    const responseMessage = (response) => {
        console.log(response);
    };
    const errorMessage = (error) => {
        console.log(error);
    };
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
                console.log(response)
                const token = response.data.data.tokenId;
                setAuthenticated(true);

                localStorage.setItem('tokenId', token);
            }
            setLoginMessage(response.data.message);
            props.handleAuth(true);
        } catch (error) {
            // Handle error if needed
        }
    };
    if (authenticated === true) {
        return <Navigate to={"/"} replace/>
    }
    // async function handleLogin(e) {
    //   e.preventDefault();
    //   await props.loginAction(username, password);
    // }
    //
    // useEffect(() => {
    //   if (props.authData.user != null) {
    //     setAuthenticated(true)
    //   }
    //   console.log(props.authData)
    // }, [props.authData])

    return (
        <div className="modal">
            <form onSubmit={handleSubmit} className={styles.login_form}>
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
            <div style={{width: "20%", margin: "0 auto"}}>
                <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
            </div>



        </div>
    );

}
const mapStateToProps = (state) => {
    return {
        authData: state.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loginAction: (username, password) => dispatch(login(username, password))
    }
}
// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default Login;