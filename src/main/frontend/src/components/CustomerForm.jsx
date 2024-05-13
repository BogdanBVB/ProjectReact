
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate} from "react-router-dom";

function CustomerForm() {

    const [customer, setCustomer] = useState({
        name: '',
        surname: '',
        phone: '',
        email: '',
        username: '',
        password: ''
    });
    const [usernameError, setUsernameError] = useState('');

    const navigate = useNavigate();


    function handleChange(e) {
        setCustomer({ ...customer, [e.target.name]: e.target.value });


        if (e.target.name === 'username') {
            setUsernameError('');
        }
    }


    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/customers', customer);
            alert('Customer created!');

            setCustomer({
                name: '',
                surname: '',
                phone: '',
                email: '',
                username: '',
                password: ''
            });
            setUsernameError('');
            navigate('/dashboard');
        } catch (error) {
            if (error.response && error.response.data && error.response.status === 409) {
                setUsernameError('Username already exists. Please choose another.');
                setCustomer({ ...customer, username: '' });
            } else {
                alert('An error occurred while creating the customer.');
            }
            console.error(error);
        }
    }

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <label className="form-label">
                    Name:
                    <input className="form-input" type="text" name="name" value={customer.name} onChange={handleChange}
                           required/>
                </label>
                <label className="form-label">
                    Surname:
                    <input className="form-input" type="text" name="surname" value={customer.surname}
                           onChange={handleChange} required/>
                </label>
                <label className="form-label">
                    Phone:
                    <input className="form-input" type="text" name="phone" value={customer.phone}
                           onChange={handleChange} required/>
                </label>
                <label className="form-label">
                    Email:
                    <input className="form-input" type="email" name="email" value={customer.email}
                           onChange={handleChange} required/>
                </label>
                <label className="form-label">
                    Username:
                    <input className="form-input" type="text" name="username" value={customer.username}
                           onChange={handleChange} required/>
                    {usernameError && <span className="form-error-message">{usernameError}</span>}
                </label>
                <label className="form-label">
                    Password:
                    <input className="form-input" type="password" name="password" value={customer.password}
                           onChange={handleChange} required/>
                </label>
                <button type="submit" className="button">Create Customer</button>
            </form>
        </div>
    );
}

export default CustomerForm;
