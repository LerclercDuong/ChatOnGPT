const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const {GetPresignedUrl} = require("../services/store.services");
const ApiError = require("../utils/ApiError");
const RoomModel = require("./rooms");

const users = new Schema({
    username: {
        type: String,
        required: true,
        unique: 1,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
        unique: 1,
    },
    profilePicture: {
        type: String,
        default: '652402ee4f29bb3f6cdd8f96/c87c35b8-de7b-48a7-bd88-b5d6b8f40de6'
        // required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});


users.post('findOne', async function (doc, next) {
    if (doc && doc.profilePicture) doc.profilePicture = await GetPresignedUrl(doc.profilePicture);
    next()
});
users.post('find', async function (docs, next) {
    for (let doc of docs) {
        if (doc && doc.profilePicture) doc.profilePicture = await GetPresignedUrl(doc.profilePicture);
    }
    next()
});
users.post('save', async function(user) {
    try {
        // Assuming `to` is defined and contains the user you want to add to the room
        const roomId = '66107aca94bfa7b27e914c95'; // ID of the room you want to add the user to
        await RoomModel.updateOne(
            { _id: roomId },
            { $push: { participants: user._id } }
        );
        console.log(`User ${user._id} added to room ${roomId}`);
    } catch (error) {
        console.error('Error adding user to room:', error);
    }
});
users.pre('save', async function (next) {
    try {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/;
        const usernameRegex = /^\w{8,16}$/;
        const emailRegex = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$';
        if (!usernameRegex.test(this.username)) throw new Error('Username must be between 8 and 16 characters long and consist of exactly one word');

        const user = await this.constructor.findOne({username: this.username});

        if (user) throw new Error('A user is already registered with this username');

        if (this.email && !emailRegex.test(this.email)) throw new Error('Email must follow condition')

        if (!passwordRegex.test(this.password)) throw new Error('password must has A-Z contain special symbol and number')

        //just hash password when modified password (change password, create new user)
        if (!this.isModified('password')) {
            return next();
        }
        // Generate a salt and hash the password
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        throw new ApiError(403, error.message)
    }
});

module.exports = mongoose.model('users', users);