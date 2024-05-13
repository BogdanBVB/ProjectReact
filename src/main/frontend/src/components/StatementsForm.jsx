import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import {useAuth} from "./hooks/useAuth.js";

function StatementsForm() {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccountId, setSelectedAccountId] = useState('');
    const [statements, setStatements] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { handleLogout } = useAuth();

    useEffect(() => {
        fetchAccounts();
    }, []);
    const fetchAccounts = () => {
        axios.get('/api/ownAccounts')
            .then(response => {
                setAccounts(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch accounts:', error);
                setErrorMessage('Failed to load accounts');
            });
    };
    const fetchStatements = () => {
        axios.get(`/api/statements/${selectedAccountId}?startDate=${startDate}`)
            .then(response => {
                console.log("Received statements:", response.data);
                setStatements(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch statements:', error);
                setErrorMessage('Failed to load statements');
            });
    };
    const handleAccountChange = (e) => {
        setSelectedAccountId(e.target.value);
    };
    const handleDateChange = (e) => {
        setStartDate(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        fetchStatements();
    };
    const goToDashboard = () => {
        navigate('/dashboard');  // Navigate back to the dashboard
    };

    return (
        <div className="dashboard-container">
            <h1 className="accounts-title">Account Statements</h1>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label htmlFor="accountSelect">Select Account:</label>
                    <select
                        id="accountSelect"
                        className="form-input" // Changed from 'form-control' to 'form-input' for consistency
                        value={selectedAccountId}
                        onChange={handleAccountChange}
                        required
                    >
                        <option value="">Choose an account</option>
                        {accounts.map(account => (
                            <option key={account.id} value={account.id}>
                                {account.iban}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        className="form-input" // Changed for consistency
                        value={startDate}
                        onChange={handleDateChange}
                        required
                    />
                </div>
                <button type="submit" className="button">Fetch Statements</button>
                // Updated class to use .button for consistency
            </form>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {Array.isArray(statements) && statements.length > 0 ? (
                <table className="accounts-table"> // Updated class to use .accounts-table for styling
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Debited Amount</th>
                        <th>Credited Amount</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {statements.map((statement) => (
                        <tr key={statement.id}>
                            <td>{statement.transactionDate}</td>
                            <td>{statement.debitedAmount}</td>
                            <td>{statement.creditedAmount}</td>
                            <td>{statement.paymentDetails}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                !errorMessage && <div>No statements to display.</div>
            )}
            <div className="button-container">
                <button className="button" onClick={goToDashboard}>Back to Dashboard</button>
                <button className="button-danger" onClick={handleLogout}>Log Out</button>
            </div>
        </div>


    );
}

export default StatementsForm;
