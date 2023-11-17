import React, { useState } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import './styles.css';
import LoginPage from './pages/LoginPage';
import NutritionPage from './pages/NutritionPage';
import { LandingPage } from './pages/Landingpage';

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
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage pageType="signIn"/>} />
                <Route path="/register" element={<LoginPage pageType="signUp"/>} />
                <Route path="/nutrition" element={<NutritionPage />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;