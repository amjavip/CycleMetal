import { Link } from 'react-router-dom';
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#202020] text-[#e4e4e7]">
      {/* Encabezado */}
      <h1 className="text-4xl font-bold text-[#ffcc00] mb-4">Bienvenido a EcoLoop</h1>

      {/* Descripción */}
      <p className="text-lg text-[#d1d1d6] mb-6 text-center">
        Tu plataforma para optimizar la recolección de residuos y hacer del mundo un lugar más limpio.
      </p>

      {/* Botones para navegar */}
      <div className="flex space-x-4">
        <button className="btn btn-primary bg-[#d1b4ff] hover:bg-[#a78bfa] text-[#202020]">
          <a href="/login">Iniciar sesión</a>
        </button>
        <button className="btn btn-secondary bg-[#ffcc00] hover:bg-[#ffbb33] text-[#202020]">
          <li><Link to="/register" className="hover:text-gray-400">Perfi</Link></li>
                      
        </button>
      </div>
    </div>
  );
}
