const bcrypt = require('bcrypt');
const userService = require('../services/user.services.js');
const TokenModel = require('../models/tokens')
const moment = require("moment");
const UserModel = require("../models/users");
const tokenService = require('../services/token.service');
const CheckLogin = require('../utils/checkLogin.js');
const ApiError = require("../utils/ApiError");

class AuthService {

    //signup function
    async SignUp(username, password) {
        try{
            const userExists = await UserModel.findOne({username: username});
            if (userExists) throw new ApiError(203, "User is exist")
            const userData = {
                username: username,
                password: password,
                role: 'user',
            }
            const newUser = new UserModel({...userData});
            return newUser.save().catch();
        }catch(e){
            throw new ApiError(500, e.message)
        }

    }

    //login function
    async LoginWithUsernameAndPassword(username, password) {
        if (await CheckLogin(username, password)) {
            return await userService.GetUserByName(username);
        } else {
            throw new Error("Wrong username or password");
        }
    }

    async GenerateAuthToken(userData){
        const accessTokenId = await tokenService.GenerateToken(userData, 'ACCESS', process.env.ACCESS_SECRET_KEY, process.env.ACCESS_TOKEN_LIFE_HOUR + 'h');
        const refreshTokenId = await tokenService.GenerateToken(userData, 'REFRESH', process.env.REFRESH_SECRET_KEY, process.env.REFRESH_TOKEN_LIFE_DAY + 'd');

        const accessTokenExpires = moment().add(process.env.ACCESS_TOKEN_LIFE_HOUR, 'hours');
        const refreshTokenExpires = moment().add(process.env.REFRESH_TOKEN_LIFE_DAY, 'days');

        await tokenService.SaveTokenToDB(userData._id, refreshTokenId, 'REFRESH', refreshTokenExpires);

        return {
            access: {
                token: accessTokenId,
                exp: accessTokenExpires.toDate()
            },
            refresh: {
                token: refreshTokenId,
                exp: refreshTokenExpires.toDate()
            }
        };
    }

    //Find in database if exist refresh token, generate new access token
    //return new refresh token
    async RefreshAuthToken(refreshToken) {
        try {
            const refreshTokenDoc = await tokenService.VerifyToken(refreshToken, 'REFRESH', process.env.REFRESH_SECRET_KEY);

            const userData = await userService.GetUserById(refreshTokenDoc.user);

            if (!userData) {
                throw new Error();
            }

            await TokenModel.deleteOne({ _id: refreshTokenDoc._id });

            return this.GenerateAuthToken(userData);
        } catch (err) {
            throw err;
        }
    }

    async logOut(username, password) {

    }


}

module.exports = new AuthService;