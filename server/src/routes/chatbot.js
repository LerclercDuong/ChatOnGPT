const express = require('express');
const router = express.Router();
const ChatBot = require('../api/chatbot')

router.get('/handle', ChatBot.handleMessage);

module.exports = router;