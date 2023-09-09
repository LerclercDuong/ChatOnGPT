import axios from "axios";
const API_URL = process.env.REACT_APP_PUBLIC_URL;

const register = (username, email, password) => {
    return axios.post(API_URL + "signup", {
        username,
        email,
        password,
    });
};

const login = (username, password) => {
    return axios
        .post(API_URL + "/auth/login", {
            username,
            password,
        })
        .then((response) => {
            if (response.data) {
                console.log(response.data)
                localStorage.setItem("user", JSON.stringify(response.data.data));
                localStorage.setItem("tokenID", response.data.data.tokenID);
            }

            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("user");
};

export default {
    register,
    login,
    logout,
};