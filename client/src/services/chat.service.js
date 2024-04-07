import {api} from '../api/api';

export const CreateNewRoom = (data) => {
    return api.post(`/messenger/rooms/create`, data)
        .then((res) =>{
            return res.data;
        })
        .catch((err) =>{

        })
}

const GetRoomInfo = (roomId) => {
    return api.get(`/messenger/rooms/${roomId}`)
        .then((res) =>{
            return res.data;
        })
        .catch((err) =>{

        })
}
const GetRoomListOfUser = (userId) => {
    return api.get(`/messenger/users/${userId}/rooms`)
        .then((res) =>{
            return res.data;
        })
        .catch((err) =>{

        })
}

const GetMessageListInRoom = (roomId) => {
    return api.get(`/messenger/rooms/${roomId}/messages`)
        .then((res) =>{
            return res.data;
        })
        .catch((err) =>{

        })
}
const SendInvitation = (roomId, from, to) => {
    return api.get(`/messenger/rooms/${roomId}/messages`)
        .then((res) =>{
            return res.data;
        })
        .catch((err) =>{

        })
}
const GetInvitationList = (userId) => {
    return api.get(`/user/${userId}/invitation-list`)
        .then((res) =>{
            return res.data;
        })
        .catch((err) =>{

        })
}
const AcceptInvitation = (inviteId) => {
    return api.put(`/messenger/invite/${inviteId}/accept`)
        .then((res) =>{
            return res.data;
        })
        .catch((err) =>{

        })
}
const GetInvitationById = (inviteId) => {
    return api.get(`/messenger/invite/${inviteId}`)
        .then((res) =>{
            return res.data;
        })
        .catch((err) =>{

        })
}
export {
    GetMessageListInRoom,
    GetRoomInfo,
    GetRoomListOfUser,
    SendInvitation,
    GetInvitationList,
    AcceptInvitation,
    GetInvitationById
}