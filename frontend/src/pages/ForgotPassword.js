import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles.css";
import { buildPath } from '../App.js';
import axios from 'axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const generateRandomPassword = () => {
        const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        const numberChars = "0123456789";
        const specialChars = "!@#$%&_+?";

        const getRandomChar = (charset) => charset.charAt(Math.floor(Math.random() * charset.length));

        let randomPassword =
            getRandomChar(uppercaseChars) +
            getRandomChar(lowercaseChars) +
            getRandomChar(numberChars) +
            getRandomChar(specialChars);

        const remainingChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&_+?";
        for (let i = 4; i < 8; i++) {
            randomPassword += remainingChars.charAt(Math.floor(Math.random() * remainingChars.length));
        }
        return randomPassword.split("").sort(() => Math.random() - 0.5).join("");
    };

    const handleResetPassword = () => {

        const tempPassword = generateRandomPassword();
        axios
            .post(buildPath('api/forgotPassword'),
            {
                "email": email,
                "password": tempPassword
            })
            .then((response) => {
                if (response["data"]["error"] == "") {
                   
                    setMessage("Temporary Password has been sent to your Email");
                }
                else {
                    setMessage(response["data"]["error"]);
                }
            })
        console.log(`Temporary password: ${tempPassword}`);
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-form">
                <h1>Reset Your Password</h1>
                <p>Enter your email address below to reset your password.</p>
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleResetPassword}>Reset Password</button>
                <p className="reset-password-message">{message}</p>

                <Link to="/login">Back to Login</Link>
            </div>
        </div>
    );
}