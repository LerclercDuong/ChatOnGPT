'strict-mode'
import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation,} from "react-router-dom";
import React, {useEffect, useState} from "react";
import io from "socket.io-client";
import {useDispatch, useSelector} from "react-redux";
import isAuth from '../src/utils/isAuth';
import {publicRoutes, privateRoutes} from './routes/routes';
import {GetAccessToken, GetRefreshToken, RemoveRefreshToken, SetRefreshToken} from "./utils/tokens";
import {api} from './api/api';
import {LoginSuccess} from './redux/actions/authAction'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function App() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [isLoading, setIsLoading] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isAuth = async () => {
            try {
                setIsLoading(true);
                const response = await api.patch('/auth/isAuth')
                if (response.data) {
                    dispatch(LoginSuccess(response.data))
                }
            } catch (e) {
            } finally {
                setIsLoading(false);
            }
        };
        isAuth();
    }, []);


    if (isLoading === true) {
        // Render a loading indicator or any other content while checking authentication
        return <div>
            <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        </div>;
    }

    return (

        <div className="App">
            {/*<Chat />*/}
            {isLoading === false && (

                <Routes>
                    <Route>
                        {privateRoutes.map((route, index) => {
                            const Page = route.component;
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        isAuthenticated === true  ? (
                                            <Page />
                                        ) : (
                                            <Navigate to="/login" />
                                        )
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
            )}

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
