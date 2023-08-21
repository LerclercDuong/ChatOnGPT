import React from 'react';
import axios from 'axios';
async function isAuth(tokenID){
    const data = await axios.post(`${process.env.REACT_APP_PUBLIC_URL}/auth/checkToken`, {}, {
        headers: {
            'Authorization': tokenID,
        }
    }).then(function(response){
       return response.data;
    })
    return data;
}

export default isAuth;