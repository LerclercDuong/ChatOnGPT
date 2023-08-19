const express = require('express');
const router = express.Router();
const Authentication = require('../controllers/authentication');
const checkUserExist = require('../middlewares/checkUserExist');
const authToken = require('../middlewares/authToken');

router.post('/register', Authentication.register);
router.post('/login', Authentication.login);
router.post('/checkToken', authToken);
module.exports = router;