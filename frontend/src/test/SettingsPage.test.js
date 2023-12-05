import React from 'react';
import { render } from '@testing-library/react';
import SettingsPage from '../pages/Settingspage';

describe('SettingsPage Component', () => {
    it('renders without crashing', () => {
        render(<SettingsPage />);
    });
});