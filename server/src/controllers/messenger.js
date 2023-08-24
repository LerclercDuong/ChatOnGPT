const users = require('../models/users');
const conversation = require('../models/conversations');
const messages = require('../models/messages');
const invitations = require('../models/invitations');

class Messenger {
    async saveMessages(message) {
        try {
            const new_messages = new messages({
                conversation: message.conversation,
                sender: message.sender,
                content: message.content
            })
            new_messages.save().catch(function(err){});
        } catch (err) {
        }

    }
    async findUser(req, res) {
        const username = req.params.slug;
        users.findOne({ username: username })
            .then(function (user) {
                if (user) {
                    res.status(200).json({
                        status: 'Found',
                        data: {
                            username: user.username,
                            profilePicture: user.profilePicture,
                            email: user.email
                        }

                    })
                } else {
                    res.status(200).json({ status: 'Not Found' })
                }

            })
    }

    async findUserByID(req, res) {
        const userID = req.params.slug;
        users.findOne({ _id: userID })
            .then(function (user) {
                if (user) {
                    res.status(200).json({
                        status: 'Found',
                        data: {
                            username: user.username,
                            profilePicture: user.profilePicture,
                            email: user.email
                        }

                    })
                } else {
                    res.status(200).json({ status: 'Not Found' })
                }

            })
    }
    async getConversationByUserName(req, res, next) {
        const username = req.params.username;
        const userID = await users.findOne({ username: username })
            .then(function (user) {
                return user._id;
            })
        const conversationID = await conversation.find({ participants: userID })
            .then(function (conversation) {
                return conversation;
            })
        res.json({ message: 'success', data: conversationID })
    }
    async getMessagesByConversationID(req, res, next) {
        const conversationID = req.params.conversationID;
        const messageAll = await messages.find({ conversation: conversationID }).lean()

        async function addPicture() {
            for (var message of messageAll) {
                const user = await users.findOne({ username: message.sender });
                if (user) {
                    message.profilePicture = user.profilePicture;
                }
            }
        }
        await addPicture();
        res.json({ message: 'success', data: messageAll })
    }

    async createConversation(req, res) {
        const participants = req.body.participants;
        async function getUserID() {
            const userID_list = [];
            for (const name of participants) {
                const user = await users.findOne({ username: name });
                if (user) {
                    const id = user._id.toHexString();
                    userID_list.push(id);
                }
            }
            return userID_list;
        }
        const participants_id = await getUserID();
        const new_conversation = new conversation({ name: participants.join(), participants: participants_id })
        new_conversation.save();
        res.json({ message: 'success' })
    }


    async sendMessage(req, res, next) {
        const { username, conversation_id, content } = req.body;
        async function getSenderID(username) {
            var senderID;
            await users.findOne({ username: username })
                .then(function (sender) {
                    if (sender) {
                        const id = sender._id.toHexString();
                        senderID = id;
                    }
                })
            return senderID;
        }
        const sender_id = await getSenderID(username);
        const new_message = new messages({
            conversation: conversation_id,
            sender: sender_id,
            content: content
        })

        new_message.save();
    }

    async sendInvitation(req, res) {
        const fromName = req.body.from;
        const targetName = req.body.to;
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
        const new_invitation = new invitations({ from: fromID, target: targetID });
        new_invitation.save();
        res.json({ message: "success" })
    }

    async acceptInvitation(req, res) {
        const invitationID = req.params.invitationID;
        invitations.findOneAndDelete({ _id: invitationID })
        res.json({ message: "success" })
    }

    async getInvitation(req, res) {
        const username = req.params.username;
        const usernameID = await users.findOne({ username: username })
            .then(function (user) {
                return user._id.toHexString();
            })
        const allInvitations = await invitations.find({ target: usernameID }).lean();
        async function addInformation() {
            for (var invitation of allInvitations) {
                const user = await users.findOne({ _id: invitation.from });
                if (user) {
                    invitation.fromProfilePicture = user.profilePicture;
                    invitation.fromUserName = user.username;
                }
            }
        }
        await addInformation();
        res.json({ message: "success", data: allInvitations })
    }
    deleteMessage(req, res, next) {

    }
}

module.exports = new Messenger;