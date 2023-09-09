const express = require('express');
const router = express.Router();
const Messenger = require('../controllers/messenger');

router.post('/createConversation', Messenger.createConversation);
router.post('/joinRoom', Messenger.joinRoom);
router.post('/send', Messenger.sendMessage);
router.get('/findUser/:slug', Messenger.findUser);
router.get('/findUserByID/:slug', Messenger.findUserByID);
router.get('/findConversation/:username', Messenger.getConversationByUserName);
router.get('/getMessages/:conversationID', Messenger.getMessagesByConversationID);
router.post('/sendInvitation', Messenger.sendInvitation);
router.get('/getInvitation/:username', Messenger.getInvitation);

module.exports = router;