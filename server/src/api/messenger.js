const Services = require('../services/index.js');
const { StatusCodes } = require('http-status-codes');

const { userServices, messengerServices } = Services;

class Messenger {
    async CreateNewRoom(req, res, next) {
        try {
            const { creator, roomName } = req.body;
            const newRoomData = await messengerServices.CreateNewRoom(creator, roomName);
            if (newRoomData) {
                res.status(StatusCodes.OK).json(newRoomData);
            } else {
                res.status(StatusCodes.NO_CONTENT).json();
            }
        } catch (err) {
            res.status(500).json({message: err});
        }

    }
    async GetMessageListInRoom(req, res, next) {
        try {
            const roomId = req.params.roomId;
            const messageList = await messengerServices.GetMessageListInRoom(roomId);
            res.status(StatusCodes.OK).json(messageList);
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
        }
    }

    async GetRoomListOfUser(req, res, next) {
        try {
            const userId = req.params.userId;
            const roomList = await messengerServices.GetRoomListOfUser(userId);
            res.status(StatusCodes.OK).json(roomList);
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
        }
    }

    async GetRoomInfo(req, res, next) {
        try {
            const roomId = req.params.roomId;
            const roomInfo = await messengerServices.GetRoomInfo(roomId);
            res.status(StatusCodes.OK).json(roomInfo);
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
        }
        // res.status(StatusCodes.NO_CONTENT).json({message: 'No content'});
    }

    async SendInvite(req, res, next) {
        try {
            const roomId = req.params.roomId;
            const { from, to } = req.body;
            const data = await messengerServices.SendInvite(from, to, roomId);
            if (data) {
                res.status(StatusCodes.OK).json(data)
            }
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json({ err })
        }
    }

    async AcceptInvite(req, res, next) {
        try {
            const response = await messengerServices.AcceptInvite(req.params.inviteId);
            if (response) {
                res.status(StatusCodes.OK).json(response)
            }
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: err })
        }

    }
    async GetInvitationList(req, res, next) {
        try {
            const response = await messengerServices.GetInvitationList(req.params.userId);
            if (response) {
                res.status(StatusCodes.OK).json(response)
            }
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: err })
        }

    }
    async GetInvitationById(req, res, next) {
        try {
            const response = await messengerServices.GetInvitationById(req.params.inviteId);
            console.log(response)
            if (response) {
                res.status(StatusCodes.OK).json(response)
            }
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: err })
        }

    }
}

module.exports = new Messenger;