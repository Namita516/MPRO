import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const Home = () => {
  const { login, user } = useAuth();
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    if (username.trim()) {
      login({ username });
      alert('Logged in successfully!');
    } else {
      alert('Please enter a valid username.');
    }
  };

  return (
    <div>
      {user ? (
        <h1>Welcome, {user.username}!</h1>
      ) : (
        <div>
          <h1>Login</h1>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default Home;
