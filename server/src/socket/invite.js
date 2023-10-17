const Services = require('../services/index')
const {messengerServices} = Services;

class Invite{

    constructor(socket){
        this.socket = socket;
        this.handler = {
            invite: invite.bind(this), // use the bind function to access this.app
            acceptInvite: acceptInvite.bind(this), // use the accept function to access this
        };
    }
}

//broadcast invite event to target (userID, roomID)
function invite(){
    this.socket.on('invite', (data) =>{
        const handleSuccess = messengerServices.handleInvite(data);
        if(handleSuccess){
            this.socket.emit('invite', data);
        }
    });
}
//hand accept invite event to target (userID, roomID)
//- create notification
//- join room

function acceptInvite(){
    this.socket.on('acceptInvite', (data) =>{
        const handleSuccess = messengerServices.handleAcceptInvite(data);
        if(handleSuccess){
            this.socket.emit('acceptInvite', data);
        }
    });
}


module.exports = Invite;