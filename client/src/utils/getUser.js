import React from 'react';
import axios from 'axios';
async function getUser(username) {
    const data = await axios.get(`${process.env.REACT_APP_PUBLIC_URL}/messenger/findUser/${username}`)
    .then(function (response) {
        console.log(response)
        return response.data;
    })
    return data;
}

export default getUser;