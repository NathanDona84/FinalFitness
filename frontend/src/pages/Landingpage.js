import React from 'react';
import { Link } from 'react-router-dom';

export function LandingPage() {
    return (
        <div className='landingContainer'>
            <div className="banner">
                <div className="left-content">Final Fitness</div>
                <div className="right-content">
                    <Link to={`/login`} className='bannerButton'>Login</Link>
                </div>
            </div>
            <div className='landingBody'>
                <div className="content">
                    <div className='contentButtonContainer'>
                        <Link to={`/register`} className='landingPageCreateAccountButton'>Click Here To Start Your Journey</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}