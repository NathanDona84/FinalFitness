import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LandingPage } from './LandingPage';

test('renders LandingPage component', () => {
    render(
        <BrowserRouter>
            <LandingPage />
        </BrowserRouter>
    );

    // You can use various queries from '@testing-library/react' to assert the presence of certain elements
    expect(screen.getByText('Final Fitness')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Click Here To Start Your Journey')).toBeInTheDocument();
});
