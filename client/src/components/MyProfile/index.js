import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import FileUpload from "./FileUpload";
import {useEffect, useState} from "react";
import {UpdateUser, GetUserById} from '../../services/user.service'
import {useSelector} from "react-redux";
import {styled} from "@mui/joy";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/joy/Stack";
import AspectRatio from "@mui/joy/AspectRatio";
import IconButton from "@mui/joy/IconButton";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import {useSnackbar} from "notistack";
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
export default function MyProfile() {
    const userInfo = useSelector((state) => state.auth.user);
    const [selectedImage, setSelectedImage] = useState(null);
    useEffect(() => {
        console.log()
        setSelectedImage(userInfo?.profilePicture)
    }, []);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const updateData = {
            profilePicture: data.get('profilePicture'),
        }
        try {
            const result = await UpdateUser(userInfo._id, data);
            if(result){
                enqueueSnackbar('Update successfully', {variant: 'success', autoHideDuration: 1000})
            }

        } catch (error) {
            enqueueSnackbar('Update fail', {variant: 'error'})
        }
    };
    const { enqueueSnackbar } = useSnackbar();



    return (
        <div>
            <Grid container spacing={1} >
                <Grid item xs={12} md={4}>
                    {selectedImage && (
                        <Avatar
                            alt="Remy Sharp"
                            src={typeof selectedImage === 'string' ? selectedImage : URL.createObjectURL(selectedImage)}
                            sx={{ width: 240, height: 240 }}
                        />
                    )}

                    {!selectedImage && (<Avatar
                        alt="Remy Sharp"
                        src=""
                        sx={{width: 240, height: 240}}
                    />)}
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Username"
                            name="email"
                            value={userInfo.username}
                            autoFocus
                        />
                        <input
                            type="file"
                            id="profilePicture"
                            name="profilePicture"
                            onChange={(event) => {
                                console.log(event.target.files[0]);
                                setSelectedImage(event.target.files[0]);
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2, backgroundColor: '#00A67E'}}
                        >
                            Save
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </div>

    );
}