const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversations = new Schema({
    name: { type: String },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }]
});


module.exports = mongoose.model('conversations', conversations);

