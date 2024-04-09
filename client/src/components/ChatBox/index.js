import styles from './chatbox.module.css';
import React, {useEffect, useRef, useState} from 'react';
import RoomSettingModal from "../../modals/RoomSetting";
import timeFormat from "../../utils/timeFormat";
import EmojiPicker from "emoji-picker-react";
import useScrollDirection from "../../hooks/useScrollDirection";
import clsx from "clsx";
import {useDispatch, useSelector} from "react-redux";
import {ReceiveMessageAction} from "../../redux/actions/chatAction";
import _, {debounce} from "lodash";
import Notification from "../Notification";
import IconButton from "@mui/joy/IconButton";
import { styled } from "@mui/joy";
import Avatar from "@mui/material/Avatar";
import Skeleton from "./skeleton";
const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;
const ChatBox = ({socket, onlineState, toggleChatList, chatListOpen}) => {
    const catMenu = useRef(null)
    const inputRef = useRef();
    const userInfo = useSelector((state) => state.auth.user);
    const currentRoomInfo = useSelector((state) => state.chat.roomInfo);
    const messageList = useSelector((state) => state.chat.messageList);
    const dispatch = useDispatch();
    //login states
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState([]);
    const typingTimerRef = useRef(null);
    const [roomId, setRoomId] = useState("");
    //scroll ref
    const messagesEndRef = useRef(null);
    const chatBoxRef = useRef(null);
    const chatBoxScroll = useScrollDirection(chatBoxRef);
    const [message, setMessage] = useState('');
    const [imageDataURL, setImageDataURL] = useState([]);
    const [emojiPicker, setEmojiPicker] = useState(false);

    const closeOpenMenus = (e)=>{
        if(emojiPicker && !catMenu.current?.contains(e.target)){
            setEmojiPicker(false)
        }
    }
    document.addEventListener('mousedown',closeOpenMenus)

    const debouncedOnPaste = debounce((event) => {
        let imageAdded = false; // Flag to track if an image has been added
        const clipboardData = event.clipboardData || window.clipboardData;
        const items = clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const imageFile = items[i].getAsFile();
                processImage(imageFile);
            }
        }
    }, 500, {
        'leading': true,
        'trailing': false
    }); // Adjust the debounce time as needed (e.g., 500 milliseconds)
    useEffect(()=>{
        return ()=>{
            setImageDataURL([])
        }
    }, [])
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.addEventListener('paste', debouncedOnPaste);
        }
        // Cleanup: remove event listener when the component unmounts
        // return () => {
        //     if (inputRef.current) {
        //         inputRef.current.removeEventListener('paste', debouncedOnPaste);
        //     }
        // };
    }, [debouncedOnPaste]); // Ensure the effect runs when debouncedOnPaste changes

    const processImage = (imageFile) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const image = new Image();
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const maxWidth = 720; // Set the maximum width for the resized image
                const maxHeight = 900; // Set the maximum height for the resized image
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

                const resizedImage = canvas.toDataURL('image/jpeg', 0.6); // Convert the resized image to base64 string

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

    let subtitle;

    const [scrollDirection, setScrollDirection] = useState(null);

    useEffect(() => {
        let lastScrollY = chatBoxRef.current.scrollTop;
        const updateScrollDirection = () => {
            const scrollY = chatBoxRef?.current.scrollTop;
            const direction = scrollY > lastScrollY ? "down" : "up";
            if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
                setScrollDirection(direction);
            }
            lastScrollY = scrollY > 0 ? scrollY : 0;
        };
        chatBoxRef.current.addEventListener("scroll", updateScrollDirection); // add event listener
        // return () => {
        //     chatBoxRef.current.removeEventListener("scroll", updateScrollDirection); // clean up
        // }
    });


    useEffect(() => {
        // console.log(onlineState)
    }, onlineState)


    const scrollToBottom = () => {
        chatBoxRef.current.scrollTop = (messagesEndRef?.current.offsetTop);
    }

    useEffect(() => {
        scrollToBottom()
    }, [currentRoomInfo._id, messageList.length]);

    // Run the effect only once on component mount
    // isAuth(tokenId)
    useEffect(() => {
        socket.on('pingMessage', (data) => {
            // setMessageList((prev) => [...prev, data])
        })
        return () => {
            socket.off('pingMessage')
        }
    }, [])


    function HandleTypingMessage(e) {
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
                    username: userInfo.username, roomId: roomId,
                };
                socket.emit("isTyping", data);
            }
            if (e.target.value.length === 0) {
                let data = {
                    username: userInfo.username, roomId: roomId,
                };
                socket.emit("isNotTyping", data);
            }
            setIsTyping(false); // User is no longer typing
        }, 200); // Adjust the delay as needed (e.g., 1000ms = 1 second)
    }

    useEffect(() => {
        socket.on('pingIsTyping', (data) => {
            // console.log(data)
            setTypingUser(data);
        })
        return () => {
            socket.off('pingIsTyping')
        }
    }, [])


    function sendMessage() {
        if (message.length > 0 || imageDataURL.length > 0) {
            const messagePacket = {
                sender: userInfo.username,
                senderData: userInfo._id,
                roomId: currentRoomInfo._id,
                content: message,
                images: imageDataURL
            }
            let data = {
                username: userInfo.username, roomId: roomId,
            };
            socket.emit("isNotTyping", data);
            socket.emit("message", messagePacket);
            socket.emit("notification", messagePacket)
        }
        setMessage('');
        setImageDataURL([]);

    }

    useEffect(() => {
        socket.on('pingMessage', (data) => {
            dispatch(ReceiveMessageAction(data));
        })
        return () => {
            socket.off('pingMessage')
        }
    }, [])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            let data = {
                username: userInfo.username,
                roomId: currentRoomInfo._id,
            };
            socket.emit("isNotTyping", data);
        }, 700)
        let data = {
            username: userInfo.username,
            roomId: currentRoomInfo._id,
        };
        socket.emit("isTyping", data);
        return () => clearTimeout(delayDebounceFn)
    }, [message])

    useEffect(() => {
        socket.on("pingTypingUser", (data) => {
            setTypingUser(data)
        });
        return () => {
            socket.off('pingTypingUser');
        };
    }, [userInfo])

    function handleTypingMessage(e) {
        setMessage(e.target.value)
    }

    function srcset(image, size, rows = 1, cols = 1) {
        return {
            src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
            srcSet: `${image}?w=${size * cols}&h=${
                size * rows
            }&fit=crop&auto=format&dpr=2 2x`,
        };
    }
    const [showNotification, setShowNotification] = useState(false);
    const [notification, setNotification] = useState(null);
    useEffect(() => {
        socket.on('ping-notification', (data) => {
            setShowNotification(true);
            setNotification(data);
        })
        return () => {
            socket.off('ping-notification')
        }
    }, [])


    // Close notification after a delay
    useEffect(() => {
        const notificationTimer = setTimeout(() => {
            setShowNotification(false);
        }, 4000); // Adjust the delay as needed
        return () => clearTimeout(notificationTimer);
    }, [showNotification]);
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            processImage(selectedFile); // Process the selected image file
        }
    };

    return (
        <div className={styles.chat_box}>
            {showNotification && <Notification data={ notification } />}
            <div className={clsx(styles.chat_box_bar, {[styles.fly]: scrollDirection === "up" && messageList.length > 10})}>
                {chatListOpen && (<div className={styles.bar_padding}></div>)}
                {!chatListOpen && (
                    <button className={styles.navigation_openChatListButton}
                            onClick={() => {
                                toggleChatList();
                            }}
                    >
                        <ion-icon name="log-out-outline"></ion-icon>
                    </button>
                )}

                <p>{currentRoomInfo?.name}</p>
                <div className={styles.add_member}>
                    <RoomSettingModal socket={socket}/>
                </div>
            </div>
            <div className={clsx(styles.chat_content, {[styles.expand]: imageDataURL.length !== 0})}
                 ref={chatBoxRef}
            >
                <ul>
                    <p className={styles.createRoomStatus}>{currentRoomInfo?.name} was created</p>
                    {messageList?.map(function (message, index) {
                        return (
                            <li className={clsx(styles.chat_content_messages, {[styles.opponent]: message.sender === userInfo.username})}>
                                <div className={styles.messages_wrapper}>
                                    <img src={message?.senderData?.profilePicture} alt={message.senderData.username}
                                         className={clsx(styles.chat_avatar, {[styles.hide]: index >= 1 && message.sender == messageList[index - 1].sender})}/>
                                    <div style={{
                                        display: "flex", justifyContent: "flex-start", flexDirection: "column"
                                    }}>
                                        <p className={styles.messages_content}> {message.content}
                                            <span
                                                className={styles.message_time}>  {timeFormat(message.timestamp)} by {message.sender}</span>
                                        </p>
                                        {message.images.length !== 0 && (
                                            <div className={styles.message_image_wrapper}>
                                                {(message.images).map(function (url, imageIndex) {
                                                    return (
                                                        <img
                                                            src={url}
                                                            className={styles.message_image}
                                                        />)
                                                })}
                                            </div>)}
                                    </div>
                                </div>
                            </li>)
                    })}

                    <div/>

                </ul>
                <div ref={messagesEndRef}></div>
            </div>
            {typingUser.map(function (data, index) {
                if (data.roomId === currentRoomInfo._id && data.username !== userInfo.username) {
                    return (<h4 className={styles.isTypingStatus}>{data.username} is typing...</h4>)
                }
            })}
            <form className={styles.chat_box_prompt}>
                {imageDataURL?.length !== 0 && (<div className={styles.image_preview}>
                    {imageDataURL.map(function (url, imageIndex) {
                        return (<div style={{position: "relative"}}>
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
                </div>)}
                <textarea className={styles.prompt_textArea} wrap="soft"
                          onKeyDown={function (e) {
                              // Enter was pressed without shift key
                              if (e?.keyCode === 13 && !e.shiftKey) {
                                  // prevent default behavior
                                  e.preventDefault();
                                  sendMessage();
                              }
                          }}
                          onChange={handleTypingMessage}
                          ref={inputRef}
                          placeholder="Send a message"
                          value={message}>
                        </textarea>
                <div className={styles.prompt_feature_area}>

                    <div ref={catMenu} className={styles.prompt_emoji}>
                        {emojiPicker && <EmojiPicker
                            className={styles.emojiPicker}
                            onEmojiClick={(emoji, event) => {
                                setMessage((prev) => prev + emoji.emoji);
                            }}
                        />}
                        <ion-icon name="happy-outline"
                                  onClick={() => {
                                      setEmojiPicker(!emojiPicker);
                                  }}
                        ></ion-icon>
                    </div>
                    <div className={styles.prompt_image} onClick={handleClick}>
                        <ion-icon name="image-outline"> </ion-icon>
                        <input
                            type="file"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={(e) => {
                                // Handle file selection logic here
                                if (e?.target?.files) {
                                processImage(e.target.files[0]);}
                            }}
                        />
                    </div>
                    <div className={styles.prompt_sendButton}>
                        <ion-icon name="send-outline" onClick={sendMessage}></ion-icon>
                    </div>
                </div>

            </form>

        </div>
    );
}

export default ChatBox;