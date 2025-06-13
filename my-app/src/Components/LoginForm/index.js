import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://military-asset-management-system-gtah.onrender.com/api/login', {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      localStorage.setItem('token', res.data.token);
      console.log(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed. Please check your username or password.');
      console.error(err);
    }
  };

  return (
    <div className="login-bg-container">
      <form onSubmit={handleSubmit} className="login-form-container">
        <h2 className="login-title">Military Asset Management</h2>
        <div className="input-container">
          <label className="input-name">Username</label><br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input-element"
          />
        </div>

        <div className="input-container">
          <label className="input-name">Password</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-element"
          />
        </div>

        <button type="submit" className="login-btn">Login</button>
        <p className="login-subtitle">Enter your credentials to continue</p>
        <p className="login-hint">Try <strong>admin / admin123</strong> or <strong>commander / commander123</strong></p>
      </form>
    </div>
  );
}

export default LoginPage;
