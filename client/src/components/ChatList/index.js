import {useState, useEffect} from 'react';
import clsx from "clsx";
import React from 'react';
import styles from './list.module.css';
import axios from 'axios';

import React, {useState, useEffect} from 'react';
import axios from 'axios';

const ChatList = () => {
    const [message, setMessage] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [authenticated, setAuthenticated] = useState(localStorage.getItem('authenticated'));


    return (
        <div>
            <div className={clsx(styles.chat_list, {[styles.open]: chatListOpen === true})}>
                <div className={styles.menu_chat}>
                    <div className={styles.chat_list_navigation}>
                        <button className={styles.navigation_createNewChat} onClick={openModal}>Create new chat
                        </button>
                        <button className={styles.navigation_closeChat}
                                onClick={() => {
                                    setChatListOpen(false);
                                }}
                        >
                            <ion-icon name="log-out-outline"></ion-icon>
                        </button>
                    </div>
                    <div className={styles.chat_list_conversationList}>
                        <ul>
                            {roomList.map(function (room) {
                                const opponent = room.name.split(',');
                                const slice = opponent.splice(opponent.indexOf(userInfo.username), 1)
                                return (<li onClick={() => handleConversation(room)}
                                            className={clsx(styles.conversationList_conversations, {[styles.current_conversation]: room._id === roomId})}>
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
                        <ul>
                            {inviteList.length > 0 && inviteList.map(function (invite) {
                                return (<li>
                                    <form className={styles.user_invitations_tags}
                                          onSubmit={() => handleAcceptInvitation(invite)}>
                                             <span>
                        <img src={invite.fromProfilePicture}/>
                        <p>{invite.from.username}</p>
                        </span>
                                        <button type={"submit"}>
                                            <ion-icon name="person-add-outline"></ion-icon>
                                        </button>
                                    </form>

                                </li>)

                            })}
                        </ul>
                    </div>
                    <div className={styles.user_info}>
                        <img src={userInfo.profilePicture}/>
                        <p>{userInfo.username}</p>
                    </div>
                    <a href={'/user/setting'}>
                        <ion-icon name="settings-outline"></ion-icon>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ChatList;
