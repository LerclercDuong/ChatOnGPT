const Services = require('../services/index')
const {messengerServices} = Services;

class Chat {
    constructor(socket) {
        this.socket = socket;
        this.handler = {
            message: message.bind(this), // use the bind function to access this.app
        };
    }
    // Expose handler methods for events
}
// Events
function message() {
    // receive and Broadcast message to all sockets
    this.socket.on('message', async (data) =>{
        console.log(data)
        //save message to database
        const handleSuccess = await messengerServices.Message.save(data);
        if(handleSuccess){
            this.socket.to(data.roomId).emit("message", data);
        }
    });
};

// function ping() {
//     // Reply to sender
//     this.socket.emit('message', 'PONG!');
// };

module.exports = Chat;