import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* Header */}
            <header className="home-header">
                <h1>Task Manager</h1>
            </header>

            {/* Main Container */}
            <div className="home-container">
                <h2>Welcome to Task Manager 📋</h2>
                <p>
                    Manage your daily tasks efficiently with file attachments, search, and priority sorting.
                    <br /> Built using the <strong>MERN Stack</strong> (MongoDB, Express, React, Node.js).
                </p>

                <button className="register-btn" onClick={() => navigate('/register')}>
                    Register
                </button>

                <p className="login-line">
                    Already have an account?{' '}
                    <span className="login-link" onClick={() => navigate('/login')}>
                        Login
                    </span>
                </p>
            </div>

            {/* Footer */}
            <footer className="home-footer">
                <p>© 2025 Task Manager. All rights reserved.</p>
            </footer>
        </>
    );
};

export default Home;
