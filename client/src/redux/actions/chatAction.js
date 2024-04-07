import {
    LOAD_CHAT_ROOM,
    LOAD_ROOM_LIST,
    SET_CURRENT_ROOM,
    RECEIVE_MESSAGE,
    SEND_MESSAGE,
    SET_ONLINE_USERS,
    LOAD_INVITATION_LIST,
    RECEIVE_INVITATION
} from "../types";

import {LoginWithUsernameAndPassword, SignUp} from '../../services/auth.service'

const LoadChatRoomAction = (information) => (dispatch) => {
    dispatch({
        type: LOAD_CHAT_ROOM,
        payload: {
            ...information
        },
    });
};
const LoadRoomListAction = (information) => (dispatch) => {
    dispatch({
        type: LOAD_ROOM_LIST,
        payload: {
            ...information
        },
    });
};
const SetCurrentRoomAction = (information) => (dispatch) => {
    dispatch({
        type: SET_CURRENT_ROOM,
        payload: {
            ...information
        },
    });
};
const ReceiveMessageAction = (information) => (dispatch) => {
    dispatch({
        type: RECEIVE_MESSAGE,
        payload: {
            ...information
        },
    });
};
const SetOnlineUsers = (information) => (dispatch) => {
    dispatch({
        type: SET_ONLINE_USERS,
        payload: {
            ...information
        },
    });
};

const LoadInvitationListAction = (information) => (dispatch) => {
    dispatch({
        type: LOAD_INVITATION_LIST,
        payload: {
            ...information
        },
    });
};
const ReceiveInvitationAction = (information) => (dispatch) => {
    dispatch({
        type: RECEIVE_INVITATION,
        payload: {
            ...information
        },
    });
};
export {
    LoadChatRoomAction,
    LoadRoomListAction,
    SetCurrentRoomAction,
    ReceiveMessageAction,
    SetOnlineUsers,
    LoadInvitationListAction,
    ReceiveInvitationAction
};