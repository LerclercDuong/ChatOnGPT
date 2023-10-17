const JOINROOM = 'JOINROOM';
const INVITE = 'INVITE';
const LOGIN_SUCCESS = 'LOGINSUCCESS';
const LOGIN_FAIL = 'LOGINFAIL';
const REGISTER = 'REGISTER';

export default class NotificationService {
    //main pushing function, send notification API to client
    async pushNotifications(notifications) {
        switch(notifications){
            case(JOINROOM):
                return joinRoom(username, roomName, timestamp);
                break;
            case(LOGINSUCCESS):
                break;
        }
    }
    async joinRoom(username, roomName, timestamp) {
        return username + "Join" + roomName + "at" + timestamp;
    }
}

