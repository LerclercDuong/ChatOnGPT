//import
import axios from 'axios';

const API = process.env.REACT_APP_PUBLIC_URL;

//send data (userid , participants ) to server
//create new room.
async function createNewRoom(data, tokenId){
    const result = await axios.post(`${API}/messenger/room/create`, data
    ).then(function(response){
        return response.data;
    })
    return result;
}

async function getRoom(username) {
    const result = await axios.get(`${API}/messenger/room/get/${username}`)
        .then(function (response) {
            return response.data;
        })
    return result;
}
async function getMessages(roomId) {
    const result = await axios.get(`${API}/messenger/get/${roomId}`)
        .then(function (response) {
            return response.data;
        })
        .catch(function (err) {
            console.log(err.message);
        })
    return result;
}

async function getInvite(username) {
    const result = await axios.get(`${API}/messenger/room/invite/get/${username}`)
        .then(function (response) {
            return response.data;
        })
    return result;
}

async function findUser(username) {
    const result = await axios.get(`${API}/messenger/user/find/${username}`)
        .then(function (response) {
            return response.data;
        })
    return result;
}




export default {
    createNewRoom,
    getRoom,
    getMessages,
    getInvite,
    findUser,
}