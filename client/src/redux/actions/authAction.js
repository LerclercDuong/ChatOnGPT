import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_MESSAGE,
    LOGIN,
    REGISTER
} from "../types";

import {LoginWithUsernameAndPassword, SignUp} from '../../services/auth.service'

const LoginSuccess = (information) => (dispatch) => {
    dispatch({
        type: LOGIN_SUCCESS,
        payload: {
            ...information
        },
    });
};
const LogoutAction = (information) => (dispatch) => {
    dispatch({
        type: LOGOUT,
        payload: {
            ...information
        },
    });
};
export {LoginSuccess, LogoutAction};