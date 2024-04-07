const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const tokens = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    token: {
        type: String,
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: ['REFRESH', 'RESET_PASSWORD', 'VERIFY_EMAIL'],
        required: true,
    },
    exp: {
        type: Date,
        required: true
    }
},{
    timestamps: true,
});

module.exports = mongoose.model('tokens', tokens);