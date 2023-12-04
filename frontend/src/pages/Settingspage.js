import React, { useEffect, useState } from 'react';
import NavDrawer from '../components/NavDrawer.js';
import { buildPath } from '../App.js';
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs';
import AddNutritionMenu from '../components/AddNutritionMenu.js';
import Popover from '@mui/material/Popover';

export default function SettingsPage() {
    const [userId, setUserId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPasswordFields, setShowPasswordFields] = useState('');
    const [prevPassword, setPrevPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [updateResultMessage, setUpdateResultMessage] = useState("");
    const [navbarName, setNavBarName] = useState("");
    
    useEffect(() => {
        let _ud = localStorage.getItem('user_data');
        let ud = JSON.parse(_ud);
        let userIdTemp = ud["id"];
        setUserId(userIdTemp);
        axios
            .post(buildPath('api/fetchUser'),
                {
                    "userId": userIdTemp,
                    "accessToken": localStorage.getItem('accessToken')
                })
            .then((response) => {
                if (response["data"]["error"] == "") {
                    setFirstName(response["data"]["info"]["firstName"]);
                    setLastName(response["data"]["info"]["lastName"]);
                    setEmail(response["data"]["info"]["email"]);
                    setPassword(response["data"]["info"]["password"]);
                    setNavBarName(response["data"]["info"]["firstName"]+" "+response["data"]["info"]["lastName"]);
                    localStorage.setItem('accessToken', response["data"]["token"]["accessToken"]);
                }
                else {
                    setUpdateResultMessage(response["data"]["error"]);
                }
            })
    },[]);

    const togglePasswordFields = () => {
        setShowPasswordFields(!showPasswordFields);
        setUpdateResultMessage("");
        setNewPassword("");
        setPrevPassword("");
        setConfirmNewPassword("");
    };

    function validatePassword(password) {
        // Individual checks for uppercase, lowercase, number, and special character
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialCharacter = /[!@#$%^&*()_+]/.test(password);

        // Check if all individual requirements are met
        const isPasswordValid =
            hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter && password.length >= 8;

        // Track which specific requirements are not met
        const requirementsNotMet = [];
        if (!hasUppercase) requirementsNotMet.push('an uppercase letter');
        if (!hasLowercase) requirementsNotMet.push('a lowercase letter');
        if (!hasNumber) requirementsNotMet.push('a number');
        if (!hasSpecialCharacter) requirementsNotMet.push('a special character');
        if (password.length < 8) requirementsNotMet.push('at least 8 characters');

        // Set updateResultMessage based on the requirements not met
        if (requirementsNotMet.length > 0) {
            setUpdateResultMessage(`Password must have ${requirementsNotMet.join(', ')}.`);
        }

        return isPasswordValid;
    }

    function updateInfo() {
        if(firstName.length < 1)
        {
            setUpdateResultMessage("First Name Cannot Be Empty!");
            return;
        }
        if (lastName.length < 1)
        {
            setUpdateResultMessage("Last Name Cannot Be Empty!");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) 
        {
            setUpdateResultMessage("Invalid Email Address!");
            return;
        }

        if (showPasswordFields) {
            if (prevPassword != password) 
            {
                setUpdateResultMessage("Incorrect Previous Password!");
                return;
            }
            if(!validatePassword(newPassword))
            {
                return;
            }
            if(newPassword != confirmNewPassword)
            {
                setUpdateResultMessage("Passwords do not match!");
                return;
            }
            console.log("inside password field")
            console.log(userId, firstName, lastName, newPassword);
            setUpdateResultMessage('');
            //Here is the call to the API, there is another call beneath this one for use when the user
            // is updating their password, if they are not updating the password, then send the old password
            axios
                .post(buildPath('api/updateSettings'),
                    {
                        "userId": userId,
                        "firstName": firstName,
                        "lastName": lastName,
                        "email": email,
                        "password": newPassword,
                        "accessToken": localStorage.getItem('accessToken')
                    })
                .then((response) => {
                    if (response["data"]["error"] == "") {
                        setPassword(newPassword);
                        setNavBarName(firstName+" "+lastName);
                        localStorage.setItem('accessToken', response["data"]["token"]["accessToken"]);
                        setUpdateResultMessage("Account Updated!")
                    }
                    else {
                        setUpdateResultMessage(response["data"]["error"]);
                    }
                })
            return;
        }
        console.log("not updating password");
        console.log(userId, firstName, lastName, password);
        //Here is the call to the same API but this time with the updated passwords after verifying they meet complexity req and are matching
        axios
            .post(buildPath('api/updateSettings'),
                {
                    "userId": userId,
                    "firstName": firstName,
                    "lastName": lastName,
                    "email": email,
                    "password": password,
                    "accessToken": localStorage.getItem('accessToken')
                })
            .then((response) => {
                if (response["data"]["error"] == "") {
                    setNavBarName(firstName+" "+lastName);
                    localStorage.setItem('accessToken', response["data"]["token"]["accessToken"]);
                    setUpdateResultMessage("Account Updated!");
                }
                else {
                    setUpdateResultMessage(response["data"]["error"]);
                }
            })
    }

let settingsContainerStyle = {};
if(showPasswordFields)
    settingsContainerStyle["height"] = "750px";

let buttonStyle = {};
if(updateResultMessage.length < 58 && showPasswordFields)
    buttonStyle["marginTop"] = "25px";



return(
    <div>
        <NavDrawer page="settings" name={navbarName}/>
        <div className="mainContainer">
            <div className="settingsContainer" style={settingsContainerStyle}>
                <h2 className='titleContainer'>User Settings</h2>
                <div className='resultMessage'>{updateResultMessage}</div>
                <form id="settingsForm">
                    <div className="settingsForm">
                        <label htmlFor="firstName">First Name:</label>
                        <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>

                    <div className="settingsForm">
                        <label htmlFor="lastName">Last Name:</label>
                        <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>

                    <div className="settingsForm" style={{marginBottom: "25px"}}>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <div className='changePassContainer'>
                            <button type = "button" className="settingsChangePasswordButton" onClick={togglePasswordFields}>
                                {showPasswordFields ? 'Hide Password Fields' : 'Click Here to Change Password'}
                            </button>
                        </div>

                        {showPasswordFields && (
                            <div>
                                <div className="form-group">
                                    <label htmlFor="prevPassword">Previous Password:</label>
                                    <input type="password" id="prevPassword" value={prevPassword} onChange={(e) => setPrevPassword(e.target.value)} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="newPassword">New Password:</label>
                                    <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmNewPassword">Confirm New Password:</label>
                                    <input
                                        type="password"
                                        id="confirmNewPassword"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    />
                                </div>
                                
                            </div>
                        )} 
                    </div>
                        <div className='settingsButtonContainer' style={buttonStyle}>
                            <button type= "button" className="settingsButton" onClick={updateInfo}>Save changes</button>
                        </div>
                </form>
            </div>
        </div>
    </div>
)



}