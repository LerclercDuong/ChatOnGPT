import React from 'react';
import axios from 'axios';
import { Navigate } from "react-router-dom";
import { useState } from 'react';
import styles from './signUp.module.css';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [loginMessage, setLoginMessage] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleProfilePictureChange = (event) => {
        setProfilePicture(event.target.value);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Perform login logic here, such as making an API request
        const information = {
            username,
            password,
            email,
            profilePicture
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_PUBLIC_URL}/auth/register`, information);
            setLoginMessage(response.data.message);
        } catch (error) {
            // Handle error if needed
        }

        console.log('Logging in with:', username, password);
    };

    function handleSignUp(e) {
        e.preventDefault();
    }
    return authenticated ? (
        <Navigate to="/login" replace />
    ) : (
        <div className="modal">
            <form onSubmit={handleSubmit} className={styles.login_form}>
                <h2>Register</h2>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                        required
                    />
                </div>
                <div>21
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="Email">Email:</label>
                    <input
                        type="email"
                        id="Email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="profilePicture">ProfilePicture:</label>
                    <input
                        type="text"
                        id="profilePicture"
                        value={profilePicture}
                        onChange={handleProfilePictureChange}
                        required
                    />
                </div>
                <p className="login_message">{loginMessage}</p>
                <button type="submit">Register</button>
            </form>
            <p>Already have account <a href="/login"
      >Login</a></p>
        </div>
    );

}

export default SignUp;
