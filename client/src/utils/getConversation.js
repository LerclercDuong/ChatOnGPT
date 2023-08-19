import React from 'react';
import axios from 'axios';
async function getConversation(username) {
    const data = await axios.get(`http://localhost:8080/messenger/findConversation/${username}`)
    .then(function (response) {
        console.log(response)
        return response.data;
    })
    return data;
}

export default getConversation;