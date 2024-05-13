import { useNavigate } from "react-router-dom";
import axios from 'axios';

export function useAuth() {
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.post('http://localhost:8080/api/logout')
            .then(() => {
                localStorage.removeItem('authToken');
                navigate('/');
            })
            .catch(error => {
                console.error('Logout failed:', error);
                alert('Logout failed. Please try again.');
            });
    };

    return {
        handleLogout
    };
}