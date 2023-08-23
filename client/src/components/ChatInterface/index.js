import { useRef, useState, useEffect } from 'react';
import clsx from "clsx";
import React from 'react';
import styles from './interface.module.css';
import { Navigate } from "react-router-dom";
import Modal from 'react-modal';
import isAuth from '../../utils/isAuth';
import socketIOClient from "socket.io-client";
import getUser from "../../utils/getUser";
import getUserByID from '../../utils/getUserByID';
import getConversation from '../../utils/getConversation';
import getMessages from "../../utils/getMessages";
import sendInvitation from '../../utils/sendInvitation';
import getInvitation from '../../utils/getInvitation';
import createConversation from '../../utils/createConversation';

const customStyles = {
  content: {
    top: '30%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#444654',
    color: '#FFFFFF'
  },
};

const ChatInterface = ({ socket }) => {
  console.log(process.env)
  //login states
  const [isLoggedIn, setisLoggedIn] = useState(null);
  const tokenID = localStorage.getItem('tokenID');
  //users states
  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState({});
  //find target user to create conversation states
  const [modalIsOpen, setIsOpen] = useState(false);
  const [userFoundInfo, setUserFoundInfo] = useState({});
  const [userFound, setUserFound] = useState("");
  const [inviteStatus, setInviteStatus] = useState("");
  //user notification box (invatations, ...)
  const [inviteIsOpen, setInviteIsOpen] = useState(false);
  const [invitationList, setInvitationList] = useState([]);
  //message and conversation states
  const [messageList, setMessageList] = useState([]);
  const [conversationID, setConversationID] = useState("");
  const [conversationList, setConversationList] = useState([]);
  //scroll ref
  const messagesEndRef = useRef(null)

  const [message, setMessage] = useState("");

  let subtitle;

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#00A67E';
  }

  function closeModal() {
    setIsOpen(false);
    setUserFoundInfo({});
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  });
  // Run the effect only once on component mount
  isAuth(tokenID)
  useEffect(() => {
    socket.on('toClient', (data) => {
      setMessageList((prev) =>
        [...prev, data]
      )
    })
    return () => {
      socket.off('toClient')
    }
  }, [])

  async function getUserInfo(username) {
    const userInfo = await getUser(username);
    if (userInfo.data) {
      setUserInfo(userInfo.data);
    }
  }

  async function getConversationList(username) {
    const conversations = await getConversation(username);
    if (conversations) {
      setConversationList(conversations.data);
      if (conversations.data[0]) {
        setConversationID(conversations.data[0]._id);
      }
    }
    socket.emit('join', conversationID);
  }

  async function getInvitationList(username) {
    const invitations = await getInvitation(username);
    if (invitations) {
      console.log(invitations)
      setInvitationList(invitations.data);
    }
  }

  useEffect(() => {
    async function checkAuth() {
      const userInfo = await isAuth(tokenID);
      if (!userInfo.username) {
        setisLoggedIn(false)
      } else {
        setisLoggedIn(true);
        setUsername(userInfo.username)
        getUserInfo(userInfo.username);
        getConversationList(userInfo.username);
        getInvitationList(userInfo.username);
      }
    }
    checkAuth();
  }, [])
  useEffect(() => {
    socket.emit('join', conversationID);
    async function getAllMessages() {
      const messages = await getMessages(conversationID);
      if (messages) {
        setMessageList(messages.data);
      }
    }
    getAllMessages();
    return () => {
      socket.emit('un-join', conversationID);
    };
  }, [conversationID])

  if (isLoggedIn === false) {
    return <Navigate to="/login" replace />;
  }



  function handleSendMessage(e) {
    setMessage(e.target.value)
  }

  async function handleFindUser(e) {
    e.preventDefault();
    const userInfo = await getUser(userFound);
    if (userInfo.data) {
      setUserFoundInfo(userInfo.data);
    }
  }

  function handleFindUserName(e) {
    setUserFound(e.target.value)
  }
  // useEffect(()=>{

  // })
  function handleTime() {
    var date = new Date();
    var clock;
    if (date.getMinutes() < 10) {
      clock = `${date.getHours() + ':0' + date.getUTCMinutes()}`
    } else {
      clock = `${date.getHours() + ':' + date.getUTCMinutes()}`
    }
    return clock;
  }

  function sendMessage() {
    const currentTime = handleTime();
    if (message) {
      const messagePacket = {
        sender: username,
        conversation: conversationID,
        content: message,
        profilePicture: userInfo.profilePicture
      }
      if (messagePacket.sender === username) {
        setMessageList((prev) =>
          [...prev, messagePacket]
        )
      }
      socket.emit("sendMessage", { messagePacket, conversationID });

    }
    setMessage("");
  }

  function handleConversation(e) {
    setConversationID(e._id);
  }

  async function handleSendInvitation(target) {
    const data = {
      from: username,
      to: target
    }
    const status = await sendInvitation(data);
    if (status.message) {
      setInviteStatus(status.message)
    }
  }

  async function handleAcceptInvitation(data) {
    // stopPropagation();
    const participants = [];
    participants.push(username);
    participants.push(data.fromUserName)
    async function createNewConversation() {
      const messages = await createConversation({participants});
      if (messages) {
        console.log(messages)
      }
    }
    createNewConversation();

  }
  return (
    <div>
      <Modal
        className={styles.createConversationModal}
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Create conversation</h2>
        {/* <button onClick={closeModal}>close</button> */}
        <form onSubmit={handleFindUser}>
          <input type="text" placeholder="Enter name" onChange={handleFindUserName}></input>
          <div className={styles.user_found}>
            <ul>
              {userFoundInfo.username &&
                <li>
                  <span>
                    <img src={userFoundInfo.profilePicture}></img>
                    <p>{userFoundInfo.username}</p>
                  </span>
                  <button onClick={() => handleSendInvitation(userFoundInfo.username)}><ion-icon name="person-add-outline"></ion-icon></button>
                </li>
              }
            </ul>
            <button className={styles.createConversationButton}>Creating confirm</button>
          </div>
        </form>
      </Modal>
      <div className={styles.container}>
        <div className={styles.chat_list}>
          <div>
            <div className={styles.chat_list_navigation}>
              <button className={styles.navigation_createNewChat} onClick={openModal}>Create new chat</button>
              <button className={styles.navigation_closeChat}><ion-icon name="log-out-outline"></ion-icon></button>
            </div>
            <div className={styles.chat_list_conversationList}>
              <ul>
                {conversationList.map(function (conversation) {
                  const opponent = conversation.name.split(',');
                  const slice = opponent.splice(opponent.indexOf(username), 1)
                  return (
                    <li onClick={() => handleConversation(conversation)}
                      className={clsx(styles.conversationList_conversations, { [styles.current_conversation]: conversation._id === conversationID })}>
                      <ion-icon name="chatbox-outline"></ion-icon>
                      {opponent}</li>
                  )
                })}
              </ul>
            </div>
          </div>

          <div className={styles.user_navigation}>
            <div className={styles.user_notification}>
              Invitations
              <ul>
                {invitationList.map(function(invitation){
                  return (
                    <li className={styles.user_invitations_tags}>
                      <span>
                        <img src={invitation.fromProfilePicture} />
                        <p>{invitation.fromUserName}</p>
                      </span>
                      <button onClick= {() => handleAcceptInvitation(invitation)}><ion-icon name="person-add-outline"></ion-icon></button>
                    </li>
                  )

                })}
              </ul>
            </div>
            <div className={styles.user_info}>
              <img src={userInfo.profilePicture} />
              <p>{username}</p>
            </div>
            <ion-icon name="settings-outline"></ion-icon>
          </div>
        </div>
        <div className={styles.chat_box}>
          <div className={styles.chat_content}>
            <ul>
              {messageList.map(function (message, index) {
                return (
                  <li className={clsx(styles.chat_content_messages, { [styles.opponent]: message.sender === username })}>
                    <div className={styles.messages_wrapper}>
                      <img src={message.profilePicture} alt={message.profilePicture}
                        className={clsx(styles.chat_avatar, { [styles.hide]: index >= 1 && message.sender == messageList[index - 1].sender })} />
                      {/* <p>{message.username}</p> */}
                      <p className={styles.messages_content}> {message.content} <span className={styles.message_time}>{message.timestamp} by {message.sender}</span></p>
                    </div>
                  </li>
                )
              })}

            </ul>
            <div ref={messagesEndRef} />
          </div>
          <form className={styles.chat_box_prompt} >
            <textarea className={styles.prompt_textArea} wrap="soft"
              onKeyDown={function (e) {
                // Enter was pressed without shift key
                if (e.keyCode == 13 && !e.shiftKey) {
                  // prevent default behavior
                  e.preventDefault();
                  sendMessage();
                }
              }}
              onChange={handleSendMessage}
              placeholder="Send a message"
              value={message}></textarea>
            <div className={styles.prompt_sendButton} onClick={sendMessage}><ion-icon name="send-outline"></ion-icon></div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
