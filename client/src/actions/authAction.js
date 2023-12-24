import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_MESSAGE,
    LOGIN,
    REGISTER
} from "./types";

import AuthService from "../services/auth.service.js";

export const login = (information) => (dispatch) => {
    const { username, password } = information;

    return AuthService.login(username, password)
        .then((loginData) => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: {
                    loginData,
                },
            });
        })
        .catch((error) => {
            // Handle errors here
            console.error('Login failed:', error);
            // Optionally dispatch an error action or throw the error
        });
};
export default login;