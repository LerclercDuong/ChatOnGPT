const userService = require('../services/user.services.js');
const {StatusCodes} = require('http-status-codes');
class User {
    async GetAllUsers(req, res, next) {

    }
    async UpdateUser(req, res, next){
        const { userId } = req.params;
        const updated = await userService.UpdateUser(userId, req.body, req.files);
        if (updated) {
            res.status(StatusCodes.OK).json(updated)
            return;
        }
        res.status(StatusCodes.NO_CONTENT).json({message: 'Update fail'})
    }
    async GetUserById(req, res, next) {
        const { userId } = req.params;
        const userData = await userService.GetUserById(userId);
        if (userData) {
            res.status(StatusCodes.OK).json(userData)
            return;
        }
        res.status(StatusCodes.NO_CONTENT).json({message: 'User not found'})
    }

    async GetUserByUsername(req, res, next) {
        const { username } = req.params;
        const userData = await userService.GetUserByName(username);
        if (userData) {
            res.status(StatusCodes.OK).json(userData)
            return;
        }
        res.status(StatusCodes.NO_CONTENT).json({message: 'User not found'})
    }
    async GetUsersByUsername(req, res, next) {
        const { username } = req.query;
        const userData = await userService.GetUsersByUsername(username);
        if (userData) {
            res.status(StatusCodes.OK).json(userData)
            return;
        }
        res.status(StatusCodes.NO_CONTENT).json({message: 'User not found'})
    }
}

module.exports = new User;