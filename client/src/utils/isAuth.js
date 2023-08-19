import React from 'react';
import axios from 'axios';
async function isAuth(tokenID){
    const data = await axios.post('http://localhost:8080/auth/checkToken', {}, {
        headers: {
            'Authorization': tokenID,
        }
    }).then(function(response){
       return response.data;
    })
    return data;
}

export default isAuth;