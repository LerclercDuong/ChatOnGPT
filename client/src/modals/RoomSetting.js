import * as React from 'react';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import {ListDivider, ListItem, ListItemDecorator, ModalClose, Sheet} from "@mui/joy";
import Tab from '@mui/material/Tab';
import Box from '@mui/joy/Box';
import Typography from "@mui/joy/Typography";
import TuneIcon from '@mui/icons-material/Tune';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Avatar from "@mui/joy/Avatar";
import List from '@mui/joy/List';
import {useEffect, useState} from "react";
import CircleIcon from '@mui/icons-material/Circle';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import {GetUsersByUsername} from "../services/user.service";
import {SnackbarProvider, useSnackbar} from 'notistack';
import {
    LogoutAction
} from "../redux/actions/authAction";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {RemoveAccessToken, RemoveRefreshToken} from "../utils/tokens";

function MembersList() {
    const onlineUsers = useSelector((state) => state.chat.onlineUsers.data);
    const participants = useSelector((state) => state.chat.roomInfo?.participants);

    useEffect(() => {
        console.log(participants)
        console.log(onlineUsers)
    });

    function isOnline(username) {
        for (const user of onlineUsers) {
            if (user.username === username) return true;
        }
        return false; // Username does not exist in onlineUsers
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                overflowY: 'scroll',
                maxHeight: 1,
                justifyContent: 'space-between',
                gap: 1,
            }}
        >
            <Typography level="body-xs" sx={{
                ml: 2
            }}>
                <p>All members</p>
            </Typography>
            <List
                variant="plain"
                sx={{
                    width: 1,
                    borderRadius: 'sm',
                }}
            >
                {participants && participants.map((participant, index) => (
                    <React.Fragment key={index}>
                        <ListItem sx={{display: 'flex', justifyContent: 'space-between'}}>

                            <ListItemDecorator sx={{color: 'white'}}>
                                <Avatar sx={{mr: 1}} size="sm" src={participant?.profilePicture}
                                        alt={participant?.username}/>
                                {participant?.username}
                            </ListItemDecorator>

                            {/*online*/}
                            {isOnline(participant?.username) ?
                                <Typography sx={{display: 'inline-flex', alignItems: 'center'}}>
                                    <CircleIcon sx={{color: '#00A67E', fontSize: 15}}/>Online
                                </Typography>
                                :
                                <Typography sx={{display: 'inline-flex', alignItems: 'center'}}>
                                    <CircleIcon sx={{color: '#932121', fontSize: 15}}/>Offline
                                </Typography>}

                            {/*offline*/}

                        </ListItem>
                        {index < participants.length - 1 && <ListDivider inset={'default'}/>}
                    </React.Fragment>
                ))}

            </List>
        </Box>
    );
}

function InviteTab({socket}) {
    const loginUser = useSelector((state) => state.auth.user);
    const onlineUsers = useSelector((state) => state.chat.onlineUsers.data);
    const participants = useSelector((state) => state.chat.roomInfo?.participants);
    const currentRoomId = useSelector((state) => state.chat.currentRoomId);
    //search user
    const [usersFound, setUsersFound] = React.useState(null);
    const [searchName, setSearchName] = React.useState('');
    const [isSearching, startSearching] = React.useTransition();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    async function SearchUser() {
        try {
            const result = await GetUsersByUsername(searchName);
            if (result) {
                startSearching(() => {
                    setUsersFound(result.filter(user => user._id !== loginUser._id))
                })
            }
        } catch (e) {

        }
    }

    async function SendInvitation(target) {
        const packet = {
            from: loginUser._id,
            to: target._id,
            roomId: currentRoomId
        }
        socket.emit('send-invitation', packet)
    }

    useEffect(() => {
        socket.on('invitationSuccess', (data) => {
            enqueueSnackbar(data.message, {variant: 'success', autoHideDuration: 1000})
        })
        return () => {
            socket.off('invitationSuccess')
        }
    }, [])
    useEffect(() => {
        socket.on('invitationFailed', (data) => {
            enqueueSnackbar(data.message, {variant: 'error', autoHideDuration: 1000})
        })
        return () => {
            socket.off('invitationFailed')
        }
    }, [])

    function isOnline(username) {
        for (const user of onlineUsers) {
            if (user.username === username) return true;
        }
        return false; // Username does not exist in onlineUsers
    }


    return (
        <>
            {
                !currentRoomId ? (<p>Create room first</p>) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            overflowY: 'scroll',
                            maxHeight: 1,
                            justifyContent: 'space-between',
                            gap: 1,
                        }}
                    >

                        <Typography level="body-xs" sx={{
                            ml: 1
                        }}>
                            <p>Invite users</p>
                            <Box sx={{display: 'flex', gap: 1}}>
                                <Input onChange={(e) => {
                                    setSearchName(e.target.value)
                                }} placeholder="Find user by name" sx={{backgroundColor: 'black', color: 'white'}}/>
                                <Button sx={{backgroundColor: '#00A67E'}} onClick={SearchUser}><SearchIcon/></Button>
                            </Box>
                        </Typography>
                        <List
                            variant="plain"
                            sx={{
                                ml: 1
                            }}
                        >
                            {usersFound && usersFound.map((participant, index) => (
                                <React.Fragment key={index}>
                                    <ListItem sx={{display: 'flex', justifyContent: 'space-between', p: 0}}>

                                        <ListItemDecorator sx={{color: 'white'}}>
                                            <Avatar sx={{mr: 1}} size="sm" src={participant?.profilePicture}
                                                    alt={participant?.username}/>
                                            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                                                {participant?.username}
                                                {isOnline(participant?.username) ?
                                                    <Typography sx={{display: 'inline-flex', alignItems: 'center'}}>
                                                        <CircleIcon sx={{color: '#00A67E', fontSize: 15}}/>Online
                                                    </Typography>
                                                    :
                                                    <Typography sx={{display: 'inline-flex', alignItems: 'center'}}>
                                                        <CircleIcon sx={{color: '#932121', fontSize: 15}}/>Offline
                                                    </Typography>}
                                            </Box>

                                        </ListItemDecorator>
                                        {/*online*/}

                                        <Button
                                            sx={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                backgroundColor: 'black'
                                            }}
                                            onClick={() => SendInvitation(participant)}
                                        ><AddIcon/></Button>
                                        {/*offline*/}

                                    </ListItem>

                                    {index < participants.length - 1 && <ListDivider inset={'default'}/>}
                                </React.Fragment>
                            ))}

                        </List>
                    </Box>

                )
            }
        </>
    )

}

function SettingTab() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function HandleLogout() {
        RemoveRefreshToken()
        RemoveAccessToken()
        dispatch(LogoutAction())
        // navigate('/introduction')
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                overflowY: 'scroll',
                maxHeight: 1,
                justifyContent: 'space-between',
                gap: 1,
            }}
        >

            <Typography level="body-xs" sx={{
                ml: 1
            }}>
                <p>Setting</p>

            </Typography>
            <Button onClick={HandleLogout}>
                Logout
            </Button>
        </Box>
    );
}

export default function RoomSettingModal({socket}) {

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <React.Fragment>
            <TuneIcon color='white' onClick={() => setOpen(true)}/>
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={open}
                onClose={() => setOpen(false)}
                sx={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff',
                }}
            >
                <Box sx={{
                    width: 300, height: 400, maxWidth: 600,
                    typography: 'body1', color: '#fff', backgroundColor: 'black', borderRadius: 2,
                }}>
                    <TabContext value={value} sx={{color: 'white', overflowY: 'scroll'}}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider', color: 'white'}}>
                            <TabList
                                onChange={handleChange}
                                sx={{color: 'white', borderColor: 'white'}}
                                aria-label="lab API tabs example"
                                textColor='inherit'
                                indicatorColor="primary"
                            >
                                <Tab sx={{color: 'white'}} label="Members" value="1"/>
                                <Tab sx={{color: 'white'}} label="Invite" value="2"/>
                                <Tab sx={{color: 'white'}} label="Setting" value="3"/>
                            </TabList>
                        </Box>
                        <TabPanel value="1" sx={{padding: '5px', height: 0.8}}>
                            <MembersList/>
                        </TabPanel>
                        <TabPanel value="2" sx={{padding: '5px', height: 0.8}}>
                            <InviteTab socket={socket}/>
                        </TabPanel>
                        <TabPanel value="3" sx={{padding: '5px', height: 0.8}}><SettingTab/></TabPanel>
                    </TabContext>
                </Box>
            </Modal>
        </React.Fragment>
    )
        ;
}