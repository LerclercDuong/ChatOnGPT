import {
    LOAD_CHAT_ROOM,
    SET_CURRENT_ROOM,
    LOAD_ROOM_LIST,
    SEND_MESSAGE,
    RECEIVE_MESSAGE,
    SET_ONLINE_USERS,
    LOAD_INVITATION_LIST,
    RECEIVE_INVITATION
} from "../types";

// src/reducers/authReducer.js
const initialState = {
    roomList: [],
    onlineUsers: [],
    currentRoomId: null,
    roomInfo: {},
    messageList: [],
    invitationList: [],
    error: null
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ROOM_LIST:
            const {roomList} = action.payload;
            try {
                return {
                    ...state,
                    roomList: roomList,
                    error: null,
                };
            } catch (error) {
                return {
                    ...state,
                    error: error,
                };
            }
        case SET_CURRENT_ROOM:
            const {roomId} = action.payload;
            return {
                ...state,
                currentRoomId: roomId,
            };
        case LOAD_CHAT_ROOM:
            const {roomInfo, messageList} = action.payload;
            try {
                return {
                    ...state,
                    roomInfo,
                    messageList,
                    error: null,
                };
            } catch (error) {
                return {
                    ...state,
                    error: error,
                };
            }
        case SEND_MESSAGE:
            return {
                ...state,
                messageList: [...state.messageList, action.payload],
            };

        case RECEIVE_MESSAGE:
            return {
                ...state,
                messageList: [...state.messageList, action.payload],
            };
        case SET_ONLINE_USERS:
            return {
                ...state,
                onlineUsers: action.payload
            };
        case LOAD_INVITATION_LIST:
            return {
                ...state,
                invitationList: action.payload.invitationList
            };
        case RECEIVE_INVITATION:
            return {
                ...state,
                invitationList: [...state.invitationList, action.payload]
            };
        default:
            return state;
    }
};
export default chatReducer;
