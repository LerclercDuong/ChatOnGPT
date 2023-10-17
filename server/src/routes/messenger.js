const express = require('express');
const router = express.Router();
const Messenger = require('../api/messenger');

//message function router
// router.post('/send', Messenger.sendMessage);
router.get('/get/:roomId', Messenger.getMessageByRoomId);
//room function router
router.post('/room/create', Messenger.createRoom);
router.post('/room/join/:roomId', Messenger.joinRoom);
router.get('/room/get/:username', Messenger.getRoomsByUsername);
router.post('/room/invite/send', Messenger.sendInvitation);
router.get('/room/invite/get/:username', Messenger.getInviteByUsername);
//user function router
router.get('/user/find/:username', Messenger.findUserByUsername);
// router.post('/uploadFile', Messenger.uploadFile);



module.exports = router;