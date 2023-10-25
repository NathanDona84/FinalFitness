import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import './styles.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
function App() {
    return (
        <Router >
            <Switch>
                <Route path="/" exact>
                    <LoginPage />
                </Route>
                <Route path="/home" exact>
                    <HomePage />
                </Route>
                <Redirect to="/" />
            </Switch>
        </Router>
    );
}
export default App;