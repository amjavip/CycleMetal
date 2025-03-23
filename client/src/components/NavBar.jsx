import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout }) => {
  return (
    <nav className="bg-black text-white p-4 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo y nombre de la página */}
        <Link to="/inicio" className="text-2xl font-semibold">
          EcoLoop
        </Link>

        {/* Menú de navegación */}
        <ul className="flex space-x-6">
          {!isAuthenticated ? (
            // Menú para usuarios no logueados
            <>
              <li><Link to="/inicio" className="hover:text-gray-400">Inicio</Link></li>
              <li><Link to="/register" className="hover:text-gray-400">Registro</Link></li>
            </>
          ) : (
            // Menú para usuarios logueados
            <>
              <li><Link to="/profile" className="hover:text-gray-400">Perfil</Link></li>
              <li>
                <button 
                  onClick={onLogout} 
                  className="hover:text-gray-400 focus:outline-none"
                >
                  Cerrar sesión
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
