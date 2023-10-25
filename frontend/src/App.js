import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import './styles.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
function App() {
    
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;