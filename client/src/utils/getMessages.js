import React from 'react';
import axios from 'axios';
async function getMessages(conversationID) {
    const data = await axios.get(`${process.env.REACT_APP_PUBLIC_URL}/messenger/getMessages/${conversationID}`)
    .then(function (response) {
        return response.data;
    })
    .catch(function (err) {
        console.log(err.message);
    })
    return data;
}

export default getMessages;