const express = require('express');
const router = express.Router();
const Authentication = require('../api/authentication');
const authToken = require('../middlewares/authToken');
const refreshToken = require('../middlewares/refreshToken');

router.post('/signup', Authentication.SignUp);
router.post('/login', Authentication.Login);
router.post('/refresh-token', Authentication.RefreshAccessToken);
router.patch('/isAuth', Authentication.CheckIsAuth);

module.exports = router;