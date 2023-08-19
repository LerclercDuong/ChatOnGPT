const Messenger = require('../controllers/messenger');

function socketIO(io) {
    io.on("connection", (socket) => {
        socket.on("join", (data) => {
            socket.join(data);
        })
        socket.on("un-join", (data) => {
            socket.leave(data);
        })
        socket.on("test", (data) => {
            console.log(data)
        })
        socket.on("sendMessage", ({messagePacket, conversationID}) => {
            Messenger.saveMessages(messagePacket);
            socket.to(conversationID).emit("toClient", messagePacket)
        })
    })

}

module.exports = socketIO;