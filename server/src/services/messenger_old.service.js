//import
const messages = require('../models/messages')
const users = require('../models/users');
const invitations = require('../models/invitations');
const rooms = require('../models/rooms');
const {ObjectId} = require('mongodb');
//messenger service contain:
//room
//invite
//message
class MessengerService {
    constructor(Message, Room, Invite) {
        this.Message = new Message;
        this.Room = new Room;
        this.Invite = new Invite;
    }

    async joinRoom(data) {
        let success = false;
        //roomId
        //target: current user
        const { roomId, target, from } = data;
        let targetId = target._id;
        try {
            // Check if the user is invited to the room
            const inviteData = await invitations.findOne({ roomId: roomId, target: targetId})
                .then(invitation => {
                    return invitation;
                })
            const inviteId = inviteData._id;
            let addSuccess = await this.Room.addNewUser({targetId, roomId});
            if (addSuccess === false) {
                throw new Error(`User ${username} is not invited to room ${roomId}`);
            } else {
                await this.Invite.delete( { inviteId } );
                success = true;
            }
            // You can implement additional checks or validations here

            // Add the user to the room (you need to implement this logic)
            // This will typically involve updating the room's participants list
            // and handling any additional actions needed when a user joins a room.
            // Delete the invite after the user has joined the room
            return success;
        } catch (err) {
            throw err;
        }
        return success;
    }
}

class Message {
    //create and save message to database
    async save(data) {
        var success = false;
        try {
            const newMessage = new messages({
                ...(data.messagePacket)
            })
            newMessage.save().catch(function (err) {
            });
            success = true;
        } catch (err) {
            throw err;
        }
        return success;
    }

    //get all message by roomId
    //add userProfilePicture to each messages
    async get(data) {
        const {roomId} = data;
        const Oid = new ObjectId(roomId);
        try {
            const result = await messages
                .find({roomId: Oid})
                .sort({ timestamp: 1 })
                // .limit(10)
                .populate('senderData')
                .lean()
            return result;
        } catch (err) {
            throw err;
        }
    }

    async delete(roomId) {

    }
}

//CRUD for room
class Room {
    //save to database
    async save(data) {
        const {roomName, participants} = data;
        var saveSuccess = false;
        //return a list of userID that was add to the room
        try {
            async function getUserID() {
                const userIdList = [];
                for (const name of participants) {
                    const user = await users.findOne({username: name});
                    if (user) {
                        const Id = user._id.toHexString();
                        userIdList.push(Id);
                    } else {
                        throw new Error(`User ${name}` + " " + `not found`)
                    }
                }
                return userIdList;
            }

            const participants_id = await getUserID();
            const newRoom = new rooms({name: roomName, participants: participants_id})
            newRoom.save().catch(function () {
            });
            saveSuccess = true;
        } catch (err) {
            throw err;
        }
        return saveSuccess;
    }

    //get room by username
    //return a list of roomId that belong to specific user
    async get(data) {
        const {username} = data;
        const userId = await users.findOne({username: username})
            .then(function (user) {
                return user._id;
            }).catch(function (error) {
            })
        const roomId = await rooms.find({participants: userId}).sort({timestamp: -1})
            .then(function (conversation) {
                return conversation;
            }).catch(function (error) {
            })
        return roomId;
    }

    async delete(username) {

    }

    async update(data) {

    }

    async addNewUser(data) {
        const {targetId, roomId} = data;
        const result = await rooms.updateOne(
            {_id: roomId},
            {$push: {participants: targetId}},
        );
        if (!result) {
            throw new Error('No participant added. Room not found or user already exists.');
        }
    }
}

class Invite {
    //create new invite and save to database
    async save(data) {
        const { roomId, from, target } = data;
        let success = true;
        try {
            const fromId = await users.findOne({username: from})
                .then(function (user) {
                    if (user) {
                        return user._id.toHexString();
                    }
                })
            const targetId = await users.findOne({username: target})
                .then(function (user) {
                    if (user) {
                        return user._id.toHexString();
                    }
                })
            const newInvite = new invitations({
                roomId: roomId,
                from: fromId,
                target: targetId
            })
            await newInvite.save().catch(function (err) {
                console.log("Error when save invite")
                success = false;
            });
        } catch (err) {
            throw err;
        }
        return success;
    }

    //get invite by sender name, room id, target name
    async get(data) {
        const {username} = data;
        try {
            const usernameId = await users.findOne({username: username})
                .then(function (user) {
                    return user._id.toHexString();
                }).catch(function (err) {
                })
            const allInvites = await invitations.find({target: usernameId})
                .populate('target', 'from')
                .populate({
                    path: 'target',
                    select: 'username'
                })
                .populate({
                    path: 'from',
                    select: 'username'
                }).lean()
            ;

            // async function addInformation() {
            //     for (var invite of allInvites) {
            //         const user = await users.findOne({_id: invite.from});
            //         if (user) {
            //             invite.fromProfilePicture = user.profilePicture;
            //             invite.fromUserName = user.username;
            //         }
            //     }
            // }
            //
            // await addInformation();
            return allInvites;
        } catch (err) {
            throw err;
        }
    }

    //delete invite when the target user accept to join room
    async delete(data) {
        const { inviteId } = data;
        try {
            await invitations.findByIdAndDelete(inviteId);
        } catch (err) {
            throw err;
        }

    }

    async update(data) {

    }
}

module.exports = new MessengerService(Message, Room, Invite);