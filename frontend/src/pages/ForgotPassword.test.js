import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';  // Import MemoryRouter

import ForgotPassword from './ForgotPassword';

describe('ForgotPassword Component', () => {
    it('renders without crashing', () => {
        render(
            <MemoryRouter>
                <ForgotPassword />
            </MemoryRouter>
        );
    });
});
