const users = require('../models/users');

class UserService {
    //create user 
    async create(data) {
        const new_user = new users(data);
        return new_user.save().catch();
    }
    //find user by id or username
    async find(data) {
        var result = {};
        const username = data.username;
        const userId = data.userId;
        //find by username
        if (username) {
            result = await users.findOne({ username: username })
                .then(function (user) {
                    if (user) {
                        return user;
                    }
                })
        }
        //find by userId
        if (userId) {
            result = await users.findOne({ id: userId})
                .then(function (user) {
                    if (user) {
                        return user;
                    }
                })
        }
        return result;
    }
    //check user existance
    async isExist(username) {
        var exist = false;
        await users.findOne({ username: username })
            .then(function (user) {
                if (user) {
                    exist = true;
                }
            })
        return exist;
    }



}

module.exports = new UserService;
