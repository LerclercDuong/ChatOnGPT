import React, {useEffect} from 'react';
import axios from 'axios';
import {Navigate, useNavigate} from "react-router-dom";
import { useState } from 'react';
import styles from './signUp.module.css';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import {LoginWithUsernameAndPassword, SignUp} from "../../services/auth.service";
import {LoginSuccess,} from "../../redux/actions/authAction";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "notistack";
function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Chat On Gpt
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme({
    palette: {
        primary: {
            main: '#00A67E',
        },
        secondary: {
            main: '#00A67E',
        },
    },
});
const SignUpPage = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const information = {
            username: data.get('email'),
            password: data.get('password'),
            repeatPassword: data.get('repeatPassword'),
        }

        try {
            const loginData = await SignUp(information?.username, information?.password, information?.repeatPassword);
            if(loginData){
                enqueueSnackbar('Register success, go to login', {variant: 'success'});
            }
        } catch (error) {
            enqueueSnackbar(error.message, {variant: 'error'})
        }
    };

    // useEffect(() => {
    //     if (isAuthenticated === true) {
    //         navigate('/')
    //     }
    // });

    function handleSignUp(e) {
        e.preventDefault();
    }
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 7,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Username"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="repeatPassword"
                            label="Repeat Password"
                            type="password"
                            id="repeatPassword"
                            autoComplete="current-password"
                        />
                        {/*<FormControlLabel*/}
                        {/*    control={<Checkbox value="remember" color="primary"/>}*/}
                        {/*    label="Remember me"*/}
                        {/*/>*/}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Sign Up
                        </Button>
                        {/*<button*/}
                        {/*    type="submit"*/}
                        {/*    style={{width: '100%', backgroundColor: '#00A67E'}}*/}
                        {/*    // fullWidth*/}
                        {/*    // variant="contained"*/}
                        {/*    // sx={{mt: 3, mb: 2}}*/}
                        {/*>*/}
                        {/*    Sign In*/}
                        {/*</button>*/}
                        <Grid container>
                            {/*<Grid item xs>*/}
                            {/*    <Link href="#" variant="body2">*/}
                            {/*        Forgot password?*/}
                            {/*    </Link>*/}
                            {/*</Grid>*/}
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    {"Already have an account, login now"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </ThemeProvider>
    );

}

export default SignUpPage;
