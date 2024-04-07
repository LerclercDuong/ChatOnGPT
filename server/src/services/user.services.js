const UserModel = require('../models/users');
const storeService = require('./store.services');
class UserService {
    async UpdateUser(userId, updatedData, image) {
        const file = image?.profilePicture;
        if(file){
            const {key} = await storeService.uploadToS3({userId, file});
            const data = {
                profilePicture: key,
                ...updatedData
            }
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                {$set: data},
                {new: true} // Return the updated document
            );
            if (!updatedUser) {
                throw new Error('User not found');
            }
            return updatedUser;
        }else{
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                {$set: updatedData},
                {new: true} // Return the updated document
            );
            if (!updatedUser) {
                throw new Error('User not found');
            }
            return updatedUser;
        }
    }

    //create user
    async GetUserById(userId) {
        try {
            return await UserModel.findById(userId).lean();
        } catch (err) {
            throw err;
        }
    }


    async GetUserByName(username) {
        return UserModel.findOne({username: username}).lean();
    }

    async GetUsersByUsername(keyword) {
        return UserModel.find({username: {$regex: keyword, $options: 'i'}, role: 'user'}).lean();
    }
    async GetUserByEmail(email) {
        return UserModel.findOne({email: email}).lean();
    }

    async GetUsers() {
        return UserModel.find({}).lean();
    }

}

module.exports = new UserService;
