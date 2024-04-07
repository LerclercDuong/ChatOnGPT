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
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});
invitations.pre('find', async function (docs, next) {
    this.populate({
        path: "from to roomId"
    })
});
invitations.pre('findOne', async function (docs, next) {
    this.populate({
        path: "from to roomId"
    })
});
// Create a compound unique index on roomId, from, and target
// invitations.index({ roomId: 1, from: 1, target: 1 }, { unique: true });

module.exports = mongoose.model('invitations', invitations);

