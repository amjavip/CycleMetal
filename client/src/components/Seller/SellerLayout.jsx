import { NavLink, Outlet } from "react-router-dom";
import SearchBar from "../SearchBar";
export default function AccountLayout() {
  return (
    <div className="flex min-h-screen ">
      
  
      <nav className="sticky top-16 h-screen w-64 bg-white border-r-2  p-6 space-y-4 w-1/8">
      <SearchBar></SearchBar>
     

      <NavLink
  to="profile"
  className={({ isActive }) =>
    isActive
      ? "border-l-2 block text-[#000] px-5 py-2"
      : "block text-[#000] px-3 py-2 transition-all duration-300 ease-in-out transform hover:bg-[#e4e4e4] rounded-xl"
  }
>
  Perfil
</NavLink>

        <NavLink to="details"  className={({ isActive }) =>
    isActive
       ? "border-l-2 block text-[#202020] px-5 py-2 "
      : "block text-[#000] px-3 py-2 transition-all duration-300 ease-in-out transform hover:bg-[#e4e4e4] rounded-xl"
  }> Detalles</NavLink>
        <NavLink to="changepassword"  className={({ isActive }) =>
    isActive
       ? "border-l-2 block text-[#000] px-5 py-2"
      : "block text-[#000] px-3 py-2 transition-all duration-300 ease-in-out transform hover hover:bg-[#e4e4e4] rounded-xl"
  }> Cambiar Contraseña</NavLink>
        <NavLink to="recovery"  className={({ isActive }) =>
    isActive
       ? "border-l-2 block text-[#000] px-5 py-2"
      : "block text-[#000] px-3 py-2 transition-all duration-300 ease-in-out transform hover hover:bg-[#e4e4e4] rounded-xl"
  }> Recuperar Contraseña</NavLink>
      </nav>

      {/* Contenido dinámico */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
