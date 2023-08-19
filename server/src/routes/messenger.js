const express = require('express');
const router = express.Router();
const Messenger = require('../controllers/messenger');

router.post('/create', Messenger.createConversation);
router.post('/send', Messenger.sendMessage);
router.get('/findUser/:slug', Messenger.findUser);
router.get('/findConversation/:username', Messenger.getConversationByUserName);
router.get('/getMessages/:conversationID', Messenger.getMessagesByConversationID);
router.post('/sendInvitation', Messenger.sendInvitation);

module.exports = router;