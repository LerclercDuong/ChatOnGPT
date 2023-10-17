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

rooms.path('participants').validate(function (value) {
    // Use a Set to store unique participant IDs
    const uniqueParticipants = new Set(value.map(String));

    // Check if the Set's size is the same as the original array's length
    return uniqueParticipants.size === value.length;
}, 'Duplicate participants are not allowed.');

module.exports = mongoose.model('rooms', rooms);

