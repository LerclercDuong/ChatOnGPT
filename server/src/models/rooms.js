const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rooms = new Schema({
    name: {
        type: String,
        validate: {
            validator: function(v) {
                return v.length >= 5 && v.length <= 20;
            },
            message: props => `Please provide a name between 5 and 20 characters.`
        }
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
rooms.pre('save', function(next) {
        const room = this;
        // Check if the room name length is between 5 and 20 characters
        if (room.name.length < 5 || room.name.length > 20) {
            throw new Error('Room name must be between 5 and 20 characters.');
        }
        next()
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

