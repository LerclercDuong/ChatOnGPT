import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import styles from '../components/ChatInterface/interface.module.css'; // Make sure to import your CSS styles if needed
import {
    CreateNewRoom,
    GetInvitationList,
    GetMessageListInRoom,
    GetRoomInfo,
    GetRoomListOfUser
} from '../services/chat.service';
import {useDispatch, useSelector} from "react-redux";
import {enqueueSnackbar} from "notistack";
import {
    LoadChatRoomAction,
    LoadInvitationListAction,
    LoadRoomListAction,
    SetCurrentRoomAction
} from "../redux/actions/chatAction";


const customStyles = {
    content: {
        top: '30%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#444654',
        color: '#FFFFFF',
        border: 'none'
    },
    overlay: {
        background: "rgb(19, 19, 19, 0.8)"
    }
};

const CreateRoomModal = ({modalIsOpen, closeModal}) => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.auth.user);
    const [roomName, setRoomName] = useState('');

    async function Create(e) {
        e.preventDefault()
        try {
            const room = await CreateNewRoom({roomName: roomName, creator: userInfo})
            if (room) {
                const roomInfo = await GetRoomInfo(room._id)
                const messageList = await GetMessageListInRoom(room._id);
                const roomList = await GetRoomListOfUser(userInfo._id);
                const invitationList = await GetInvitationList(userInfo._id);
                dispatch(LoadRoomListAction({roomList}));
                dispatch(SetCurrentRoomAction({roomId: room._id}));
                dispatch(LoadChatRoomAction({roomInfo, messageList}));
                dispatch(LoadInvitationListAction({invitationList}));
                enqueueSnackbar('Room created', {variant: 'success', autoHideDuration: 1000})
                closeModal()
            }
        } catch (error) {
            enqueueSnackbar('Error: ' + error.message, {variant: 'error', autoHideDuration: 1000})
        }
    }

    let subtitle;

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#00A67E';
    }

    return (
        <Modal
            className={styles.createConversationModal}
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
            animationDuration={1000}
        >
            <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Create conversation</h2>
            <form onSubmit={Create} className={styles.createNewRoomForm}>
                <input type="text" placeholder="Enter room name" onChange={(e) => setRoomName(e.target.value)}
                       required/>
                <button type={'submit'} className={styles.createConversationButton}>Creating confirm</button>
            </form>
        </Modal>
    );
};

export default CreateRoomModal;
