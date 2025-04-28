import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Asegúrate de que esta ruta sea correcta

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth(); // Usamos el hook useAuth para acceder al contexto

  // Si aún se está cargando el estado de autenticación
  if (loading) {
    return <div>Loading...</div>; // O podrías usar un spinner de carga
  }

  // Si no hay usuario autenticado, redirigimos a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol y el rol del usuario no coincide, redirigimos a login
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children; // Si todo está bien, renderizamos los hijos
};

export default ProtectedRoute;
