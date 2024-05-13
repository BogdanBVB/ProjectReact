import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useAuth} from "./hooks/useAuth.js";

function TransfersBetweenOwnAccountsForm() {
    const [accounts, setAccounts] = useState([]);
    const [selectedFromAccountId, setSelectedFromAccountId] = useState('');
    const [selectedToAccountId, setSelectedToAccountId] = useState('');
    const [creditedAccounts, setCreditedAccounts] = useState([]);
    const [debitedAccounts, setDebitedAccounts] = useState([]);
    const [amount, setAmount] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { handleLogout } = useAuth();

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = () => {
        axios.get('/api/ownAccounts') // Adjust the API endpoint as necessary
            .then(response => {
                setAccounts(response.data);
                setDebitedAccounts(response.data); // Initially set all accounts as potential debited accounts
            })
            .catch(error => {
                console.error('Failed to fetch accounts:', error);
                setErrorMessage('Failed to load accounts');
            });
    };
    const handleFromAccountChange = (e) => {
        const accountId = e.target.value;
        setSelectedFromAccountId(accountId);
        fetchCreditedAccounts(accountId);
    };

    const fetchCreditedAccounts = (excludeAccountId) => {
        axios.get(`/api/ownAccounts/filteredAccounts?excludeAccountId=${excludeAccountId}`)
            .then(response => setCreditedAccounts(response.data))
            .catch(error => console.error('Failed to fetch filtered accounts:', error));
    };

    const handleTransfer = (e) => {
        e.preventDefault();
        const payload = {
            debitedAccountId: selectedFromAccountId,
            creditedAccountId: selectedToAccountId,
            amount: parseFloat(amount), // Convert string input to number
            intraBanking: true,
            interBanking: false,
            paymentDetails: "Transfer between own accounts" // Add any other necessary fields
        };

        axios.post('/api/ownAccounts/executeTransferBetweenOwn', payload)
            .then(() => {
                alert('Transfer successful');
                navigate('/ownAccounts'); // Redirect on success
            })
            .catch(error => {
                console.error('Transfer failed:', error);
                alert('Transfer failed');
                setErrorMessage('Transfer failed. Please try again.');
            });
        navigate('/payments')
    };
    const goToDashboard = () => {
        navigate('/dashboard');  // Navigate back to the dashboard
    };

    return (
        <div className="dashboard2-container">
            <h1 className="accounts-title">Transfer Between Your Own Accounts</h1>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={handleTransfer}>
                <div className="form-group">
                    <label htmlFor="fromAccount">From Account:</label>
                    <select
                        id="fromAccount"
                        className="form-input" // Updated class name to match your style guide
                        value={selectedFromAccountId}
                        onChange={handleFromAccountChange}
                        required
                    >
                        <option value="">Choose an account</option>
                        {accounts.map(account => (
                            <option key={account.id} value={account.id}>
                                {account.iban} - {account.currency} - Balance: {account.accountBalance} -
                                Type: {account.accountType}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="toAccount">To Account:</label>
                    <select
                        id="toAccount"
                        className="form-input" // Updated class name to match your style guide
                        value={selectedToAccountId}
                        onChange={e => setSelectedToAccountId(e.target.value)}
                        required
                    >
                        <option value="">Select Account</option>
                        {creditedAccounts.map(account => (
                            <option key={account.id} value={account.id}>
                                {account.iban} - {account.currency} - Balance: {account.accountBalance} -
                                Type: {account.accountType}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        className="form-input" // Updated class name to match your style guide
                        id="amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        min="1"
                        required
                    />
                </div>

                <button type="submit" className="button">Transfer</button>
            </form>

            <div className="button-container">
                <button className="button" onClick={goToDashboard}>Back to Dashboard</button>
                <button className="button-danger" onClick={handleLogout}>Log Out</button>
            </div>
        </div>
    );
}

export default TransfersBetweenOwnAccountsForm;
