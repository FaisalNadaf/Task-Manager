import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { jwtDecode } from 'jwt-decode';


const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            const res = await axios.post('https://task-manager-zetw.onrender.com/api/auth/login', formData, {
                withCredentials: true,
            });

            const decoded = jwtDecode(res.data.token);
            console.log("Decoded user:", decoded);  // { id: 'mongo_user_id', iat: ..., exp: ... }

            if (decoded.id) {
                localStorage.setItem('userId', decoded.id);
                localStorage.setItem('token', res.data.token);
                navigate('/tasks');
            } else {
                console.error('userId missing in token');
            }
            if (res.data.token) {
                console.log(res.data)
                localStorage.getItem("Token", res.data.token);
                if (res.data.userId) {
                    localStorage.setItem("id", res.data.id);
                    console.log("Stored userId:", res.data.id); // Debugging
                } else {
                    console.error("userId is missing in response!");
                }
                // Store token if needed or just navigate
                navigate('/tasks');
            }
        } catch (err) {
            console.error('Login Error:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Invalid credentials. Please try again.');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Login to Your Account</h2>
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Login</button>
            </form>

            <p className="register-line">
                Don’t have an account?{' '}
                <span className="register-link" onClick={() => navigate('/register')}>
                    Register
                </span>
            </p>
        </div>
    );
};

export default Login;
