// src/components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { LogOut } from 'lucide-react'; // Importamos el icono de salida

const Logout = () => {
  const { logout } = useAuth();
  const { resetOrder } = useOrder();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Un pequeño toque de UX: confirmación rápida antes de cerrar todo
    if (window.confirm("¿Seguro que quieres cerrar sesión?")) {
      logout();
      resetOrder();
      navigate('/login');
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      className="group relative overflow-hidden px-4 py-2 rounded-xl transition-all duration-300 hover:bg-red-50 flex items-center justify-center w-full md:w-auto"
    >
      {/* Texto que se desliza hacia arriba */}
      <span className="inline-block transition-transform duration-300 group-hover:-translate-y-10 font-medium text-gray-700">
        Cerrar sesión
      </span>
      
      {/* Icono que aparece desde abajo en Rojo */}
      <span className="absolute translate-y-10 transition-transform duration-300 group-hover:translate-y-0 text-red-500">
        <LogOut size={20} />
      </span>
    </button>
  );
};

export default Logout;