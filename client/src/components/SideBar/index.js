import React, {useEffect} from 'react';
import axios from 'axios';
import {Navigate} from "react-router-dom";
import {useState} from 'react';
import {connect} from 'react-redux';
import {login} from '../../actions/auth';
import styles from './login.module.css';

const SideBar = (props) => {
    const [isDisplayed, setIsDisplayed] = useState(false);

    return (
        <div>

        </div>
    );
}

export default SideBar;