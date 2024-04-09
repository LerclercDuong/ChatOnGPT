import {useRef, useState, useEffect} from 'react';
import React from 'react';
import styles from './interface.module.css';

import {
    GetRoomListOfUser,
    GetRoomInfo,
    GetMessageListInRoom,
    GetInvitationList
} from '../../services/chat.service';

import {
    LoadChatRoomAction,
    LoadRoomListAction,
    SetCurrentRoomAction,
    SetOnlineUsers,
    LoadInvitationListAction,
    ReceiveInvitationAction
} from "../../redux/actions/chatAction";

import ChatList from '../../components/SideBar';
import ChatBox from '../../components/ChatBox';
import {useDispatch, useSelector} from "react-redux";
import io from "socket.io-client";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";

const socket = io('https://chatongpt-c29w.onrender.com/');
const ChatInterface = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const currentRoomId = useSelector((state) => state.chat.currentRoomId);
    const [chatListOpen, setChatListOpen] = useState(true);
    const navigate = useNavigate();
    // if(isAuthenticated === false){
    //     navigate('/login')
    // }
    socket.emit('user-connected', userInfo?.username);

    async function LoadRoomList(userId) {
        const roomList = await GetRoomListOfUser(userId);
        if(roomList && roomList.length > 0){
            dispatch(LoadRoomListAction({roomList}));
            dispatch(SetCurrentRoomAction({roomId: roomList[0]._id}))
        }
    }

    const toggleChatList = () => {
        setChatListOpen(!chatListOpen);
        console.log(chatListOpen)
    };

    async function LoadChatRoom(roomId) {
        if (roomId != null) {
            const roomInfo = await GetRoomInfo(roomId);
            const messageList = await GetMessageListInRoom(roomId);
            dispatch(LoadChatRoomAction({roomInfo, messageList}));
        }
    }

    async function LoadInvitationList(userId) {
        if (userId != null) {
            const invitationList = await GetInvitationList(userId);
            dispatch(LoadInvitationListAction({invitationList}));
        }
    }

    useEffect(() => {
        LoadRoomList(userInfo?._id);
        LoadInvitationList(userInfo?._id)
    }, [userInfo]);

    useEffect(() => {
        socket.on('pingOnlineState', (data) => {
            dispatch(SetOnlineUsers({data}));
        });
        return () => {
            socket.off('pingOnlineState', currentRoomId);
        };
    });

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const action = snackbarId => (
        <>
            <button onClick={() => { closeSnackbar(snackbarId) }}>
                x
            </button>
        </>
    );
    useEffect(() => {
        socket.on('receive-invitation', (data) => {
            console.log(data)
            enqueueSnackbar('New Invitation from ' + data.from.username, {action})
            dispatch(ReceiveInvitationAction(data))
        })
        return () => {
            socket.off('receive-invitation')
        }
    }, [])
    useEffect(() => {
        LoadChatRoom(currentRoomId);
        socket.emit('join', currentRoomId);
        return () => {
            socket.emit('un-join', currentRoomId);
        };
    }, [currentRoomId]);

    return (
        <div>
            <div className={styles.container}>
                {chatListOpen && (
                    <ChatList socket={socket} chatListOpen={chatListOpen} toggleChatList={toggleChatList}/>
                )}
                <ChatBox socket={socket} chatListOpen={chatListOpen} toggleChatList={toggleChatList}/>
            </div>
        </div>);
}

export default ChatInterface;
