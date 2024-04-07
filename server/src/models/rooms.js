const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rooms = new Schema({
    name: {
        type: String
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    timestamp: {
        type: Date,
        default: Date.now
    }
});
rooms.pre('find', async function (docs, next) {
    this.populate({
        path: "participants"
    })
});
rooms.pre('findOne', async function (docs, next) {
    this.populate({
        path: "participants"
    })
});
rooms.path('participants').validate(function (value) {
    // Use a Set to store unique participant IDs
    const uniqueParticipants = new Set(value.map(String));
    // Check if the Set's size is the same as the original array's length
    return uniqueParticipants.size === value.length;
}, 'Duplicate participants are not allowed.');

module.exports = mongoose.model('rooms', rooms);

