import {Snackbar} from "@mui/joy";
import React from "react";

const InvitePopup = ({socket, data}) => {
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
                alignItems: 'start'
            }}
        >
            <b>{data.from}</b>
            <div style={{textAlign: 'left'}}>
                <b>Invite to: </b>{data.roomId.name}
            </div>
        </Snackbar>
    )

}

export default InvitePopup