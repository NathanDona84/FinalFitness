import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './LoginPage';

test('renders LoginPage component', () => {
    render(
        <Router>
            <LoginPage />
        </Router>
    );

    // You can use assertions to ensure that specific elements are present
    expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
    expect(screen.getByText('To continue your fitness journey, please log in!')).toBeInTheDocument();
    // Add more assertions based on the content and structure of your component
});

