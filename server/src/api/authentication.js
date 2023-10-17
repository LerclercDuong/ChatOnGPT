const userService = require('../services/user.services.js');
const authService = require('../services/auth.services.js');

class Authentication {

    async signup(req, res, next) {
        const {username, password, email, role, profilePicture} = req.body;
        try {
            //check user exists before adding new user
            const isExist = await userService.isExist(username);
            // sign and store user data to database after check 
            const userData = {
                username: username,
                password: password,
                email: email,
                role: role,
                profilePicture: profilePicture
            }
            // if user is not exist then sign up, otherwise return error status
            if (!isExist) {
                const tokenId = await authService.generateToken(userData)
                const result = await userService.create({...userData, tokenId})
                res.status(200).json({message: 'New user added', data: result});
            } else {
                res.status(203).json({message: 'User already exist'})
            }
        } catch (err) {
            res.status(203).send({message: err});
        }
    }

    async login(req, res, next) {
        const {username, password} = req.body;
        try {
            const result = await authService.login(username, password);
            if (result) {
                res.status(200).json({message: 'Login success', data: result});
            }
        } catch (err) {
            res.status(203).json({message: err.message});
        }
    }

    async loginWithGoogle(req, res, next) {

    }

    async forgotPassword(req, res) {

    }
}

module.exports = new Authentication;