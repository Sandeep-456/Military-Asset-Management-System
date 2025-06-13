import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css'; // ✅ Import the CSS file

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/purchases" className="nav-link">Purchases</Link>
        <Link to="/transfers" className="nav-link">Transfers</Link>
        <Link to="/assignments" className="nav-link">Assignments</Link>
        <Link to="/expenditures" className="nav-link">Expenditures</Link>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default NavBar;
