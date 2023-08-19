import React from 'react';
import axios from 'axios';
async function getUser(username) {
    const data = await axios.get(`http://localhost:8080/messenger/findUser/${username}`)
    .then(function (response) {
        console.log(response)
        return response.data;
    })
    return data;
}

export default getUser;