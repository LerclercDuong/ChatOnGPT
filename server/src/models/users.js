const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const users = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true},
    email: { type: String, required: true},
    // displayName: { type: String, required: true },
    profilePicture: { type: String },
    tokenID: { type: String, required: true}   
    
});

module.exports = mongoose.model('users', users);