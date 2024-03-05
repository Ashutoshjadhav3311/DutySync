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
import Slider from '@mui/material/Slider';
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
    const [houseIdCreatedorSaved, setHouseIdCreatedorSaved ]= useState(null);
    const[houseIdtoSearch, setHouseIdtoSearch] = useState('');
    const[housemembers,setHouseMembers]=useState([]);
    const [jobRolesNumber, setJobRolesNumber] = useState();
    const [roleNames, setRoleNames] = useState([]);
    const [roleChangeFrequency,setRoleChangeFrequency]=useState();
    const [assignedRoles, setAssignedRoles]=useState();
  const handleJobRolesNumber = (event) => {
    setJobRolesNumber(event.target.value);
    console.log(jobRolesNumber)
  };
  const handleRoleNameChange = (e, index) => {
    const newRoleNames = [...roleNames];
    newRoleNames[index] = e.target.value;
    setRoleNames(newRoleNames);
  };

  const handleRoleChangeFrequency=(event)=>{
    setRoleChangeFrequency(event.target.value);
  }
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
        setHousePresent(true)
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
          setHousePresent(true)
          setHouseDetails(data);
         // checkMemberinHouse()
          
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
          const response = await fetch(`https://dutysyncserver.onrender.com/checkHouseMember/${profile.name}`, {    //`https://dutysyncserver.onrender.com/checkHouseMember/${profile.name}`
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const responseData = await response.json();
          //setHouseName(responseData.Housename);
          console.log("checkMemberinHouse responsedata",responseData);
          console.log("checkMemberinHouse response",response)
          setHouseDetails(responseData);
          
          setHousePresent(true)
         // console.log(setHouseName)
          
          
        } catch (error) {
          console.error('Error checking house member:', error.message);
        }
      }
      
      const saveRoles =async()=>{
        try{
          if(!housePresent){
            console.log("House not registered")
            return;
          }
          console.log("rolesnames:",roleNames)
          console.log("housename:",houseDetails.Housename)
          const payload = {
            Housename: houseDetails.Housename,
            RolesNames: roleNames,
            Frequency:roleChangeFrequency
          };
      
          const response = await fetch('https://dutysyncserver.onrender.com/saveRoles', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
          console.log("resposne",response)
          if (!response.ok) {
            throw new Error('Failed to save Roles to HouseID ');
          }
          alert(`Roles saved to HouseID:${houseDetails.Housename}`);
        }
        catch (error) {
          console.error('Error checking house member:', error.message);
        }
      }

      const leaveHouse = async () => {
        try {
          const payload = {
            Housename: houseDetails.Housename,
            Membername: profile.name
          };
          console.log(houseDetails.Housename)
          const response = await fetch("https://dutysyncserver.onrender.com/removeHouseMember", {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'

            },
            body: JSON.stringify(payload)
          });
          console.log(response.status)
          if (response.status===200) {
            alert('You have left the house');
          setHousePresent(false); // Reset the state to hide the house details
          
          return
          }
          else{throw new Error('Failed to leave the house');}
           
        } catch (error) {
          console.error('Error leaving the house:', error.message);
        }
      };
      const assignroles = async()=>{
      try{
        const payload = {
          Housename: houseDetails.Housename
        };
        const response = await fetch('https://dutysyncserver.onrender.com/assignRolesToHouseMembers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
          console.log("resposne",response)
          if (response.status===404) {
            alert(`Roles not found for house ${houseDetails.Housename}` );
            throw new Error('Failed to Assign Roles to HouseID ');
          }
          if (response.status===500) {
            alert(`Internal Server error` );
          }
          alert("Roles assigned to house members successfully")
          
      }
      catch{

      }
      }
      const getroles =async()=>{
        try{
          const response = await fetch(`https://dutysyncserver.onrender.com/getroles/${houseDetails.Housename}`, {    //`https://dutysyncserver.onrender.com/checkHouseMember/${profile.name}`
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
          
        });
        const responseData = await response.json();
        console.log(responseData)
        setAssignedRoles(responseData)
        
        }
        
        catch{
          console.error('Error getting house roles');
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
     
      <Button  variant="contained"
        color="primary"onClick={leaveHouse}>Leave House</Button>
      <Typography>Enter Number of Daily roles</Typography>
      <Slider
        size="large"
        defaultValue={1}
        aria-label="Small"
        valueLabelDisplay="on"
        min={1}
        max={25}
        value={jobRolesNumber} onChange={handleJobRolesNumber} 
      />
     
     
              <Typography>Enter Names of Daily roles</Typography>
              {Array.from({ length: jobRolesNumber }, (_, index) => (
          <div key={index}>
            <label htmlFor={`roleName${index + 1}`}>Role Name {index + 1}:</label>
            <input 
              type="text" 
              id={`roleName${index + 1}`} 
              name={`roleName${index + 1}`} 
              value={roleNames[index]} 
              onChange={(e) => handleRoleNameChange(e, index)}
            />
          </div>
        ))}
              <Typography>Enter Frequency of Daily roles in terms of days</Typography>
              <input 
              type="number" 
                min={1}
              value={roleChangeFrequency} 
              onChange={handleRoleChangeFrequency}
            />
              <Typography>Enter Tasks for "particulair" roles</Typography>
              <Button variant="contained"
        color="primary" onClick={saveRoles}>Submit</Button>
              <Button variant="contained"
        color="primary"  onClick={assignroles}>Assign roles</Button>
        <Button variant="contained"
        color="primary"  onClick={getroles}>Display roles</Button>
              
              {assignedRoles ? (
  <div>
    <h2>Assigned Roles</h2>
    <ul>
  
    {Object.entries(assignedRoles).map(([key, value]) => {
      // Check if the key is "members"
      if (key === 'members') {
        // Iterate over the members array
        return value.map((member) => (
          <li key={member.membername}>
            <strong>{member.membername}</strong> - Role: {member.role}, Start Date: {member.startDate}, End Date: {member.endDate}
          </li>
        ));
      }
      return null; // Skip rendering for other keys
    })}
  
    </ul>
  </div>
) : (
  <p>No assigned roles available.</p>
)}

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
