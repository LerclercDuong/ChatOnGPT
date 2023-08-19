const express = require('express');
const router = express.Router();
const users = require('../models/users');

router.get('/:id', function(){
    res.send('user id');
})