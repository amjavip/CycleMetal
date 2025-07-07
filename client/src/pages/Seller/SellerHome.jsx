import React from "react";
import Noticias from "../../components/Seller/SellerNews";
import ActividadSemanal from "../../components/Seller/SellerWeeklyActivity";
import { useAuth } from "../../context/AuthContext";

export default function SellerHome() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Perfil del usuario */}
        <div className="card bg-base-100 shadow-lg p-6 flex flex-col items-center ">
          <img
            src="/12694.jpg"
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <h2 className="text-2xl font-bold text-primary">{user.profile.username}</h2>
          <p className="text-sm text-gray-500">{user.profile.email}</p>
          <button className="btn btn-neutral mt-4 w-full">Editar perfil</button>
        </div>

        {/* Gráfica + puntos */}
        <div className="card bg-base-100 shadow-lg col-span-1 md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-4 p-6">
          <div className="w-full md:w-3/4">
            <ActividadSemanal />
          </div>
          <div className="w-full md:w-1/4 flex justify-center">
            <button className="btn btn-success w-full md:w-auto text-lg">
              🔋 135 puntos
            </button>
          </div>
        </div>

        {/* Noticias o notificaciones */}
        <div className="card bg-base-100 shadow-lg col-span-1 md:col-span-3 p-6">
          <Noticias />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-gray-500 mt-12 border-t pt-6 text-sm text-center md:text-left">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-4">
          <span>© {new Date().getFullYear()} CycleMeta+. Todos los derechos reservados.</span>
          <div className="flex space-x-4">
            <a href="#" className="link link-hover">Inicio</a>
            <a href="#" className="link link-hover">Sobre nosotros</a>
            <a href="#" className="link link-hover">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
