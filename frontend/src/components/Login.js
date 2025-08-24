import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      setAuth({ token: res.data.token, role: res.data.role, username: res.data.username });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div 
      style={{
        maxWidth: '400px',
        margin: '100px auto',
        padding: '30px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        borderRadius: '12px',
        backgroundColor: '#fff',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        UNZA Lost and Found - Login
      </h2>

      {error && (
        <p 
          style={{
            color: 'red',
            backgroundColor: '#ffe6e6',
            padding: '10px',
            borderRadius: '6px',
            textAlign: 'center',
            marginBottom: '20px'
          }}
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label style={{ fontWeight: '600', color: '#555' }}>Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />

        <label style={{ fontWeight: '600', color: '#555' }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />

        <button
          type="submit"
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#007bff',
            color: '#fff',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0056b3')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#007bff')}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
