import React, { useState, useEffect } from "react";
import {buildPath} from '../App.js';
import { Link } from "react-router-dom";
import axios from 'axios';
import "../styles.css";
import { jwtDecode } from "jwt-decode";

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
                    setLogin(0);
                    if(response["data"]["id"] == -1){
                        setMessage(response["data"]["error"]);
                    }
                    else{
                        localStorage.setItem('accessToken', response["data"]["token"]["accessToken"]);
                        let decoded = jwtDecode(response["data"]["token"]["accessToken"], {complete: true});
                        let info = Object.assign({}, decoded);
                        localStorage.setItem('user_data', JSON.stringify(info));
                        window.location.href = '/nutrition';
                    }
                })
        }
    }, [login]); 

    return (
        <div className="form-container sign-in-container">
            <div className="wasForm">
                <h1 className='signInTitle'>Sign in</h1>
                <div id="loginResult">{message}</div>
                <div className="signInLabelContainer"><label className='emailLabel'>Email</label></div>
                <input className="signInput" type="text" placeholder="Email" name="email" id="email" 
                    onChange={(e) => {setEmail(e.target.value);}}
                />
                <div className="signInLabelContainer"><label>Password</label></div>
                <input className="signInput" id="password" type="password" name="password" placeholder="Password"
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                <a className="forgotPassword" href="/forgot_password">Forgot your password?</a>
                <button className="signInButton" onClick={() => {setLogin(1)}}>Sign In</button>
            </div>
        </div>
    );
}

