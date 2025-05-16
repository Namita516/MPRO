import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Link, useNavigate } from "react-router-dom";
import "./SIgnup.css";

const Login = () => {
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setError('All fields are required');
      return;
    }
    if (loginData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (!login(loginData.email, loginData.password)) {
      setError('Invalid email or password');
      return;
    }
    setError('');
    alert('Login Successful!');
    navigate('/profile'); // Redirect to Profile Page
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <input 
        type="email" 
        placeholder="Email" 
        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} 
      />
      <button type="submit">Login</button>
      {error && <p className="error">{error}</p>}
                
      <p style={{ color: 'black', textAlign: 'center' }}>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </form>
  );
};

export default Login;
