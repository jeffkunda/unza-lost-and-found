import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.js';
import StudentDashboard from './components/StudentDashboard.js';
import AdminDashboard from './components/AdminDashboard.js';

function App() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return token ? { token, role } : null;
  });

  const logout = () => {
    localStorage.clear();
    setAuth(null);
  };

  if (!auth) {
    return (
      <Router>
        <Routes>
          <Route path="/*" element={<Login setAuth={setAuth} />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/student/*" element={auth.role === 'student' ? <StudentDashboard logout={logout} token={auth.token} /> : <Navigate to="/" />} />
        <Route path="/admin/*" element={auth.role === 'admin' ? <AdminDashboard logout={logout} token={auth.token} /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to={auth.role === 'student' ? '/student' : '/admin'} />} />
      </Routes>
    </Router>
  );
}

export default App;
