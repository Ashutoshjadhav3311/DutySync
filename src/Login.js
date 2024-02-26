import {googleLogout,GoogleLogin,useGoogleLogin  } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';



function Login(){
const {CurrentOfiicer, setCurrentOfficer} = useState(null);

    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
      });
      const [houseDetails,setHouseDetails]=useState();
    const [housePresent,setHousePresent]=useState(null);  
    const [ user, setUser ] = useState([]);
    const [ profile, setProfile ] = useState(null);
    const [houseId, setHouseId] = useState('');
    const[houseIdtoSearch, setHouseIdtoSearch] = useState('');
    const[housemembers,setHouseMembers]=useState([]);
    const handleChange = (event) => {
      setHouseId(event.target.value);
    };
      const handleSubmit = () => {
      saveHouseID(houseId);
    };
    const handleChangeHouseId = (event) => {
      setHouseIdtoSearch(event.target.value);
    }
      
    const handleSubmitMemberAdd = () => {
      addHouseMember(houseIdtoSearch);
    }
    const saveHouseID = async () => {
      try {
        const payload = {
          Housename: houseId,
          Membername: [profile.name]
        };
    
        const response = await fetch('https://dutysyncserver.onrender.com/createHouse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
    
        if (response.status===500) {
          throw new Error('Failed to save house ID');
        }
        if(response.status===400){
          alert("HouseId already registered")
        }
        else{alert('House ID saved');}
        const data = await response.json();
        //console.log('House ID saved:', data);
      } catch (error) {
        console.error('Error saving house ID:', error.message);
      }
    };
    
    const addHouseMember = async () => { 
      try {
        const payload = {
          Housename: houseIdtoSearch,
          Membername: profile.name};
          const response = await fetch('https://dutysyncserver.onrender.com/addHouseMember', {    //https://dutysyncserver.onrender.com/addHouseMember
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
      
          if (!response.ok) {
            throw new Error('Failed to save Member name to house ');
          }
          alert('member name saved');
          const data = await response.json();
          console.log('Member saved:', data);
        } catch (error) {
          console.error('Error saving house ID:', error.message);
        }
      }

      const checkMemberinHouse = async () => {
        try {
          if (!profile) {
          console.error('Profile is null');
           return;
          }
          const response = await fetch(`http://localhost:9000/checkHouseMember/${profile.name}`, {    //`https://dutysyncserver.onrender.com/checkHouseMember/${profile.name}`
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const responseData = await response.json();
          //setHouseName(responseData.Housename);
          console.log(responseData);
          setHouseDetails(responseData);
          setHousePresent(true)
         // console.log(setHouseName)
          
          
        } catch (error) {
          console.error('Error checking house member:', error.message);
        }
      }
      

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });
    useEffect(    //using user as array dependency so when user is updated with response, code  is executed to get user details using access token
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

    useEffect(() => { // using profile as dependency since profile is set using a async function
      if (profile) {
        checkMemberinHouse(); 
      }
    }, [profile]); // Add profile to the dependency array

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
                   
                    <Button
        variant="contained"
        color="error"
        onClick={logOut}>
  Log out
</Button>

{housePresent && houseDetails.Membername ? (<div><Typography variant="h4">You are Member of HouseID: {houseDetails.Housename}</Typography>

<h2>List of House Members</h2>
      <ul>
        {houseDetails.Membername.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <Typography>Enter Number of Daily roles</Typography>
      <TextField id="outlined-basic"  variant="outlined" value={houseId}
        onChange={handleChange}
              />
              <Typography>Enter of Daily roles</Typography>

              <Typography>Enter Frequency of Daily roles</Typography>

              <Typography>Enter Tasks for "particulair" roles</Typography>
</div>
):(
<Card sx={{ minWidth: 275 }}>
      <CardContent> 
      <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <p>Create a new HouseID or join existing one</p>
     <p>Create New House Id:</p><TextField id="outlined-basic"  variant="outlined" value={houseId}
        onChange={handleChange}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}>
  Submit
</Button>
<p>Join an existing House Id</p>
<TextField id="outlined-basic"  variant="outlined" value={houseIdtoSearch}
        onChange={handleChangeHouseId}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmitMemberAdd}>
  Submit
</Button>

    </Box>
        </CardContent></Card>
)}

      
                    
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
/* <li>Show Task its date </li>
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
                */