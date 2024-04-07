import React, {useEffect, useState} from 'react';
import clsx from "clsx";
import styles from './list.module.css';
import {useDispatch, useSelector} from "react-redux";
import CreateRoomModal from "../../modals/CreateRoomModal";
import {SetCurrentRoomAction, LoadRoomListAction, LoadChatRoomAction} from "../../redux/actions/chatAction";
import {
    AcceptInvitation,
    GetRoomListOfUser,
    GetInvitationById,
    GetRoomInfo,
    GetMessageListInRoom
} from "../../services/chat.service";

const SideBar = ({socket, chatListOpen, toggleChatList}) => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.auth.user);
    const roomList = useSelector((state) => state.chat.roomList);
    const currentRoomId = useSelector((state) => state.chat.currentRoomId);
    const invitationList = useSelector((state) => state.chat.invitationList);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [inviteList, setInviteList] = useState([]);
    const [inviteBoxIsOpen, setInviteBoxIsOpen] = useState(false);
    let subtitle;

    function openModal() {
        setIsOpen(true);

    }

    function afterOpenModal() {
        subtitle.style.color = '#00A67E';
    }

    function handleConversation(room) {

    }

    async function handleAcceptInvitation(inviteId) {
        try{
            const response = await AcceptInvitation(inviteId);
            if(response){
                const roomInfo = await GetRoomInfo(response.roomId._id)
                const messageList = await GetMessageListInRoom(response.roomId._id);
                const roomList = await GetRoomListOfUser(userInfo._id);
                dispatch(LoadRoomListAction({roomList}));
                dispatch(SetCurrentRoomAction({roomId: response.roomId._id}));
                dispatch(LoadChatRoomAction({roomInfo, messageList}));
            }
        }catch (e) {

        }
    }

    async function handleCreateNewRoom(data) {
        try {

        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    function handleRoomName(e) {
        // setRoomName(e.target.value);
    }

    function closeModal() {
        setIsOpen(false);
        // setUserFoundInfo({});
    }

    useEffect(() => {
        socket.on('receive-invitation', (data) => {
            // console.log(data)
            // setTypingUser(data);
        })
        return () => {
            socket.off('receive-invitation')
        }
    }, [])
    return (
        <div>
            <CreateRoomModal
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                handleRoomName={handleRoomName}
                createNewRoom={handleCreateNewRoom}
            />
            <div className={clsx(styles.chat_list, {[styles.open]: chatListOpen === true})}>
                <div className={styles.menu_chat}>
                    <div className={styles.chat_list_navigation}>
                        <button className={styles.navigation_createNewChat} onClick={openModal}>Create new chat
                        </button>
                        <button className={styles.navigation_closeChat}
                                onClick={() => {
                                    toggleChatList();
                                }}
                        >
                            <ion-icon name="log-out-outline"></ion-icon>
                        </button>
                    </div>
                    <div className={styles.chat_list_conversationList}>
                        <ul>
                            {roomList.map(function (room) {
                                const opponent = room?.name.split(',');
                                const slice = opponent.splice(opponent.indexOf(userInfo?.username), 1)
                                return (<li onClick={() => {
                                    dispatch(SetCurrentRoomAction({roomId: room._id}))
                                }}
                                            className={clsx(styles.conversationList_conversations, {[styles.current_conversation]: room._id === currentRoomId})}>
                                    <ion-icon name="chatbox-outline"></ion-icon>
                                    {room.name}</li>)
                            })}
                        </ul>
                    </div>
                </div>

                <div className={styles.user_navigation}
                     onClick={() => {
                         setInviteBoxIsOpen(!inviteBoxIsOpen);
                     }}
                >
                    <div className={clsx(styles.user_notification, {[styles.hide]: inviteBoxIsOpen === false})}>
                        Invitations
                        <ul style={{padding: '1px'}}>
                            {invitationList.length > 0 && invitationList.map(function (invite) {
                                return (
                                    <li style={{backgroundColor: '#3b3b3b', padding: '10px 4px', marginBottom: '5px'}}>
                                        <form className={styles.user_invitations_tags}
                                              onSubmit={async (e) => {
                                                  e.preventDefault()
                                                  await handleAcceptInvitation(invite._id)
                                              }}>
                                             <span>
                                                 <b>From: </b>
                                                 {/*<img src={invite.from.profilePicture}/>*/}
                                                 <p>{invite.from.username}</p>
                                             </span>
                                            <button type={"submit"}>
                                                <ion-icon name="person-add-outline"></ion-icon>
                                            </button>

                                        </form>
                                        <p style={{margin: 0}}><b>Room: </b> {invite.roomId.name}</p>
                                    </li>)

                            })}
                        </ul>
                    </div>
                    <div className={styles.user_info}>
                        <img src={userInfo?.profilePicture}/>
                        <p>{userInfo?.username}</p>
                    </div>

                    <a href={'/profile/user-info'}>
                        <ion-icon name="settings-outline"></ion-icon>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
