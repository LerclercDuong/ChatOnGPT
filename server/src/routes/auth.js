const express = require('express');
const router = express.Router();
const Authentication = require('../api/authentication');
const checkUserExist = require('../middlewares/checkUserExist');
const authToken = require('../middlewares/authToken');

router.post('/signup', Authentication.signup);
router.post('/login', Authentication.login);
router.post('/checkToken', authToken);

module.exports = router;