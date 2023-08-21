import React from 'react';
import axios from 'axios';
async function createConversation(packet){
    const data = await axios.post('http://localhost:8080/messenger/createConversation', packet
    ).then(function(response){
       return response.data;
    })
    return data;
}

export default createConversation;