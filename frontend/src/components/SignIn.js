import React, { useState, useEffect } from "react";
import {buildPath} from '../App.js';
import axios from 'axios';
import "../styles.css";

export default function SignInForm(props) {
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(0);

    useEffect(() => {
        if(email == "" && login == 1){
            setMessage("Email Cannot Be Empty");
            setLogin(0);
        }
        else if(password == "" && login == 1){
            setMessage("Password Cannot Be Empty");
            setLogin(0);
        }
        else if(login == 1){
            setMessage("");
            axios
                .post(buildPath('api/login'),
                    {
                        "email": email,
                        "password": password
                    })
                .then((response) => {
                    if(response["data"]["id"] == -1){
                        setMessage(response["data"]["error"]);
                        setLogin(0);
                    }
                    else{
                        setLogin(0);
                        let infoDup = Object.assign({}, response["data"]["info"]);
                        let tracked = infoDup["tracked"];
                        delete infoDup["tracked"];
                        localStorage.setItem('user_data', JSON.stringify(infoDup));
                        localStorage.setItem('tracked', JSON.stringify(tracked));
                        window.location.href = '/nutrition';
                    }
                })
        }
    }, [login]); 

    return (
        <div className="form-container sign-in-container">
            <div className="wasForm">
                <h1>Sign in</h1>
                <label>Email</label>
                <input className="signInput" type="text" placeholder="Email" name="email" id="email" 
                    onChange={(e) => {setEmail(e.target.value);}}
                />
                <label>Password</label>
                <input className="signInput" id="password" type="password" name="password" placeholder="Password"
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                <a href="#">Forgot your password?</a>
                <button className="signInButton" onClick={() => {setLogin(1)}}>Sign In</button>
                <span id="loginResult">{message}</span>
            </div>
        </div>
    );
}

