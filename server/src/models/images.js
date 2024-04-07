const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const images = new Schema({
    messageId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messages',
        required: true
    },
    sender: {
        type: String,
        ref: 'users',
        required: true
    },
    senderData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    sourceUrl: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('images', images);