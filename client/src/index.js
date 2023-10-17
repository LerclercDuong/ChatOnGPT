import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import './index.css';
import {Provider} from 'react-redux';
import App from './App';
import store from './store/index.js';
import {GoogleOAuthProvider} from '@react-oauth/google';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    <GoogleOAuthProvider clientId="127584468731-i490h6p39anutta3f53g3o7s8t854tkm.apps.googleusercontent.com">
        <BrowserRouter>
            <Provider store={store}>
                <App/>
            </Provider>
        </BrowserRouter>
    </GoogleOAuthProvider>,
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
