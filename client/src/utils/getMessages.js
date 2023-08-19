import React from 'react';
import axios from 'axios';
async function getMessages(conversationID) {
    const data = await axios.get(`http://localhost:8080/messenger/getMessages/${conversationID}`)
    .then(function (response) {
        return response.data;
    })
    .catch(function (err) {
        console.log(err.message);
    })
    return data;
}

export default getMessages;