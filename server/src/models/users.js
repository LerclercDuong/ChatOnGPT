const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/;
const bcrypt = require('bcrypt');

const users = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    tokenId: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }

});

users.pre('save', async function (next) {
    if(!passwordRegex.test(this.password)){
        throw new Error('password must follow condition')
    }
    //just hash password when modified password (change password, create new user)
    if (!this.isModified('password')) {
        return next();
    }
    try {
        // Generate a salt and hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(this.password, saltRounds);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});
module.exports = mongoose.model('users', users);