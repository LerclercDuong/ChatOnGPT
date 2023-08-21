import React from 'react';
import axios from 'axios';
async function getInvitation(username) {
    const data = await axios.get(`${process.env.REACT_APP_PUBLIC_URL}/messenger/getInvitation/${username}`)
    .then(function (response) {
        console.log(response)
        return response.data;
    })
    return data;
}

export default getInvitation;