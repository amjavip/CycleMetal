import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logout from "../Form/LogoutForm";

const SellerNavbar = () => {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false); // ✅ Estado para el menú
  
    return (
      <nav className="sticky top-0 z-50 bg-[#FFF]/80 backdrop-blur-md text-black p-4 border-gray-300">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 md:px-8">
          {/* Logo o nombre del sitio */}
          <Link to="/seller-home" className="text-2xl font-semibold text-[#202020]">
            CycleMetal
          </Link>
  
          {/* Botón hamburguesa (solo en móvil) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)} // ✅ Toggle del menú
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-700 rounded-lg md:hidden hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-controls="navbar-default"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Abrir menú</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
  
          {/* Opciones del navbar */}
          <div
            className={`${menuOpen ? "flex" : "hidden"} flex-col md:flex md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-6 w-full md:w-auto mt-4 md:mt-0`}
            id="navbar-default"
          >
            <Link to="/seller-home" className="border-none text-black px-3 py-1 rounded-md 
          transition-all duration-300 ease-in-out transform hover:bg-[#e4e4e5] ">Inicio</Link>
            <Link to="/seller-activity" className="hover:bg-[#404040] border-none text-black px-3 py-1 rounded-md 
          transition-all duration-300 ease-in-out transform hover:bg-[#e4e4e5] ">Actividad</Link>
            <Link to="/seller-services" className="hover:bg-[#404040] border-none text-black px-3 py-1 rounded-md 
          transition-all duration-300 ease-in-out transform hover:bg-[#e4e4e5] ">Servicios</Link>
            <Link to="/seller-account" className="hover:bg-[#404040] border-none text-black px-3 py-1 rounded-md 
          transition-all duration-300 ease-in-out transform hover:bg-[#e4e4e5] ">Cuenta</Link>
            <Logout className="hover:bg-[#404040] border-none text-black px-3 py-1 rounded-md 
          transition-all duration-300 ease-in-out transform hover:bg-[#e4e4e5] "/>
          
           
          </div>
        </div>
      </nav>
    );
  };
  
export default SellerNavbar;