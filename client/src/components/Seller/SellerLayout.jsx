import { NavLink, Outlet } from "react-router-dom";
import SearchBar from "../SearchBar";
import { User, ShieldCheck, Key, LifeBuoy, Trash2 } from "lucide-react";

// Sub-componente para los ítems de la barra lateral
const AccountNavItem = ({ to, text, icon: Icon, isDanger = false }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        group relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden
        ${isActive 
          ? (isDanger ? "bg-red-50 text-red-600 border-l-4 border-red-600 shadow-sm" : "bg-gray-50 text-emerald-700 border-l-4 border-emerald-600 shadow-sm") 
          : (isDanger ? "text-red-500 hover:bg-red-100/50" : "text-gray-600 hover:bg-gray-100")
        }
      `}
    >
      {/* Icono que aparece con un ligero efecto de escala */}
      <Icon 
        size={18} 
        className={`mr-3 transition-transform duration-300 group-hover:scale-110 ${isDanger ? 'text-red-500' : 'text-emerald-500'}`} 
      />
      
      {/* Texto con deslizamiento suave */}
      <span className="font-medium transition-transform duration-300 group-hover:translate-x-1">
        {text}
      </span>

      {/* Brillo sutil de fondo al pasar el mouse */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </NavLink>
  );
};

export default function AccountLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50/30">
      {/* Barra lateral */}
      <nav className="sticky top-16 h-[calc(100vh-64px)] w-72 bg-white border-r border-gray-100 p-6 space-y-2">
        <div className="pb-4">
          <SearchBar />
        </div>
        
        <div className="space-y-1">
          <AccountNavItem to="profile" text="Perfil" icon={User} />
          <AccountNavItem to="details" text="Detalles" icon={ShieldCheck} />
          <AccountNavItem to="changepassword" text="Cambiar Contraseña" icon={Key} />
          <AccountNavItem to="recovery" text="Recuperar Contraseña" icon={LifeBuoy} />
        </div>

        <div className="pt-10">
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Eliminación</p>
          <AccountNavItem to="delete" text="Borrar cuenta" icon={Trash2} isDanger={true} />
        </div>
      </nav>

      {/* Contenido dinámico */}
      <main className="flex-1 p-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}