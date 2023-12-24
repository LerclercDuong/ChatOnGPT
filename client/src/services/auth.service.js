import axios from "axios";

const API_URL = process.env.REACT_APP_PUBLIC_URL;


class AuthService{
    register = (username, email, password) => {
        return axios.post(API_URL + "/auth/signup", {
            username,
            email,
            password,
        });
    };
    login = (username, password) => {
        return axios
            .post(API_URL + "/auth/login", {
                username,
                password,
            })
            .then((response) => {
                if (response.data) {
                    localStorage.setItem("userData", JSON.stringify(response.data.data));
                    localStorage.setItem("tokenId", response.data.data.tokenId);
                }
                return response.data;
            });
    };
    logout = () => {
        localStorage.removeItem("userData");
    };
}




export default new AuthService;