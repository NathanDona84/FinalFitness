import React from 'react';
import NavDrawer from '../components/NavDrawer';


export default function HomePage(props){
    let _ud = localStorage.getItem('user_data');
    let ud = JSON.parse(_ud);
    let userId = ud.id;
    let firstName = ud.firstName;
    let lastName = ud.lastName;

    return (
        <div>
            <NavDrawer />
            {userId}
        </div>
    );
}
