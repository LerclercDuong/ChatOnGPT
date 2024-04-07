import { api } from '../api/api';
const UpdateUser = (id, data) => {
    api.post(`/user/update/${id}`, data)
        .then((res)=>{
            return res.data;
        })
        .catch((err)=>{
            return err
        })
}
const GetUserById = (id) => {
    api.get(`/user/get/id/${id}`)
        .then((res)=>{
            return res.data.data;
        })
        .catch((err)=>{

        })
}
const GetUsersByUsername = (username) => {
    return api.get(`/user?username=${username}`)
        .then((res)=>{
            return res.data;
        })
        .catch((err)=>{

        })
}

export {
    GetUserById,
    GetUsersByUsername,
    UpdateUser
}