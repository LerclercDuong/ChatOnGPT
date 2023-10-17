const users = require('../models/users');
const conversation = require('../models/rooms');
const invitations = require('../models/invitations');
const Services = require('../services/index.js');
const rooms = require('../models/rooms');

//get services
const { userServices, messengerServices } = Services;

//provide api for messenger function:
//get all rooms by username
//get all messages by roomId
//get all invite by username
//get user online
//find user by name
//create new room
//change room name
class Messenger {
    //get all rooms that belong to username
    async getRoomsByUsername(req, res, next) {
        const { username } = req.params;
        const roomList = await messengerServices.Room.get({ username })
        res.status(200).json({ message: 'Success', data: { roomList } });
    }
    //get all messages that belong to room
    async getMessageByRoomId(req, res, next) {
        const { roomId } = req.params;
        try {
            if(!roomId){
                throw new Error("No room id found");
            }
            const messagesList = await messengerServices.Message.get({ roomId });
            res.status(200).json({ message: 'Success', data:  messagesList  });
        } catch (err) {
            res.status(204).json({ message: err.message })
        }
    }
    //get invite by username
    async getInviteByUsername(req, res) {
        const { username } = req.params;
        try {
            const allInvites = await messengerServices.Invite.get({ username })
            res.status(200).json({ message: "Success", data: allInvites })
        } catch (err) {
            res.status(204).json({ message: 'Error', err: err })
        }
    }

    async createRoom(req, res) {
        const { roomName, participants } = req.body;
        try {
            if(!roomName || !participants){
                throw new Error("No data found");s
            }
            const createSuccess = await messengerServices.Room.save({ roomName, participants });
            if (createSuccess) {
                res.status(200).json({ message: 'Success' });
            } else throw new Error('Create room failed');
        } catch (err) {
            res.status(204).json({ message: 'Error', err: err.message });
        }
    }

    async findUserByUsername(req, res, next) {
        const { username } = req.params;
        try {
            const userFound = await userServices.find({ username });
            if (userFound) {
                res.status(200).json({ message: 'Success', data: userFound});
            } else throw new Error('User not found');
        } catch (err) {
            res.status(204).json({ message: 'Error', err: err });
        }
    }

    async sendInvitation(req, res) {
        const fromName = req.body.from;
        const targetName = req.body.to;
        const roomID = req.body.roomID;
        const fromID = await users.findOne({ username: fromName })
            .then(function (user) {
                if (user) {
                    return user._id.toHexString();
                }
            })
        const targetID = await users.findOne({ username: targetName })
            .then(function (user) {
                if (user) {
                    return user._id.toHexString();
                }
            })
        const isExist = await invitations.findOne({ from: fromID, target: targetID, roomID: roomID })
        if (isExist) {
            res.json({ message: "invitations already exist" })
        } else {
            const new_invitation = new invitations({ from: fromID, target: targetID, roomID: roomID });
            new_invitation.save();
            res.json({ message: "success" })
        }
    }

    async joinRoom(req, res) {
        const roomId = req.body.roomID;
        const targetId = req.body.targetID;
        const inviteData = await invitations.findOne({ roomID: roomId, target: targetId })
            .then(invitation => {
                return invitation
            })
        if (inviteData) {
            const result = await rooms.updateOne(
                { _id: roomId },
                { $push: { participants: targetId } },
            );
            if (result) {
                await invitations.findByIdAndDelete(invitationData._id)
            } else {
                console.log('No participant added. Room not found or user already exists.');
            }
        }
        res.json({ message: "Success" })
    }



    deleteMessage(req, res, next) {

    }
}

module.exports = new Messenger;