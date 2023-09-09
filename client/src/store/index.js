// src/store/index.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; // Import Redux Thunk
import authReducer from '../reducers/authReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  // ...other reducers
});

const store = createStore(rootReducer, applyMiddleware(thunk)); // Apply Redux Thunk

export default store;
