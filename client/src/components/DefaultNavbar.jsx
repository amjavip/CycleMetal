import React from 'react';
import { Link } from 'react-router-dom';

const DefaultNavbar = () => {
  const token = localStorage.getItem('token');

  if (token) return null; // si ya está autenticado, no muestra este navbar

  return (
    <nav className="sticky top-0 z-50 bg-[#FFF]/70 backdrop-blur-md text-black p-4 shadow-md">
      <div className="flex justify-between items-center px-4 md:px-8">
        {/* Nombre o Logo de la empresa */}
        <Link to="/" className="text-2xl font-semibold">
          CycleMetal
        </Link>

        {/* Opciones */}
        <div className="flex items-center space-x-4">
          <Link
            to="/Login"
            className="text-[#000] hover:bg-[#e4e4e5] transition-colors duration-200 p-2 rounded-md"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="text-[#000] hover:bg-[#e4e4e5] transition-colors duration-200 p-2 rounded-md"
          >
            Registro
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default DefaultNavbar;