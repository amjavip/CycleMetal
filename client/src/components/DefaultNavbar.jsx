import React from 'react';
import { Link } from 'react-router-dom';

const DefaultNavbar = () => {
  const token = localStorage.getItem('token');

  if (token) return null; // si ya está autenticado, no muestra este navbar

  return (
    <nav className="sticky top-0 z-50 bg-[#fff]/70 backdrop-blur-md text-black p-4 shadow-md">
      <div className="flex justify-between items-center px-4 md:px-8">
        {/* Nombre o Logo de la empresa */}
        <Link to="/" className="text-2xl font-semibold">
          CycleMetal
        </Link>

        {/* Opciones */}
        <div className="flex items-center space-x-4">
          <Link
            to="/Login"
            className="btn btn-primary bg-[#303030] hover:bg-[#404040]/60 border-none text-white px-4 py-1 rounded-md 
              transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="text-gray-700 hover:text-gray-500 transition-colors duration-200"
          >
            Registro
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default DefaultNavbar;
