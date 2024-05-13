import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './hooks/useAuth'

function ExchangeForm() {
    const [accounts, setAccounts] = useState([]);
    const [selectedFromAccountId, setSelectedFromAccountId] = useState('');
    const [selectedToAccountId, setSelectedToAccountId] = useState('');
    const [amount, setAmount] = useState('');
    const [rates, setRates] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { handleLogout } = useAuth();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const accountResponse = await axios.get('/api/ownAccounts');
                setAccounts(accountResponse.data);
                const ratesResponse = await axios.get('http://localhost:8080/api/exchange?base=RON');
                setRates(ratesResponse.data.rates);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data.');
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const handleAccountChange = (e) => {
        setSelectedFromAccountId(e.target.value);
        fetchCreditedAccounts(e.target.value);
    };

    const handleToAccountChange = (e) => {
        setSelectedToAccountId(e.target.value);
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/exchange/executeExchange', {
                debitedAccountId: selectedFromAccountId,
                creditedAccountId: selectedToAccountId,
                amount: parseFloat(amount),
            });
            alert('Transfer successful');
            navigate('/dashboard');
        } catch (error) {
            console.error('Transfer failed:', error);
            setError('Transfer failed. Please try again.');
        }
    };
    const goToDashboard = () => {
        navigate('/dashboard');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="dashboard2-container">
            <h1 className="accounts-title">Currency Exchange and Transfers</h1>
            <form onSubmit={handleTransfer} className="form-container">
                <div className="form-group">
                    <label htmlFor="fromAccount">From Account:</label>
                    <select id="fromAccount" className="form-input" value={selectedFromAccountId}
                            onChange={handleAccountChange} required>
                        <option value="">Select Source Account</option>
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>{account.iban} - {account.balance}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="toAccount">To Account (Destination):</label>
                    <select id="toAccount" className="form-input" value={selectedToAccountId}
                            onChange={handleToAccountChange} required>
                        <option value="">Select Destination Account</option>
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>{account.iban} - {account.balance}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="amount">Amount:</label>
                    <input type="number" id="amount" className="form-input" value={amount} onChange={handleAmountChange}
                           required/>
                </div>
                <button type="submit" className="button">Transfer</button>
            </form>
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
            <div className="button-container">
                <button className="button" onClick={goToDashboard}>Back to Dashboard</button>
                <button className="button-danger" onClick={handleLogout}>Log Out</button>
            </div>
        </div>

    );
}

export default ExchangeForm;
