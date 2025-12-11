import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, Settings } from 'lucide-react';
import './Navigation.css';

function Navigation({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/dashboard" className="navbar-brand">
            <span className="brand-icon">🔐</span>
            <span className="brand-text">SecureChain Auditor™</span>
          </Link>

          <div className="navbar-menu">
            <Link to="/dashboard" className="nav-link">
              <Home size={18} />
              Dashboard
            </Link>
            <Link to="/pricing" className="nav-link">
              Pricing
            </Link>
          </div>

          <div className="navbar-user">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className={`user-tier badge badge-${user?.tier}`}>
                {user?.tier.toUpperCase()}
              </span>
            </div>
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
