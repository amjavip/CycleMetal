// src/components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';


const Logout = ({ className = '' }) => {
  const { logout } = useAuth();
  const { resetOrder } = useOrder();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    resetOrder();
    navigate('/inicio'); // o a /login, como prefieras
  };

  return (
    <button onClick={handleLogout} className={className}>
      Cerrar sesión
    </button>
  );
};

export default Logout;
