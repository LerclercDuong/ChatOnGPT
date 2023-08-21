import React from 'react';
import axios from 'axios';
async function getUser(userID) {
    const data = await axios.get(`http://localhost:8080/messenger/findUserByID/${userID}`)
    .then(function (response) {
        console.log(response)
        return response.data;
    })
    return data;
}

export default getUser;