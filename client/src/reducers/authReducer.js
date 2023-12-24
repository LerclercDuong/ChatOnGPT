import {LOGIN, LOGOUT, REGISTER, LOGIN_SUCCESS} from "../actions/types";
import authService from "../services/auth.service";

// src/reducers/authReducer.js
const initialState = {
    isLoggedIn: null,
    data: null,
    error: null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            const loginData = action.payload.loginData.data;
            try {
                return {
                    ...state,
                    isLoggedIn: true,
                    data: loginData,
                    error: null,
                };
            } catch (error) {
                // Handle error appropriately, you might want to set error in the state
                console.error("Login failed:", error);
                return {
                    ...state,
                    isLoggedIn: false,
                    data: null,
                    error: "Login failed",
                };
            }
        default:
            return state;
    }
};
export default authReducer;
  