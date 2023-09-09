import React from 'react';
import axios from 'axios';
async function getUser(userID) {
    const data = await axios.get(`${process.env.REACT_APP_PUBLIC_URL}/messenger/findUserByID/${userID}`)
    .then(function (response) {
        return response.data;
    })
    return data;
}

export default getUser;