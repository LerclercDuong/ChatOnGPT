const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messages = new Schema({
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'conversations', required: true },
    sender: { type: String, ref: 'users', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('messages', messages);