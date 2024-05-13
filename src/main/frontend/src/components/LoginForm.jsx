// LoginForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';

function LoginForm() {
    // Initialize state for the login credentials
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Update state when form fields change
    function handleChange(e) {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });

        // Clear error message when editing input fields
        if (e.target.name === 'username') {
            setErrorMessage('');
        }
    }

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            // Replace with the actual authentication endpoint
            const response = await axios.post('http://localhost:8080/api/login', credentials);

            // If authentication succeeds, navigate to the dashboard or another page
            if (response.status === 200) {
                alert('Login successful!');
                navigate('/dashboard'); // Replace with your desired path
            }
        } catch (error) {
            // Handle any errors encountered during authentication
            if (error.response && error.response.status === 401) {
                setErrorMessage('Invalid username or password. Please try again.');
            } else {
                setErrorMessage('An error occurred. Please try again later.');
            }
            console.error('Login error:', error);
        }
    }

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <label className="form-label">
                    Username:
                    <input
                        className="form-input"
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                    />
                </label>
                {errorMessage && (
                    <span className="error-message">{errorMessage}</span>
                )}
                <label className="form-label">
                    Password:
                    <input
                        className="form-input"
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </label>
                <Link to="/"><button className="button">Home</button></Link>
                <button className="button" type="submit">Log in</button>
            </form>
        </div>
    );
}

export default LoginForm;
