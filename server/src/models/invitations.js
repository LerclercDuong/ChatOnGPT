const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invitations = new Schema({
    roomID: { type: mongoose.Schema.Types.ObjectId, ref: 'conversations' },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    target: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
});


module.exports = mongoose.model('invitations', invitations);

