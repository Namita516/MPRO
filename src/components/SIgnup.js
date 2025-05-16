import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Link } from "react-router-dom";
import "./SIgnup.css";


const Signup = () => {
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (signupData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Save user data (You can replace this with actual backend API call)
    localStorage.setItem('userData', JSON.stringify(signupData));
    alert('Signup Successful!');
    navigate('/login'); // Redirect to login page
  };

  return (
    <form onSubmit={handleSignup}>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
     

      <button type="submit">Sign Up</button>
      <p style={{ color: 'black', textAlign: 'center' }}>
  Have an account? <Link to="/login">Login</Link>
</p>
    </form>
  );
};

export default Signup;
