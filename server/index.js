const express = require('express');
const app = express();
const PORT = 8080;
const router = require('./src/routes/index');
const mongoDB = require('./src/configs/database');
const cors = require('cors');
const http = require('http');
const https = require('https');
const path = require('path');
const dotenv = require('dotenv')
const socketIO = require('./src/socket/index');
const OpenAI = require("openai");
const fileUpload = require('express-fileupload');

app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
require("dotenv").config()
// dotenv.populate(process.env, parsed)
// const openai = new OpenAI({
//     apiKey: process.env.GPT_KEY,
// });

var httpServer = http.createServer(app);
mongoDB.connect();
app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
// console.log(path.join(__dirname, '/src/static/img'))

app.use('/static', express.static(path.join(__dirname, '/src/static')))

router(app);

app.post("/webhook", (req, res) => {
    let body = req.body;
    console.log(`\u{1F7EA} Received webhook:`);
    console.dir(body, {depth: null});
})

const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
    }
});

socketIO(io);

httpServer.listen(PORT, function () {
    console.log('listening on port 8080');
});