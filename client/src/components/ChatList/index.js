import { useState, useEffect } from 'react';
import clsx from "clsx";
import React from 'react';
import styles from './interface.module.css';
import axios from 'axios';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatList = () => {
    const [message, setMessage] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [authenticated, setAuthenticated] = useState(localStorage.getItem('authenticated'));

    useEffect(() => {
        // Initialize state or perform other setup here

        // This is equivalent to the constructor logic

        // Your code here...

    }, []); // Empty dependency array to run the effect only once on mount

    const createConversation = () => {
        const information = {
            userName: "eee",
            targetName: "frfr"
        }
        axios.post('http://localhost:8080/messenger/create', information)
            .then(() => {
                // Handle the response if needed
            })
            .catch(() => {
                // Handle errors if needed
            });
    }

    return (
        <div>
            {/* Your JSX goes here */}
        </div>
    );
};

export default ChatList;
