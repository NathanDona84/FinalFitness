import React, { useState, useEffect } from "react";
import {buildPath} from '../App.js';
import axios from 'axios';
import "../styles.css";

export default function SignUp(props) {
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [register, setRegister] = useState(0);

    useEffect(() => {
        if(firstName == "" && register == 1){
            setMessage("First Name Cannot Be Empty");
            setRegister(0);
        }
        else if(lastName == "" && register == 1){
            setMessage("Last Name Cannot Be Empty");
            setRegister(0);
        }
        else if(email == "" && register == 1){
            setMessage("Email Cannot Be Empty");
            setRegister(0);
        }
        else if(password == "" && register == 1){
            setMessage("Password Cannot Be Empty");
            setRegister(0);
        }
        else if(register == 1){
            setMessage("");
            axios
                .post(buildPath('api/register'),
                    {
                        "firstName": firstName,
                        "lastName": lastName,
                        "email": email,
                        "password": password
                    })
                .then((response) => {
                    if(response["data"]["inserted"] == -1){
                        setMessage(response["data"]["error"]);
                        setRegister(0);
                    }
                    else{
                        setMessage("Account Created");
                        setRegister(0);
                    }
                })
        }
    }, [register]); 

    return (
        <div className="form-container sign-up-container">
            <div className="wasForm">
                <h1>Create Account</h1>
                <span style={{display: "inline-block"}}>or use your email for registration</span>
                <label>First Name</label>
                <input  type="text" name="fname" placeholder="First Name" 
                    onChange={(e) => {setFirstName(e.target.value)}}
                />
                <label>Last Name</label>
                <input type="text" name="lname" placeholder="Last Name"
                    onChange={(e) => {setLastName(e.target.value)}}
                />
                <label>Email:</label>
                <input type="email" name="email" placeholder="Email"
                    onChange={(e) => {setEmail(e.target.value)}}
                />
                <label>Password</label>
                <input type="password" name="password" placeholder="Password"
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                <button onClick={() => {setRegister(1)}}>Sign Up</button>
                <span id="loginResult">{message}</span>
            </div>
        </div>
    );
}

