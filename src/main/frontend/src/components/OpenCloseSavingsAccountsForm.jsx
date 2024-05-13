import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {useAuth} from "./hooks/useAuth.js";

function OpenCloseSavingsAccountsForm() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState('RON');
    const navigate = useNavigate();
    const { handleLogout } = useAuth();

    const fetchAccounts = useCallback(() => {
        axios.get('http://localhost:8080/api/savingsAccounts')
            .then(response => {
                setAccounts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch accounts:', error);
                setError('Failed to load accounts');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const handleCloseAccount = (accountId) => {
        if (window.confirm('Are you sure you want to close this account?')) {
            axios.delete(`http://localhost:8080/api/savingsAccounts/${accountId}`)
                .then(() => {
                    fetchAccounts();  // Re-fetch the accounts after one is closed
                })
                .catch(error => {
                    console.error('Failed to close account:', error);
                    alert(error.response.data);  // Display backend validation message
                });
        }
    };

    const handleOpenAccount = () => {
        axios.post('http://localhost:8080/api/savingsAccounts/openNewSavingsAccount', { currency: selectedCurrency })
            .then(() => {
                fetchAccounts();  // Re-fetch the accounts after opening a new one
            })
            .catch(error => {
                console.error('Failed to open account:', error);
                alert('Failed to open account');
            });
    };

     const goToDashboard = () => {
        navigate('/dashboard');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="dashboard2-container">
            <h1 className="accounts-title">Savings Accounts</h1>
            <table className="accounts-table">
                <thead>
                <tr>
                    <th>IBAN</th>
                    <th>Currency</th>
                    <th>Balance</th>
                    <th>Opening Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(accounts) ? (
                accounts.map((account, index) => (
                    <tr key={index}>
                        <td>{account.iban}</td>
                        <td>{account.currency}</td>
                        <td>{account.accountBalance || 'N/A'}</td>
                        <td>{account.openingDate ? new Date(account.openingDate).toLocaleDateString() : 'Unknown'}</td>
                        <td>
                            <button className="button-danger" onClick={() => handleCloseAccount(account.id)}>Close Account</button>
                        </td>
                    </tr>
                ))
                ) : (
                    <tr><td colSpan="5">No accounts to display</td></tr>
                )}
                </tbody>
            </table>
            <div className="new-account-container">
                <span className="new-account-label">Choose currency to open a new account:</span>
                <select className="currency-select" value={selectedCurrency} onChange={e => setSelectedCurrency(e.target.value)}>
                    <option value="RON">RON</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="HUF">HUF</option>
                </select>
                <button className="button" onClick={handleOpenAccount}>Open a {selectedCurrency} Account</button>
            </div>
            <div className="button-container">
                <button className="button" onClick={goToDashboard}>Back to Dashboard</button>
                <button className="button-danger" onClick={handleLogout}>Log Out</button>
            </div>
        </div>
    );
}

export default OpenCloseSavingsAccountsForm;
