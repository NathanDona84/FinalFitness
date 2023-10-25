import React from 'react';
import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import CardUI from '../components/CardUI';
const HomePage = () => {
    return (
        <div style={{ backgroundColor: 'rgba(255, 69, 0, 0.2)' }}>
            <PageTitle />
            <LoggedInName />
            <CardUI />
        </div>
    );
}
export default HomePage;