import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useAuth} from "./hooks/useAuth.js";

function TransfersToOtherGBROAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [selectedFromAccountId, setSelectedFromAccountId] = useState('');
    const [destinationIban, setDestinationIban] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentDetails, setPaymentDetails] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { handleLogout } = useAuth();

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = () => {
        axios.get('/api/otherGBROAccounts') // Adjust the API endpoint as necessary
            .then(response => {
                setAccounts(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch accounts:', error);
                setErrorMessage('Failed to load accounts');
            });
    };

    const handleTransfer = (e) => {
        e.preventDefault();
        const payload = {
            debitedAccountId: selectedFromAccountId,
            destinationIban: destinationIban,
            amount: parseFloat(amount),
            paymentDetails: paymentDetails, // Include payment details in the payload
            intraBanking: false,
            interBanking: true
        };

        axios.post('/api/otherBanksAccounts/executeTransferToOtherBanksAccounts', payload)
            .then(() => {
                alert('Transfer successful');
                navigate('/otherBanksAccounts'); // Redirect on success
            })
            .catch(error => {
                console.error('Transfer failed:', error);
                setErrorMessage('Transfer failed. Please try again.');
            });
        navigate('/payments')
    };

    const goToDashboard = () => {
        navigate('/dashboard');  // Navigate back to the dashboard
    };

    return (
        <div className="dashboard2-container">
            <h1 className="accounts-title">Transfer to Other Banks Accounts</h1>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={handleTransfer} className="form-container">
                <div className="form-group">
                    <label htmlFor="fromAccount">From Account:</label>
                    <select
                        id="fromAccount"
                        className="form-input"  // Changed from 'form-control' to 'form-input' for consistency
                        value={selectedFromAccountId}
                        onChange={e => setSelectedFromAccountId(e.target.value)}
                        required
                    >
                        <option value="">Choose an account</option>
                        {accounts.map(account => (
                            <option key={account.id} value={account.id}>
                                {account.iban} - {account.currency} - Balance: {account.accountBalance}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="toAccountIban">Destination IBAN:</label>
                    <input
                        type="text"
                        className="form-input"  // Changed for consistency
                        id="toAccountIban"
                        value={destinationIban}
                        onChange={e => setDestinationIban(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        className="form-input"  // Changed for consistency
                        id="amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        min="1"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="paymentDetails">Payment Details:</label>
                    <input
                        type="text"
                        className="form-input"  // Changed for consistency
                        id="paymentDetails"
                        value={paymentDetails}
                        onChange={e => setPaymentDetails(e.target.value)}
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


export default TransfersToOtherGBROAccounts;
