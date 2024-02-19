import {googleLogout,GoogleLogin,useGoogleLogin  } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
function Login(){

    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
      });
      
    const [ user, setUser ] = useState([]);
    const [ profile, setProfile ] = useState(null);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });
    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                       
                        setProfile(res.data);
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );

    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        setProfile(null);
    };
    const test = () => {
    
        console.log(profile);};
    return (
       <div><ThemeProvider theme={darkTheme}>
 <AppBar position="static">    <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              
    justifyContent: 'center',
              
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              textAlign: 'center', 
              width: '100%'
            }}
          >
            Duty Sync
          </Typography>
</AppBar>            
            <CssBaseline />
      <Container maxWidth="sm">
        <Box component="section" sx={{ bgcolor: '#48484a', height: '70vh' }} >
        
           
           <h3>Login </h3>
        {profile ? (
                <div>
                    <img src={profile.picture} alt="user image" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <br />
                    <button onClick={logOut}>Log out</button>
                </div>
            ) : (
                <button onClick={() => login()}>Sign in with Google  </button>
            )}</Box>
      </Container>
      </ThemeProvider>
        </div>
    );

}
export default Login;