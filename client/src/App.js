'strict-mode'
import logo from './logo.svg';
import './App.css';
import ChatInterface from './components/ChatInterface';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import io from "socket.io-client";

function App() {
  const socket = io(`${process.env.REACT_APP_PUBLIC_URL}`);
  return (
    <div className="App">
      <Routes>
      <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ChatInterface socket={socket}/>} />
      </Routes>
    </div>

  );
}

export default App;
