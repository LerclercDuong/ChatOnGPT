'strict-mode'
import logo from './logo.svg';
import './App.css';
import ChatInterface from './components/ChatInterface';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Chat from './pages/Chat';
import UserSetting from './components/UserSetting';
import {BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import io from "socket.io-client";
import {useDispatch, useSelector} from "react-redux";
import isAuth from '../src/utils/isAuth';
import {publicRoutes, privateRoutes} from './routes/routes';
import {GetAccessToken, GetRefreshToken, RemoveRefreshToken, SetRefreshToken} from "./utils/tokens";
import {api} from './api/api';
import {LoginSuccess} from './redux/actions/authAction'



function App() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [isLoading, setIsLoading] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const isAuth = async () => {
            try{
                setIsLoading(true);
                const response = await api.patch('/auth/isAuth')
                if (response.data) {
                    dispatch(LoginSuccess(response.data))
                }
            }catch (e) {
            }
            finally {
                setIsLoading(false);
            }
        };
        isAuth();
    }, []);

    useEffect(() => {
        console.log(location.pathname)
        if (isLoading === false && location.pathname === '/' && isAuthenticated !== true) {
            // If user is authenticated, redirect to the home page
            navigate('/introduction');
        }
        // if (!isLoading && location.pathname === '/' && isAuthenticated === true) {
        //     // If user is authenticated, redirect to the home page
        //     navigate('/');
        // }
        // if (!isLoading && location.pathname === '/login') {
        //     // If user is authenticated, redirect to the home page
        //     navigate('/login');
        // }
        // if (!isLoading && location.pathname === '/introduction') {
        //     // If user is authenticated, redirect to the home page
        //     navigate('/introduction');
        // }
        // if (!isLoading && location.pathname === '/profile/user-info') {
        //     // If not authenticated and not loading, and not on the user-setting page, redirect to user-setting
        //     navigate('/profile/user-info');
        // }
        },[isAuthenticated, isLoading]);

    if (isLoading === true) {
        // Render a loading indicator or any other content while checking authentication
        return <div>
            <p>Loading...</p>
            <h1>Chờ xíu mạng lag quá...</h1>
        </div>;
    }

    return (
        <div className="App">
            {/*<Chat />*/}
            <Routes>
                <Route>
                    {privateRoutes.map((route, index) => {
                        const Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Page/>
                                }
                            />
                        )
                    })}
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={<Page/>}
                            />
                        )
                    })}
                </Route>
            </Routes>
        </div>
        // <div className="App">
        //     <Routes>
        //         <Route path="/register" element={<SignUp/>}/>
        //         <Route path="/login" element={<Login handleAuth={getAuthState}/>}/>
        //         {isLoggedIn ? (
        //             <>
        //                 <Route path="/user/setting" element={<Profile/>}/>
        //                 <Route path="/" element={<Chat socket={socket} onlineState={userOnline}/>}/>
        //                 {/*<Route path="/login" element={<Navigate to="/" replace/>}/>*/}
        //             </>
        //         ) : <Route path="/*" element={<Navigate to="/login" replace/>}/>}
        //     </Routes>
        // </div>

    );
}

export default App;
