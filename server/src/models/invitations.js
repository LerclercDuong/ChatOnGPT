const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invitations = new Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rooms',
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    target: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Create a compound unique index on roomId, from, and target
invitations.index({ roomId: 1, from: 1, target: 1 }, { unique: true });

module.exports = mongoose.model('invitations', invitations);

