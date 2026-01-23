import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logout from "../Form/LogoutForm";
import { Home, BarChart2, Package, User, Truck, LogOut } from "lucide-react";

// Sub-componente para los botones con animación
const NavLink = ({ orphans, to, text, icon: Icon, isLogout = false, onClick }) => {
  const content = (
    <div className="group relative overflow-hidden px-4 py-2 rounded-xl transition-all duration-300 hover:bg-gray-100 flex items-center justify-center cursor-pointer">
      {/* Texto que sube */}
      <span className="inline-block transition-transform duration-300 group-hover:-translate-y-10 font-medium text-gray-700">
        {text}
      </span>
      
      {/* Icono que sube desde abajo - Verde Clarito */}
      <span className="absolute translate-y-10 transition-transform duration-300 group-hover:translate-y-0 text-emerald-500">
        <Icon size={20} />
      </span>
    </div>
  );

  if (isLogout) {
    return <div onClick={onClick}>{content}</div>;
  }

  return <Link to={to}>{content}</Link>;
};

const CollectorNavbar = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 text-black">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-6 py-3">
        
        {/* Logo: CYCLE (Negro) METAL (Gris Clarito) */}
        <Link to="/collector-home" className="text-2xl font-black tracking-tighter text-black hover:opacity-80 transition-opacity">
          CYCLE<span className="text-gray-400">METAL</span>
        </Link>

        {/* Botón hamburguesa móvil */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 md:hidden hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="w-6 h-0.5 bg-black mb-1.5"></div>
          <div className="w-6 h-0.5 bg-black mb-1.5"></div>
          <div className="w-6 h-0.5 bg-black"></div>
        </button>

        {/* Menú de navegación */}
        <div className={`${menuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-1 w-full md:w-auto mt-4 md:mt-0`}>
          
          <NavLink to="/collector-home" text="Inicio" icon={Home} />
          <NavLink to="/collector-stats" text="Estadísticas" icon={BarChart2} />
          <NavLink to="/collector-services" text="Pedidos" icon={Package} />
          <NavLink to="/collector-account" text="Cuenta" icon={User} />
          <NavLink to="/collector-vehicle" text="Vehículo" icon={Truck} />
          
          {/* Separador sutil */}
          <div className="hidden md:block w-px h-6 bg-gray-200 mx-2"></div>

          {/* Logout con la misma animación */}
          <div className="w-full md:w-auto">
            <Logout /> 
            {/* Nota: Si quieres que el Logout tenga la animación exacta, 
                puedes pasarle el estilo al componente Logout o envolverlo. 
                Aquí abajo te explico cómo modificar el componente LogoutForm */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CollectorNavbar;