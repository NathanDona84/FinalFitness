import React from 'react';
import { render } from '@testing-library/react';
import NutritionPage from '../pages/NutritionPage';

describe('SettingsPage Component', () => {
    it('renders without crashing', () => {
        render(<NutritionPage />);
    });
});