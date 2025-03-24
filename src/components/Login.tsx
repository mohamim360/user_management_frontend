import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Login component definition with email, password, error, and navigate states

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    // The handleLogin function sends a POST request to the backend to authenticate the user
    const handleLogin = async () => {
        try {
            const response = await axios.post('https://usermanagementbackend-lake.vercel.app/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="text-center">Sign in to The App</h3>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form>
                                <div className="form-group">
                                    <label>E-mail</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="form-group form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="rememberMe"
                                    />
                                    <label className="form-check-label" htmlFor="rememberMe">
                                        Remember me
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-block"
                                    onClick={handleLogin}
                                    title="Click to sign in"
                                >
                                    Sign in
                                </button>
                            </form>
                        </div>
                        <div className="card-footer text-center">
                            <p className="mb-0">
                                Don’t have an account? <a href="/register">Sign up</a>
                            </p>
                            <a href="/forgot-password">Forgot password?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;