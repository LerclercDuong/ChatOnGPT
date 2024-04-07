const express = require('express');
const router = express.Router();
const User = require('../api/user');
const Messenger = require('../api/messenger');

router.get('/get/id/:userId', User.GetUserById);
router.get('/get/username/:username', User.GetUserByUsername);
router.get('/', User.GetUsersByUsername);
router.get('/:userId/invitation-list', Messenger.GetInvitationList);
router.post('/update/:userId', User.UpdateUser);

module.exports = router;