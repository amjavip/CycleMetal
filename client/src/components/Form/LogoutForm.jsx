// src/components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Logout = ({ className = '' }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/inicio'); // o a /login, como prefieras
  };

  return (
    <button onClick={handleLogout} className={className}>
      Cerrar sesión
    </button>
  );
};

export default Logout;
