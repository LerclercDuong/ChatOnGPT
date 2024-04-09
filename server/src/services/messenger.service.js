//import
const MessageModel = require('../models/messages')
const UserModel = require('../models/users');
const InviteModel = require('../models/invitations');
const RoomModel = require('../models/rooms');
const {uploadToS3} = require('./store.services');
const rooms = require("../models/rooms");
const storeService = require("./store.services");

class MessengerService {
    async CreateNewRoom(creator, roomName){
        try {
            const newRoom = new RoomModel({ name: roomName, participants: [creator._id] });
            const savedRoom = await newRoom.save();
            return savedRoom;
        } catch (error) {
            // Handle error if needed
            console.error("Error creating new room:", error);
            throw error; // Re-throw the error to be handled by the caller
        }
    }

    async GetRoomInfo(roomId) {
        try {
            return await RoomModel.findById(roomId).lean();
        } catch (err) {
            console.log(err)
            throw err;
        }
    }

    async GetRoomListOfUser(userId) {
        try {
            return await RoomModel
                .find({participants: userId})
                .sort({timestamp: -1})
                .lean();
        } catch (err) {
            throw err;
        }
    }

    async GetMessageListInRoom(roomId) {
        try {
            const messages = await MessageModel
                .find({roomId: roomId})
                .sort({timestamp: 1})
                .lean();
            return messages;
        } catch (err) {
            throw err;
        }
    }

    async SaveMessageToDB(data) {
        try{
         if (!data.images.empty) {
            (data.images).forEach((img) => {
                const file = Buffer.from(img.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                const userId = data.senderData;
                uploadToS3({file, userId})
            })
        }
        const newMessage = new MessageModel({...data});
        return newMessage.save().catch();   
        }catch(e){
            console.log(e)
        }
    }

    async GetInviteListOfUser(userId) {
        return InviteModel.find({to: userId}).lean();
    }

    async SaveInvitation(from, to, roomId) {
        const existingInvite = await InviteModel.findOne({ from, to, roomId });
        if (existingInvite) {
            throw new Error('An invitation already exists between these users for this room');
        }
        // Check if the 'to' user exists in the room
        const exists = await RoomModel.findOne({_id: roomId, participants: to})
        if (exists) {
            throw new Error('The user does not exist in the specified room');
        }
        // Create a new invitation
        const newInvite = new InviteModel({ from, to, roomId });
        // Save the invitation asynchronously
        const savedInvite = await newInvite.save();

        return savedInvite;
    }
    async GetInvitation(from, to, roomId) {
        return InviteModel.findOne({from, to, roomId});
    }
    async GetInvitationById(inviteId) {
        return InviteModel.findById(inviteId);
    }
    async GetInvitationList(userId) {
        return InviteModel.find({to: userId});
    }
    async AcceptInvite(inviteId) {
        const {_id, from, to, roomId} = await InviteModel.findById(inviteId);
        // Update the room by adding the participant
        const result = await RoomModel.updateOne(
            {_id: roomId._id},
            {$push: {participants: to._id}}
        );
        if (result) {
            // If the room was updated successfully, delete the invite
            await InviteModel.deleteMany({to: to._id, roomId: roomId._id})
        } else {
            // If no participant was added, or room not found, handle the error
            throw new Error('No participant added. Room not found or user already exists.');
        }
        return {_id, from, to, roomId}
    }
}

module.exports = new MessengerService;