import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logout from "../Form/LogoutForm";
import { Home, briefcase, User, Settings } from "lucide-react";

// Reutilizamos el sub-componente NavLink con los nuevos colores
const NavLink = ({ to, text, icon: Icon }) => (
  <Link
    to={to}
    className="group relative overflow-hidden px-4 py-2 rounded-xl transition-all duration-300 hover:bg-gray-100 flex items-center justify-center"
  >
    {/* Texto que sube al hacer hover */}
    <span className="inline-block transition-transform duration-300 group-hover:-translate-y-10 font-medium text-gray-700">
      {text}
    </span>
    
    {/* Icono verde esmeralda que sube desde abajo */}
    <span className="absolute translate-y-10 transition-transform duration-300 group-hover:translate-y-0 text-emerald-500">
      <Icon size={20} />
    </span>
  </Link>
);

const SellerNavbar = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 text-black p-2">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 md:px-8">
        
        {/* Logo Unificado: CYCLE (Negro) METAL (Gris) */}
        <Link to="/seller-home" className="text-2xl font-black tracking-tighter text-black hover:opacity-80 transition-opacity">
          CYCLE<span className="text-gray-400">METAL</span>
        </Link>

        {/* Botón hamburguesa para móvil */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-700 rounded-lg md:hidden hover:bg-gray-100 transition-colors"
        >
          <span className="sr-only">Abrir menú</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Opciones del Seller con las nuevas animaciones */}
        <div
          className={`${menuOpen ? "flex" : "hidden"} flex-col md:flex md:flex-row items-center space-y-2 md:space-y-0 md:space-x-1 w-full md:w-auto mt-4 md:mt-0`}
        >
          <NavLink to="/seller-home" text="Inicio" icon={Home} />
          <NavLink to="/seller-services" text="Servicios" icon={Settings} />
          <NavLink to="/seller-account" text="Cuenta" icon={User} />
          
          {/* Divisor visual entre links y logout */}
          <div className="hidden md:block w-px h-6 bg-gray-200 mx-3"></div>

          <div className="w-full md:w-auto">
            {/* Como ya modificamos LogoutForm.jsx, este se verá genial automáticamente */}
            <Logout />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SellerNavbar;