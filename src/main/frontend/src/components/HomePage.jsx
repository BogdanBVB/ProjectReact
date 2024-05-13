import React from 'react';
import {Link} from 'react-router-dom';

function HomePage() {

    return (
        <div className="nav-container">
            <h1 className="welcome-title">Welcome to GBRO Internet Banking Application</h1>
            <nav>
                <Link to="/new-customer" className="link-button">Register your account</Link>
                <Link to="/log-in" className="link-button"> Login into your account</Link>
            </nav>
        </div>

    );
}

export default HomePage;

// <div className="nav-container">
//     <h1 className="title">Welcome to GBRO Internet Banking Application</h1>
//     <nav>
//         <Link to="/new-customer" className="link-button">Register your account</Link>
//         <Link to="/log-in" className="link-button">Login into your account</Link>
//     </nav>
// </div>
