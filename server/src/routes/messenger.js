const express = require('express');
const router = express.Router();
const Messenger = require('../api/messenger');

router.get('/rooms/:roomId', Messenger.GetRoomInfo);
router.get('/rooms/:roomId/messages', Messenger.GetMessageListInRoom);
router.get('/users/:userId/rooms', Messenger.GetRoomListOfUser);
router.post('/rooms/:roomId/invite', Messenger.SendInvite);
router.put('/invite/:inviteId/accept', Messenger.AcceptInvite);
router.get('/invite/:inviteId', Messenger.GetInvitationById);
router.post('/rooms/create', Messenger.CreateNewRoom);

module.exports = router;