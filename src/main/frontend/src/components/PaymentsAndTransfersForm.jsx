import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from "./hooks/useAuth.js";

function PaymentsAndTransfersForm() {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();
    const goToDashboard = () => {
        navigate('/dashboard');  // Navigate back to the dashboard
    };
    return (
        <div className="nav-container">
            <h1 className="welcome-title">Manage Payments and Transfers</h1>
            <nav>
                <Link to="/ownAccounts" className="link-button">Transfer between your accounts</Link>
                <Link to="/otherGBROAccounts" className="link-button"> Transfer to other GBRO accounts</Link>
                <Link to="/otherBanksAccounts" className="link-button"> Transfer to other banks</Link>
                <Link to="/utilitiesPayments" className="link-button"> Bill payments</Link>
                <Link to="/recurrentPayments" className="link-button"> Recurrent payments</Link>
            </nav>
            <div className="button-container">
                <button className="button" onClick={goToDashboard}>Back to Dashboard</button>
                <button className="button-danger" onClick={handleLogout}>Log Out</button>
            </div>
        </div>

    );
}

export default PaymentsAndTransfersForm;
