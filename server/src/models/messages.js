const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messages = new Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rooms',
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
    content: {
        type: String,
    },
    images:{
        type: Array,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});
messages.pre('find', async function (docs, next) {
    this.populate({
        path: "senderData roomId"
    })
});
messages.pre('findOne', async function (docs, next) {
    this.populate({
        path: "senderData roomId"
    })
});
messages.pre('save', function (next) {
    this.timestamp = new Date(this.timestamp.getTime() + 7 * 60 * 60 * 1000); // Adjust for GMT+7
    next();
});

module.exports = mongoose.model('messages', messages);