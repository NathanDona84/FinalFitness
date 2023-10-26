import React, { useState } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import './styles.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

export function buildPath(route){
    if(process.env.NODE_ENV == 'production')
        return 'https://finalfitness-8c822bac59a3.herokuapp.com/' + route;
    else
        return 'http://localhost:5000/' + route;
}



function App() {
    const [userId, setUserId] = useState(-1);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage userId={userId} setUserId={setUserId}/>} />
                <Route path="/home" element={<HomePage userId={userId} setUserId={setUserId}/>} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;