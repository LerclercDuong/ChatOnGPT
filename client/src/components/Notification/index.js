import {Snackbar} from "@mui/joy";
import React from "react";

const Notification = ({socket, data}) => {
    const [state, setState] = React.useState({
        open: true,
        vertical: 'bottom',
        horizontal: 'right',
    });
    const {vertical, horizontal, open} = state;

    const handleClick = (newState) => () => {
        setState({...newState, open: true});
    };

    const handleClose = () => {
        setState({...state, open: false});
    };
    return (
        <Snackbar
            anchorOrigin={{vertical, horizontal}}
            open={open}
            onClose={handleClose}
            autoHideDuration={4000}
            key={vertical + horizontal}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                textAlign: 'left',
                alignItems: 'start',
                marginBottom: 15
            }}
        >
            <b>{data.roomName}</b>
            <div style={{textAlign: 'left'}}>
                <b>{data.sender}: </b>{data.content}
            </div>
        </Snackbar>
    )

}

export default Notification