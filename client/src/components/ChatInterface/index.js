import {useRef, useState, useEffect} from 'react';
import clsx from "clsx";
import React from 'react';
import styles from './interface.module.css';
import useScrollDirection from '../../hooks/useScrollDirection.js';
import isAuth from '../../utils/isAuth';
import CreateRoomModal from '../../modals/CreateRoomModal';
import callAPI from "../../utils/callAPI";
import timeFormat from "../../utils/timeFormat";

const {createNewRoom, getRoom, getMessages, findUser, getInvite} = callAPI;

const ChatInterface = ({socket, onlineState}) => {
    // console.log("this is chat component")
    // setIsLoading(pre => ({...pre, name:5765}))
    //login states
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState([])
    const typingTimerRef = useRef(null);
    //users states
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
    const [inviteList, setInviteList] = useState([]);
    //message and conversation states
    const [addMemberBox, setAddMemberBox] = useState(false);
    const [messageList, setMessageList] = useState([]);
    const [roomId, setRoomId] = useState("");
    const [currentRoomInfo, setCurrentRoomInfo] = useState({});
    const [roomList, setRoomList] = useState([]);
    //scroll ref
    const messagesEndRef = useRef(null)
    const chatBoxRef = useRef(null);
    const chatBoxScroll = useScrollDirection(chatBoxRef);
    const [message, setMessage] = useState("");
    const [imageDataURL, setImageDataURL] = useState([]);
    const onPaste = (event) => {
        event.preventDefault();
        let imageAdded = false; // Flag to track if an image has been added

        const clipboardData = event.clipboardData || window.clipboardData;
        const items = clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const imageFile = items[i].getAsFile();
                processImage(imageFile);
            }
        }

    };

    const processImage = (imageFile) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const image = new Image();
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const maxWidth = 800; // Set the maximum width for the resized image
                const maxHeight = 800; // Set the maximum height for the resized image
                let width = image.width;
                let height = image.height;

                // Calculate the new width and height while maintaining the aspect ratio
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, width, height);

                const resizedImage = canvas.toDataURL('image/jpeg', 0.8); // Convert the resized image to base64 string

                setImageDataURL((prev) => {
                    const newImage = resizedImage;

                    // Check if the newImage is not already in the array
                    if (!prev.includes(newImage)) {
                        return [...prev, newImage];
                    } else {
                        return prev; // Return the current array without changes
                    }
                });
            };
            image.src = event.target.result;
        };
        reader.readAsDataURL(imageFile);
    };
    console.log(imageDataURL)
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


    useEffect(() => {
        console.log(onlineState)
    }, onlineState)


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
        messagesEndRef.current.scrollIntoView({behavior: "smooth"})
    }

    useEffect(() => {
        scrollToBottom()
    });

    const tokenId = localStorage.getItem('tokenId');
    // Run the effect only once on component mount
    // isAuth(tokenId)
    useEffect(() => {
        socket.on('pingMessage', (data) => {
            setMessageList((prev) =>
                [...prev, data]
            )
        })
        return () => {
            socket.off('pingMessage')
        }
    }, [])

    async function getUserInfo(username) {
        const userInfo = await findUser(username);
        if (userInfo.data) {
            setUserInfo(userInfo.data);
        }
    }

    async function getRoomList(username) {
        const rooms = await getRoom(username);
        if (rooms) {
            setRoomList(rooms.data.roomList);
            if (rooms.data.roomList[0]) {
                setRoomId(rooms.data.roomList[0]._id);
                setCurrentRoomInfo(rooms.data.roomList[0])
            }
        }
        socket.emit('join', roomId);
    }

    async function getInviteList(username) {
        const invitations = await getInvite(username);
        if (invitations) {
            setInviteList([...invitations.data]);
        }
    }

    useEffect(async () => {
        async function checkAuth() {
            const userInfo = await isAuth(tokenId);
            if (!userInfo.data) {
                setIsLoggedIn(false)
            } else {
                setIsLoggedIn(true);
                await getUserInfo(userInfo.data);
                await getRoomList(userInfo.data);
                await getInviteList(userInfo.data);
            }
        }

        if (tokenId) {
            await checkAuth();
        }
    }, [])
    //update dom when join room
    // useEffect(async () => {
    //     async function update() {
    //         await getRoomList(userInfo.username);
    //         await getInviteList(userInfo.username);
    //     }
    //     await update();
    //
    // }, [roomId])
    useEffect(() => {
        socket.emit("setUsername", userInfo.username);
        return () => {
            socket.on('disconnect');
        };
    }, [userInfo])

    useEffect(() => {
        socket.emit('join', roomId);

        async function getAllMessages() {
            const messages = await getMessages(roomId);
            if (messages) {
                setMessageList(messages.data);
            }
        }

        getAllMessages();
        return () => {
            socket.emit('un-join', roomId);
        };
    }, [roomId])

    function handleSendMessage(e) {
        setMessage(e.target.value)
        if (typingTimerRef.current) {
            clearTimeout(typingTimerRef.current);
        }

        // Set isTyping to true and start a timer to emit "isTyping" after a delay
        setIsTyping(true);

        // Emit "isTyping" after a delay (e.g., 1000ms or 1 second)
        typingTimerRef.current = setTimeout(() => {
            if (e.target.value.length > 0) {
                let data = {
                    username: userInfo.username,
                    roomId: roomId,
                };
                socket.emit("isTyping", data);
            }
            if (e.target.value.length === 0) {
                let data = {
                    username: userInfo.username,
                    roomId: roomId,
                };
                socket.emit("isNotTyping", data);
            }
            setIsTyping(false); // User is no longer typing
        }, 200); // Adjust the delay as needed (e.g., 1000ms = 1 second)
    }

    useEffect(() => {
        socket.on('pingIsTyping', (data) => {
            console.log(data)
            setTypingUser(data);
        })
        return () => {
            socket.off('pingIsTyping')
        }
    }, [])

    async function handleFindUser() {
        const userInfo = await findUser(userFoundName);
        if (userInfo.data) {
            setUserFoundInfo(userInfo.data);
        }
    }



    function sendMessage() {
        if (message) {
            const messagePacket = {
                sender: userInfo.username,
                senderData: userInfo._id,
                roomId: roomId,
                content: message,
                images: imageDataURL
            }
            let data = {
                username: userInfo.username,
                roomId: roomId,
            };
            socket.emit("isNotTyping", data);
            socket.emit("message", {messagePacket});
        }
        setMessage("");
        setImageDataURL([]);
    }

    function handleConversation(e) {
        setScrollDirection(null)
        setRoomId(e._id);
        setCurrentRoomInfo(e)
    }

    async function handleSendInvite(target) {
        const data = {
            roomId: roomId,
            from: userInfo.username,
            target: target
        }
        socket.emit("invite", data)
    }

    useEffect(() => {
        socket.on("pingInvite", async (data) => {
            async function update() {
                await getInviteList(data.target);
            }
            await update();
        })
        return () => {
            socket.off("pingInvite");
        };
    }, []);

    function handleRoomName(e) {
        setRoomName(e.target.value);
    }

    async function handleCreateNewRoom(data) {
        try {
            // Assuming 'username' is defined somewhere
            const participants = [userInfo.username];
            const messages = await createNewRoom({roomName, participants});
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    async function handleAcceptInvitation(data) {
        const {roomId, target, from} = data;
        try {
            socket.emit("joinRoom", {roomId, target, from})
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    useEffect(() => {
        socket.on("pingJoinRoom", async (data) => {
            console.log(data)
            const {roomId} = data;

            async function update() {
                await getRoomList(userInfo.username);
                await getInviteList(userInfo.username);
            }

            await update();
        })
        return () => {
            socket.off("pingJoinRoom");
        };
    }, []);
    return (
        <div>
            <CreateRoomModal
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                handleRoomName={handleRoomName}
                createNewRoom={handleCreateNewRoom}
            />
            <div className={styles.container}>
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
                                    return (
                                        <li onClick={() => handleConversation(room)}
                                            className={clsx(styles.conversationList_conversations, {[styles.current_conversation]: room._id === roomId})}>
                                            <ion-icon name="chatbox-outline"></ion-icon>
                                            {room.name}</li>
                                    )
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
                                {inviteList.length > 0 &&  inviteList.map(function (invite) {
                                    return (
                                        <li >
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

                                        </li>
                                    )

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
                <div className={styles.chat_box}>
                    <div className={clsx(styles.chat_box_bar, {[styles.fly]: scrollDirection === "up"})}>
                        <div className={styles.bar_padding}></div>
                        <button className={styles.navigation_openChatListButton}
                                onClick={() => {
                                    setChatListOpen(true);
                                }}
                        >
                            <ion-icon name="log-out-outline"></ion-icon>
                        </button>
                        <p>{currentRoomInfo.name}</p>
                        <div className={styles.add_member}>
                            {/* cross button  */}
                            <ion-icon name="add-outline"
                                      onClick={() => {
                                          setUserBoxIsOpen(!userBoxIsOpen);
                                      }}
                            ></ion-icon>
                            <div
                                className={clsx(styles.add_member_box, {[styles.hide]: userBoxIsOpen === false || scrollDirection === "up"})}>
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
                                    <button>
                                        <ion-icon name="search-outline"></ion-icon>
                                    </button>
                                </form>
                                {userFoundInfo.username && (
                                    <ul>
                                        <li className={styles.user_adding_tags}>
                      <span>
                        <img src={userFoundInfo.profilePicture} alt="User Avatar"/>
                        <p>{userFoundInfo.username}</p>
                      </span>
                                            <button
                                                onClick={() => {
                                                    handleSendInvite(userFoundInfo.username)
                                                }}
                                            >
                                                <ion-icon name="person-add-outline"></ion-icon>
                                            </button>
                                        </li>
                                    </ul>
                                )}

                            </div>
                        </div>

                    </div>
                    <div className={clsx(styles.chat_content, {[styles.expand]: imageDataURL.length !== 0})}
                         ref={chatBoxRef}
                    >
                        <ul>
                            <p className={styles.createRoomStatus}>{currentRoomInfo.name} was created</p>
                            {messageList.map(function (message, index) {
                                return (
                                    <li className={clsx(styles.chat_content_messages, {[styles.opponent]: message.sender === userInfo.username})}>
                                        <div className={styles.messages_wrapper}>
                                            <img src={message.senderData.profilePicture}
                                                 className={clsx(styles.chat_avatar, {[styles.hide]: index >= 1 && message.sender == messageList[index - 1].sender})}/>
                                            {/* <p>{message.username}</p> */}
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "flex-start",
                                                flexDirection: "column"
                                            }}>
                                                <p className={styles.messages_content}> {message.content} <span
                                                    className={styles.message_time}>{timeFormat(message.timestamp)} by {message.sender}</span>
                                                </p>
                                                {message.images.length !== 0 && (
                                                    <div className={styles.message_image_wrapper}>
                                                        {(message.images).map(function (url, imageIndex) {
                                                            return (
                                                                // <LazyLoadImage src={Image}
                                                                //                width={600} height={400}
                                                                //                alt="Image Alt"
                                                                // />
                                                                <img
                                                                    src={url}
                                                                    className={styles.message_image}
                                                                />
                                                            )
                                                        })}
                                                    </div>
                                                )}

                                            </div>


                                        </div>
                                    </li>
                                )
                            })}
                            {typingUser.map(function (data, index) {
                                if (data.roomId === roomId && data.username !== userInfo.username) {
                                    return (
                                        <h4 className={styles.isTypingStatus}>{data.username} is typing...</h4>
                                    )
                                }
                            })}
                            <div ref={messagesEndRef}/>
                        </ul>

                    </div>

                    <form className={styles.chat_box_prompt} draggable onDrag={onPaste}>
                        {imageDataURL.length !== 0 && (
                            <div className={styles.image_preview}>
                                {imageDataURL.map(function (url, imageIndex) {
                                    return (
                                        <div style={{position: "relative"}}>
                                            <img src={url} alt="Pasted Image" className={styles.images}/>
                                            <button className={styles.delete_image}
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        setImageDataURL((prev) => prev.filter((_, index) => index !== imageIndex));
                                                    }}
                                            >
                                                <ion-icon name="close-circle-outline"></ion-icon>
                                            </button>
                                        </div>

                                    )
                                })}
                            </div>
                        )}
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
                                  ref={(ref) => {
                                      if (ref) {
                                          ref.addEventListener('paste', onPaste);
                                      }
                                  }}

                                  placeholder="Send a message"
                                  value={message}>

                        </textarea>

                        <div className={styles.prompt_sendImage}>
                            <ion-icon name="image-outline"></ion-icon>
                        </div>
                        <div className={styles.prompt_sendButton} onClick={sendMessage}>
                            <ion-icon name="send-outline"></ion-icon>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default ChatInterface;
