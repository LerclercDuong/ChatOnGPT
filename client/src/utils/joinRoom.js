import React from 'react';
import axios from 'axios';
async function joinRoom(packet){
    const data = await axios.post(`${process.env.REACT_APP_PUBLIC_URL}/messenger/joinRoom`, packet
    ).then(function(response){
       return response.data;
    })
    return data;
}

export default joinRoom;