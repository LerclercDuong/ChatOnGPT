import React from 'react';
import axios from 'axios';
async function sendInvitation(info) {
    const data = await axios.post('http://localhost:8080/messenger/sendInvitation', info)
    .then(function (response) {
        return response.data;
    })
    return data;
}

export default sendInvitation;