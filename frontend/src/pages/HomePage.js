import React from 'react';
import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import CardUI from '../components/CardUI';

export default function HomePage(props){
    return (
        <div>
            <PageTitle />
            <LoggedInName />
            <CardUI />
        </div>
    );
}
