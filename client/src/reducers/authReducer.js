import { LOGIN_SUCCESS } from "../actions/types";

// src/reducers/authReducer.js
const initialState = {
    user: null,
    error: null
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN_SUCCESS:
        console.log('LOGIN SUCCESS')
        return {
          ...state,
          user: action.payload,
          error: null,
        };
      default:
        return state;
    }
  };
  export default authReducer;
  