import React, { useState } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import './styles.css';
import LoginPage from './pages/LoginPage';
import NutritionPage from './pages/NutritionPage';
import { LandingPage } from './pages/Landingpage';
import SettingsPage from "./pages/Settingspage";
import ForgotPassword from "./pages/ForgotPassword"
import WorkoutsPage from "./pages/WorkoutsPage";
import CalendarPage from "./pages/CalendarPage";

export function buildPath(route){
    if(process.env.NODE_ENV == 'production')
        return 'https://finalfitness-8c822bac59a3.herokuapp.com/' + route;
    else
        return 'http://localhost:5000/' + route;
}



function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage pageType="signIn"/>} />
                <Route path="/register" element={<LoginPage pageType="signUp"/>} />
                <Route path="/nutrition" element={<NutritionPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/forgot_password" element={<ForgotPassword />} />
                <Route path="/exercise" element={<WorkoutsPage />}/>
                <Route path="/calendar" element={<CalendarPage />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;