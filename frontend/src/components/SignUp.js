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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
            setMessage(`Password must have ${requirementsNotMet.join(', ')}.`);
        }

        return isPasswordValid;
    }

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
        else if(email != "" && register == 1 && !emailRegex.test(email)){
            setMessage("Enter a valid Email");
            setRegister(0);
        }
        else if(password == "" && register == 1){
            setMessage("Password Cannot Be Empty");
            setRegister(0);
        }
        else if (password != "" && register == 1 && !validatePassword(password)){
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
                <label>First Name</label>
                <input className="signInput" type="text" name="fname" placeholder="First Name" 
                    onChange={(e) => {setFirstName(e.target.value)}}
                />
                <label>Last Name</label>
                <input className="signInput" type="text" name="lname" placeholder="Last Name"
                    onChange={(e) => {setLastName(e.target.value)}}
                />
                <label>Email:</label>
                <input className="signInput" type="email" name="email" placeholder="Email"
                    onChange={(e) => {setEmail(e.target.value)}}
                />
                <label>Password</label>
                <input className="signInput" type="password" name="password" placeholder="Password"
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                <button className="signUpButton" onClick={() => {setRegister(1)}}>Sign Up</button>
                <span id="loginResult">{message}</span>
            </div>
        </div>
    );
}