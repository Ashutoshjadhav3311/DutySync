import {googleLogout,GoogleLogin,useGoogleLogin  } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
function Login(){
const {CurrentOfiicer, setCurrentOfficer} = useState(null);

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
        
           
           
        {profile ? (
                <div>
                    <img src={profile.picture} alt="user image" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    
                <li>Show Task its date </li>
                <li>admin login to make changes</li>
                <Card sx={{ minWidth: 275 }}>
      <CardContent> <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Current officer assigned on  duty:Fromdate to ToDate
          {CurrentOfiicer}
        </Typography><Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Handover Duties:
          <li>DUty 1</li>
          <li>DUty 2</li>
            <li>DUty 3</li> 
            <li>DUty 4</li>
            <li>DUty 5</li>
            <li>DUty 6</li>
            <li>DUty 7</li>
          {CurrentOfiicer}
        </Typography><Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Handover to: on :
          <h5>Officer Name</h5>
          {CurrentOfiicer}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Next officer assigned on  duty: from Date
          {CurrentOfiicer}
        </Typography>
        </CardContent></Card>
                    <br />
                    <br />
                    <button onClick={logOut}>Log out</button>
                </div>
            ) : (
                <div><h2>Login</h2>
                <button onClick={() => login()}>Sign in with Google  </button>
                </div>
            )}</Box>
      </Container>
      </ThemeProvider>
        </div>
    );

}
export default Login;