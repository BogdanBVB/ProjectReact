import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

function DashboardForm() {
    const [rates, setRates] = useState({});
    const [customerName, setCustomerName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [todayDate, setTodayDate] = useState(new Date().toLocaleDateString());

    useEffect(() => {
        async function fetchData() {
            try {
                const ratesResponse = await axios.get('http://localhost:8080/api/exchange?base=RON');
                setRates(ratesResponse.data.rates);
                const userDetailsResponse = await axios.get('http://localhost:8080/api/session/user-details');
                setCustomerName(userDetailsResponse.data.name);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data.');
                setLoading(false);
            }
        }
        fetchData();
    }, [navigate]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    function handleLogout() {
        axios.post('http://localhost:8080/api/logout')
            .then(() => {
                localStorage.removeItem('authToken');
                navigate('/');
            })
            .catch(error => {
                console.error('Logout failed:', error);
                setError('Logout failed. Please try again.');
            });
    }
    return (
        <div className="dashboard-container">
            {customerName && (
                <h1 className="welcome-title">Welcome {customerName} to your internet banking application</h1>
            )}
            <div className="navigation-container">
                <Link to="/currentAccounts" className="link-button">Current Accounts</Link>
                <Link to="/savingsAccounts" className="link-button">Savings Accounts</Link>
                <Link to="/payments" className="link-button">Transfers / Payments</Link>
                <Link to="/statements" className="link-button">Account Statements</Link>
                <Link to="/exchange" className="link-button">Currency Exchange</Link>
            </div>
            <div className="date-container">
                <h4>Today's Date: {todayDate}</h4>
            </div>
            <div className="rates-container">
                <h4>Currency Exchange Rates</h4>
                {rates && (
                    <>
                        <p>1 EUR equals {(1 / rates['EUR']).toFixed(4)} RON</p>
                        <p>1 USD equals {(1 / rates['USD']).toFixed(4)} RON</p>
                        <p>1 GBP equals {(1 / rates['GBP']).toFixed(4)} RON</p>
                        <p>1 HUF equals {(1 / rates['HUF']).toFixed(4)} RON</p>
                    </>
                )}
            </div>
            <div className="logout-button-container">
                <button onClick={handleLogout} className="button-danger">Log Out</button>
            </div>
        </div>

    );
}

export default DashboardForm;