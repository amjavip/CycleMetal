// src/components/RedirectIfAuth.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RedirectIfAuth = ({ children }) => {
  const { user } = useAuth();

  // Si el usuario está autenticado, redirigimos según el rol
  if (user) {
    if (user.role === 'seller') {
      return <Navigate to="/seller-home" />;
    } else if (user.role === 'collector') {
      return <Navigate to="/collector-home" />;
    }
  }

  // Si no está autenticado, renderizamos los hijos
  return children;
};

export default RedirectIfAuth;
