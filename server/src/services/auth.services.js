const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const users = require('../models/users');
const userService = require('../services/user.services.js');

class AuthService {

    //generate jwt token
    //params: data (user data)
    async generateToken(data) {
        const token = jwt.sign({
            data: data.username,
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // token with expire after 1 hour
        }, 'shhhhh');
        return token;
    }

    //decrypt jwt token and get user data
    async verifyToken(tokenID) {
        const data = jwt.verify(tokenID, 'shhhhh');
        return data;
    }

    async expireToken(tokenID) {

    }
    //login function
    async login(username, password) {
        try {
            // Check if the user exists and get user data
            const userData = await userService.find({username});
            // If the user exists, check the password
            if (userData && await this.checkPassword(username, password)) {
                // Generate a new token
                const newTokenId = jwt.sign({
                    data: userData.username,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60) // Token will expire after 1 hour
                }, 'shhhhh');
                // Update the user's token ID in the database
                await users.updateOne({ username: userData.username }, { $set: { tokenId: newTokenId } });
                // Find and return the user by username
                return await userService.find({ username });
            } else {
                throw new Error("Wrong username or password");
            }
        } catch (error) {
            throw error; // Re-throw the error for higher-level error handling
        }
    }


    async logOut(username, password) {

    }

    async checkPassword(username, password) {
        var password_correct = false;
        const hash_password = await users.findOne({ username: username })
            .then((user) => {
                if (user) {
                    return user.password;
                } else {
                    return ' ';
                }
            })
        await bcrypt.compare(password, hash_password)
            .then(function (result) {
                if (result == true) {
                    password_correct = true;
                }
            });
        return password_correct;
    }
}

module.exports = new AuthService;