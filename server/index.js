const express = require('express');
const app = express();
const PORT = 8080;
const router = require('./src/routes/index');
const mongoDB = require('./src/configs/database');
var http = require('http');
var https = require('https');
const path = require('path');
require('dotenv').config();
const socketIO = require('./src/socket/index');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


var httpServer = http.createServer(app);
mongoDB.connect();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


router(app);

const io =  require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    }
  });

socketIO(io);

io.on("test", (data) => {
    console.log(data); // x8WIv7-mJelg7
})

httpServer.listen(PORT, function () {
    console.log('listening on port 8080');
});