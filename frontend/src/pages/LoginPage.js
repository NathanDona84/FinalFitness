import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"
import "../styles.css";
import SignInForm from "../components/SignIn";
import SignUpForm from "../components/SignUp"

export default function LoginPage(props) {
  const [type, setType] = useState("");
  const [message, setMessage] = useState('');
  let data = useLocation();
  const handleOnClick = text => {
    if (text !== type) {
      setType(text);
      return;
    }
  };

  useEffect(() => {
    setType(props.pageType);
  }, []);

  const containerClass = "container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="App">
      <div className={containerClass} id="container">
        <SignUpForm />
        <SignInForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To continue your fitness journey, please log in!
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button
                className="ghost "
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}