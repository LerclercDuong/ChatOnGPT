/**
 * This module handles real-time communication using the Socket.IO library.
 */
const Messenger = require('../api/messenger');
const messengerServices = require('../services/messenger.service');
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

    function addOnlineUser({socketId, username}) {
        // Check if the user already exists in the set
        const userExists = Array.from(onlineUsers).some(user => user.username === username);

        // If the user doesn't exist, add them to the set
        if (!userExists) {
            onlineUsers.add({socketId, username});
            console.log(`User ${username} added to online users.`);
        } else {
            console.log(`User ${username} is already online.`);
        }
    }

    function removeOnlineUser(socketId) {
        for (const obj of onlineUsers) {
            if (obj.socketId === socketId) {
                onlineUsers.delete(obj);
                break; // Exit the loop after the object is deleted
            }
        }
    }

    // Handle 'connection' event when a client connects
    io.on("connection", (socket) => {
        // Handle 'setUsername' event
        socket.on('user-connected', (username) => {
            console.log("user" + username + "connected")
            // Associate the socket ID with the username
            const onlineData = {
                socketId: socket.id,
                username: username
            }
            if (onlineData.username) {
                addOnlineUser(onlineData)
            }
            console.log(Object.values(Array.from(onlineUsers)))
            io.sockets.emit("pingOnlineState", Object.values(Array.from(onlineUsers)));
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
            const handleSuccess = await messengerServices.SaveMessageToDB(data);
            const userData = await userServices.GetUserById(data.senderData);
            const pingMessage = {
                sender: data.sender,
                senderData: {
                    profilePicture: userData?.profilePicture
                },
                images: data.images,
                roomId: data.roomId,
                content: data.content,
                timestamp: new Date()
            }

            if (handleSuccess) {
                socket.emit("pingMessage", pingMessage);
                socket.to(data.roomId).emit("pingMessage", pingMessage);
            }

            if (data.content.startsWith('/gpt')) {
                const question = data.content.slice(3);
                const answer = await gptServices.generateAnswer(question)

                let cleanedAnswer = answer.replace(/[{}" ]/g, ' ').trim();

                const chatBotData = await userServices.GetUserByName('GPTChatbot');
                const gptMessage = {
                    messagePacket: {
                        sender: "GPTChatbot",
                        senderData: {
                            profilePicture: "https://pnghive.com/core/images/full/chat-gpt-logo-png-1680406057.png"
                        },
                        images: [],
                        roomId: data.roomId,
                        content: cleanedAnswer,
                        timestamp: new Date()
                    }
                }
                const saveMessage = {
                    messagePacket: {
                        sender: "GPTChatbot",
                        senderData: chatBotData._id,
                        images: [],
                        roomId: data.roomId,
                        content: cleanedAnswer,
                        timestamp: new Date()
                    }
                }
                const gptResponse = await messengerServices.SaveMessageToDB(saveMessage.messagePacket)
                socket.emit("pingMessage", gptMessage.messagePacket);
                socket.to(data.roomId).emit("pingMessage", gptMessage.messagePacket);
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
        socket.on("send-invitation", async (data) => {
            try {
                const {from, to, roomId} = data;
                console.log(data)
                // Save the invitation to the database
                const saveInvite = await messengerServices.SaveInvitation(from, to, roomId);
                // If successful, emit the event to the target user if online
                if (saveInvite) {
                    const invitationDetail = await messengerServices.GetInvitation(from, to, roomId)
                    const activeSocket = Object.values(Array.from(onlineUsers)).find(socket => socket.username === invitationDetail.to.username);
                    if (activeSocket) {
                        // If participant is online, emit a notification to their socket
                        io.to(activeSocket.socketId).emit('receive-invitation', invitationDetail);
                    }
                    socket.emit("invitationSuccess", {message: 'Send invitation successfully'});
                }
            } catch (error) {
                // Handle errors and send a message back to the client
                console.error("Error sending invitation:", error.message);
                // You can emit an error event to the client
                socket.emit("invitationFailed", {message: error.message});
            }
        });
        socket.on('notification', async function (message) {
            const roomData = await messengerServices.GetRoomInfo(message.roomId);
            roomData?.participants.forEach(participant => {
                // Check if the participant is online
                const activeSocket = Object.values(Array.from(onlineUsers)).find(socket => socket.username === participant.username);
                if (activeSocket) {
                    // If participant is online, emit a notification to their socket
                    if (activeSocket.username !== message.sender) {
                        io.to(activeSocket.socketId).emit('ping-notification',
                            {
                                roomName: roomData.name,
                                sender: message.sender,
                                content: message.content
                            });
                    }
                }
            });
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
            removeOnlineUser(socketId);
            console.log(onlineUsers)
            io.sockets.emit("pingOnlineState", Object.values(Array.from(onlineUsers)));
        });
    })
}

module.exports = socketIO;
