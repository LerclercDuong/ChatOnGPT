import React from 'react';
import axios from 'axios';
async function sendInvitation(info) {
    const data = await axios.post(`${process.env.REACT_APP_PUBLIC_URL}/messenger/sendInvitation`, info)
    .then(function (response) {
        return response.data;
    })
    return data;
}

export default sendInvitation;