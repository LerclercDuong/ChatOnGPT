import { useRef, useState, useEffect } from 'react';
import clsx from "clsx";
import React from 'react';
import styles from './interface.module.css';
import useScrollDirection from '../../hooks/useScrollDirection.js';
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
import CreateRoomModal from '../../modals/CreateRoomModal';
import joinRoom from '../../utils/joinRoom';

const ChatInterface = ({ socket }) => {
  //login states
  const [isLoggedIn, setisLoggedIn] = useState(null);
  const tokenID = localStorage.getItem('tokenID');
  //users states
  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState({});
  //find target user to create conversation states
  const [modalIsOpen, setIsOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [userFoundName, setUserFoundName] = useState("");
  const [userFoundInfo, setUserFoundInfo] = useState({});
  const [userFound, setUserFound] = useState("");
  const [inviteStatus, setInviteStatus] = useState("");
  const [chatListOpen, setChatListOpen] = useState(false);
  //user notification box (invatations, ...)
  const [inviteBoxIsOpen, setInviteBoxIsOpen] = useState(false);
  const [userBoxIsOpen, setUserBoxIsOpen] = useState(false);
  const [invitationList, setInvitationList] = useState([]);
  //message and conversation states
  const [addMemberBox, setAddMemberBox] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [conversationID, setConversationID] = useState("");
  const [currentRoomInfo, setCurrentRoomInfo] = useState({});
  const [conversationList, setConversationList] = useState([]);
  //scroll ref
  const messagesEndRef = useRef(null)
  const chatBoxRef = useRef(null);
  const chatBoxScroll = useScrollDirection(chatBoxRef);
  const [message, setMessage] = useState("");
  let subtitle;

  const [scrollDirection, setScrollDirection] = useState(null);

  useEffect(() => {
    let lastScrollY = chatBoxRef.current.scrollTop;
    const updateScrollDirection = () => {
      const scrollY = chatBoxRef.current.scrollTop;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };
    chatBoxRef.current.addEventListener("scroll", updateScrollDirection); // add event listener
    return () => {
      chatBoxRef.current.removeEventListener("scroll", updateScrollDirection); // clean up
    }
  });



  function openModal() {
    setIsOpen(true);
    setChatListOpen(false)
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
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
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
        setCurrentRoomInfo(conversations.data[0])
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

  async function handleFindUser() {
    const userInfo = await getUser(userFoundName);
    if (userInfo.data) {
      setUserFoundInfo(userInfo.data);
    }
  }

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
    setScrollDirection(null)
    setConversationID(e._id);
    setCurrentRoomInfo(e)
  }

  async function handleSendInvitation(target) {
    const data = {
      roomID: conversationID,
      from: username,
      to: target
    }
    const status = await sendInvitation(data);
    if (status.message) {
      console.log(status.message)
      setInviteStatus(status.message)
    }
  }
  function handleRoomName(e) {
    setRoomName(e.target.value);
  }
  async function createNewRoom(data) {
    try {
      // Assuming 'username' is defined somewhere
      const participants = [username];
      const messages = await createConversation({ roomName, participants });
      if (messages) {
        console.log(messages);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  async function handleAcceptInvitation(data) {
    try {
      const roomID = data.roomID;
      const targetID = data.target;
      // Assuming 'username' is defined somewhere

      const messages = await joinRoom({ roomID, targetID });

      if (messages) {
        console.log(messages);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    <div>
      <button className={styles.navigation_openChatListButton}
        onClick={() => {
          setChatListOpen(true);
        }}
      ><ion-icon name="log-out-outline"></ion-icon>
      </button>
      <CreateRoomModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        handleRoomName={handleRoomName}
        createNewRoom={createNewRoom}
      />

      <div className={styles.container}>
        <div className={clsx(styles.chat_list, { [styles.open]: chatListOpen === true })}>
          <div className={styles.menu_chat}>
            <div className={styles.chat_list_navigation}>
              <button className={styles.navigation_createNewChat} onClick={openModal}>Create new chat</button>
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
                {conversationList.map(function (conversation) {
                  const opponent = conversation.name.split(',');
                  const slice = opponent.splice(opponent.indexOf(username), 1)
                  return (
                    <li onClick={() => handleConversation(conversation)}
                      className={clsx(styles.conversationList_conversations, { [styles.current_conversation]: conversation._id === conversationID })}>
                      <ion-icon name="chatbox-outline"></ion-icon>
                      {conversation.name}</li>
                  )
                })}
              </ul>
            </div>
          </div>

          <div className={styles.user_navigation}
            onClick={()=>{
              setInviteBoxIsOpen(!inviteBoxIsOpen);
            }}
          >
            <div className={clsx(styles.user_notification, {[styles.hide]: inviteBoxIsOpen === false})}>
              Invitations
              <ul>
                {invitationList.map(function (invitation) {
                  return (
                    <li className={styles.user_invitations_tags}>
                      <span>
                        <img src={invitation.fromProfilePicture} />
                        <p>{invitation.fromUserName}</p>
                      </span>
                      <button onClick={() => handleAcceptInvitation(invitation)}><ion-icon name="person-add-outline"></ion-icon></button>
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
        <div className={styles.chat_box} >
          <div className={clsx(styles.chat_box_bar, { [styles.fly]: scrollDirection === "up" })}>
            <div></div>
            <p>{currentRoomInfo.name}</p>
            <div className={styles.add_member}>
              {/* cross button  */}
              <ion-icon name="add-outline"
                onClick={() => {
                  setUserBoxIsOpen(!userBoxIsOpen);
                }}
              ></ion-icon>
              <div className={clsx(styles.add_member_box, { [styles.hide]: userBoxIsOpen === false || scrollDirection === "up" })}>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleFindUser();
                }
                }>
                  <input type="text" placeholder="Enter member name" required
                    onChange={(e) => {
                      setUserFoundName(e.target.value)
                    }}
                  ></input>
                  <button><ion-icon name="search-outline"></ion-icon></button>
                </form>
                {userFoundInfo.username && (
                  <ul>
                    <li className={styles.user_adding_tags}>
                      <span>
                        <img src={userFoundInfo.profilePicture} alt="User Avatar" />
                        <p>{userFoundInfo.username}</p>
                      </span>
                      <button
                        onClick={()=>{handleSendInvitation(userFoundInfo.username)}}
                      ><ion-icon name="person-add-outline"></ion-icon></button>
                    </li>
                  </ul>
                )}

              </div>
            </div>

          </div>
          <div className={styles.chat_content}
            ref={chatBoxRef}
          >
            <ul>
              <p>{currentRoomInfo.name} was created</p>
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

            <div className={styles.prompt_sendImage}><ion-icon name="image-outline"></ion-icon></div>
            <div className={styles.prompt_sendButton} onClick={sendMessage}><ion-icon name="send-outline"></ion-icon></div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
