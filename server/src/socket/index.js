/**
 * This module handles real-time communication using the Socket.IO library.
 */
const Messenger = require('../api/messenger');
const messengerServices = require('../services/messenger.services');
const Chat = require('./chat.js');
const Invite = require('./invite.js');
const {userServices, gptServices} = require("../services");

/**
 * Initialize the Socket.IO server.
 * @param {object} io - The Socket.IO server instance.
 */
function socketIO(io) {

    const typingUsers = new Set(); // Set to store typing users
    const onlineUsers = new Set(); // Set to store online users

    /**
     * Converts a JavaScript object to a JSON string.
     * @param {object} obj - The object to be serialized.
     * @returns {string} - The JSON representation of the object.
     */
    function serializeObject(obj) {
        return JSON.stringify(obj);
    }

    // Handle 'connection' event when a client connects
    io.on("connection", (socket) => {
        // Handle 'setUsername' event
        socket.on('setUsername', (username) => {
            // Associate the socket ID with the username
            const onlineData = {
                socketId: socket.id,
                username: username
            }
            if (onlineData.username) {
                onlineUsers.add(onlineData);
            }
            console.log(onlineUsers)
            const onlineUsersArray = Array.from(onlineUsers).map((e) => e);
            io.sockets.emit("pingOnlineState", onlineUsersArray);
        });

        // Handle 'join' event
        socket.on("join", (data) => {
            socket.join(data);
        })

        // Handle 'un-join' event
        socket.on("un-join", (data) => {
            socket.leave(data);
        })

        // Handle 'message' event
        socket.on('message', async (data) => {
            // Save message to the database
            const handleSuccess = await messengerServices.Message.save(data);
            const userData = await userServices.find({username: data.messagePacket.sender});
            const pingMessage = {
                sender: data.messagePacket.sender,
                senderData: {
                    profilePicture: userData.profilePicture
                },
                images: data.messagePacket.images,
                roomId: data.messagePacket.roomId,
                content: data.messagePacket.content,
                timestamp: new Date()
            }

            if (handleSuccess) {
                socket.emit("pingMessage", pingMessage);
                socket.to(data.messagePacket.roomId).emit("pingMessage", pingMessage);
            }

            if (data.messagePacket.content.startsWith('/gpt')) {
                const question = data.messagePacket.content.slice(3);
                const answer = await gptServices.generateAnswer(question)

                let cleanedAnswer = answer.replace(/[{}" ]/g, ' ').trim();

                const chatBotData = await userServices.find({username: 'GPTChatbot'});
                const gptMessage = {
                    messagePacket: {
                        sender: "GPTChatbot",
                        senderData: {
                            profilePicture: "https://pnghive.com/core/images/full/chat-gpt-logo-png-1680406057.png"
                        },
                        images: [],
                        roomId: data.messagePacket.roomId,
                        content: cleanedAnswer,
                        timestamp: new Date()
                    }
                }
                const saveMessage = {
                    messagePacket:{
                        sender: "GPTChatbot",
                        senderData: chatBotData._id,
                        images: [],
                        roomId: data.messagePacket.roomId,
                        content: cleanedAnswer,
                        timestamp: new Date()
                    }
                }
                const gptResponse = await messengerServices.Message.save(saveMessage);
                console.log(gptResponse)

                socket.emit("pingMessage", gptMessage.messagePacket);
                socket.to(data.messagePacket.roomId).emit("pingMessage", gptMessage.messagePacket);

            }


        })

        // Handle 'isTyping' event
        socket.on("isTyping", (data) => {
            const {username, roomId} = data;
            if (username && roomId) {
                typingUsers.add(serializeObject(data));
                const typingUserArray = Array.from(typingUsers).map((jsonString) => JSON.parse(jsonString));
                socket.to(roomId).emit("pingIsTyping", typingUserArray);
            }
        })

        // Handle 'isNotTyping' event
        socket.on("isNotTyping", (data) => {
            const {username, roomId} = data;
            if (username && roomId) {
                typingUsers.delete(serializeObject(data));
                const typingUserArray = Array.from(typingUsers).map((jsonString) => JSON.parse(jsonString));
                socket.to(roomId).emit("pingIsTyping", typingUserArray);
            }
        })

        // Handle 'invite' event
        socket.on("invite", async (data) => {
            console.log(data)
            let targetSocketId = null;
            // Find the socket ID of the target user
            for (const obj of onlineUsers) {
                if (obj.username === data.target) {
                    targetSocketId = obj.socketId;
                    break; // Exit the loop after the object is found
                }
            }
            // Save the invitation to the database, if successful, emit the event to the target user if online
            const saveInvite = await messengerServices.Invite.save(data);
            if (saveInvite && targetSocketId) {
                socket.to(targetSocketId).emit("pingInvite", data);
            }
        })

        // Handle 'joinRoom' event (Note: It references variables 'saveInvite' and 'targetSocketId' which are not defined in this function)
        socket.on('joinRoom', async function (data) {
            let targetSocketId = null;
            // Find the socket ID of the target user
            for (const obj of onlineUsers) {
                if (obj.username === data.target.username) {
                    targetSocketId = obj.socketId;
                    break; // Exit the loop after the object is found
                }
            }
            try {
                const success = await messengerServices.joinRoom(data);
                if (success) {
                    socket.to(targetSocketId).emit("pingJoinRoom", data);
                }
            } catch (err) {
                console.log(err.message);
            }
        })
        // Handle 'disconnect' event when a client disconnects
        socket.on('disconnect', function () {
            const socketId = socket.id;
            for (const obj of onlineUsers) {
                if (obj.socketId === socketId) {
                    onlineUsers.delete(obj);
                    break; // Exit the loop after the object is deleted
                }
            }
            console.log(onlineUsers)
            const onlineUsersArray = Array.from(onlineUsers).map((e) => e);
            io.sockets.emit("pingOnlineState", onlineUsersArray);
        });
    })
}

module.exports = socketIO;
