'strict-mode'
import logo from './logo.svg';
import './App.css';
import ChatInterface from './components/ChatInterface';
import Login from './components/Login';
import SignUp from './components/SignUp';
import UserSetting from './components/UserSetting';
import {Routes, Route} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, Navigate} from "react-router-dom";
import io from "socket.io-client";
import isAuth from '../src/utils/isAuth';

const socket = io('http://localhost:8080/');

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [userOnline, setUserOnline] = useState(null);
    socket.on("pingOnlineState", (data) => {
        console.log(data)
        setUserOnline(data);
    })

    function getAuthState(data) {
        setIsLoggedIn(data);
    }


    useEffect(() => {
        async function checkAuth() {
            const tokenId = localStorage.getItem('tokenId');
            if (tokenId) {
                const userData = await isAuth(tokenId);
                if (tokenId && userData.data) {
                    setIsLoggedIn(true);
                    localStorage.setItem('userData', JSON.stringify(userData));
                }
            }
            setIsLoading(false); // Set loading state to false when done
        }
        checkAuth();
    }, [])

    if (isLoading) {
        // Render a loading indicator or any other content while checking authentication
        return <div>
            <p>Loading...</p>
            <h1>Chờ xíu mạng lag quá...</h1>
        </div>;
    }

    // if(isLoggedIn === false){
    //     return <Navigate to="/login" replace/>
    // }
    return (
        <div className="App">
            <Routes>
                <Route path="/register" element={<SignUp/>}/>
                <Route path="/login" element={<Login handleAuth={getAuthState}/>}/>
                {isLoggedIn ? (
                    <>
                        <Route path="/user/setting" element={<UserSetting/>}/>
                        <Route path="/" element={<ChatInterface socket={socket} onlineState={userOnline}/>}/>
                        {/*<Route path="/login" element={<Navigate to="/" replace/>}/>*/}
                    </>
                ) : <Route path="/*" element={<Navigate to="/login" replace/>}/>}
            </Routes>
        </div>

    );
}

export default App;
