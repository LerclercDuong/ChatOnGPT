import {api} from '../api/api'
import {GetAccessToken, GetRefreshToken, SetRefreshToken, SetAccessToken} from "../utils/tokens";

const LoginWithUsernameAndPassword = async (username, password) => {
    return api.post(
        '/auth/login',
        {username, password})
        .then((res) => {
            const responseData = res.data;
            if (responseData) {
                SetAccessToken(responseData.tokens.access.token);
                SetRefreshToken(responseData.tokens.refresh.token);
                return responseData;
            }
        })
        .catch((err) => {
            console.log(err)
        })
}
const SignUp = async (username, password, repeatPassword) => {
    return api.post(
        '/auth/signup',
        {username, password, repeatPassword})
        .then((res) => {
            const responseData = res.data;
            if (responseData) {
                SetAccessToken(responseData.tokens.access.token);
                SetRefreshToken(responseData.tokens.refresh.token);
                return responseData;
            }
        })
        .catch((err) => {
            throw err.response.data
        })
}

export {
    SignUp,
    LoginWithUsernameAndPassword
}