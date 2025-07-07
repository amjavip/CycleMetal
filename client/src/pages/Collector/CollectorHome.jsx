import { useAuth } from "../../context/AuthContext";
import ActividadSemanal from "../../components/Seller/SellerWeeklyActivity";
import Noticias from "../../components/Seller/SellerNews";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

import { VehicleModel } from "../../components/VehiculeModelsRender";


export default function CollectorHome() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-base-200 text-base-content p-6">

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">

                {/* 📋 Ficha de perfil */}
                <div className="bg-base-100 p-6 rounded-box shadow row-span-3 col-span-1 flex flex-col items-center justify-auto">
                    <img
                        src="/12694.jpg"
                        alt="Foto de perfil"
                        className="w-85 h-85 rounded-full object-cover mb-4"
                    />

                    <p className="text-2xl font-bold">{user.profile.username}</p>
                    <p className="text-sm opacity-70 mb-4">({user.profile.email})</p>
                    <div className="flex-grow" />

                    {/* Botón fijo abajo */}
                    <button className="btn btn-primary w-full mt-4 self-center hover-1">
                        Editar perfil
                    </button>
                </div>

                <div className="row-span-3 col-span-1 flex flex-col gap-4 justify-center h-full">
                    <div className="stats shadow bg-base-100 h-1/4 hover-1">
                        <div className="stat">
                            <div className="stat-figure text-yellow-500">
                                {/* Heroicon de estrella con mejor proporción */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                            </div>
                            <div className="stat-title">Reputación</div>
                            <div className="stat-value text-yellow-500">4.7 / 5</div>
                            <div className="stat-desc">Basado en 38 valoraciones</div>
                        </div>
                    </div>

                    {/* 📍 Pedidos cerca */}
                    <div className="stats shadow bg-base-100 h-1/4 hover-1">
                        <div className="stat">
                            <div className="stat-figure text-primary">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6h13M5 6h.01M5 12h.01M5 18h.01"></path>
                                </svg>
                            </div>
                            <div className="stat-title">Pedidos cerca de ti</div>
                            <div className="stat-value text-primary">8</div>
                            <div className="stat-desc">Actualizado hace 5 minutos</div>
                        </div>
                    </div>

                    <div className="stats shadow bg-base-100 h-1/4 hover-1">
                        <div className="stat">
                            <div className="stat-figure text-success">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <div className="stat-title">Pedidos completados</div>
                            <div className="stat-value text-success">124</div>
                            <div className="stat-desc">En el último mes</div>
                        </div>
                    </div>

                    {/* 📈 Eficiencia o calificación */}
                    <div className="stats shadow bg-base-100 h-1/4 hover-1">
                        <div className="stat">
                            <div className="stat-figure text-warning">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 01.207 7.846A3.5 3.5 0 0012 19.5a4 4 0 01-.207-7.846A3.5 3.5 0 0012 4.354z"></path>
                                </svg>
                            </div>
                            <div className="stat-title">Tasa de eficiencia</div>
                            <div className="stat-value text-warning">92%</div>
                            <div className="stat-desc">Promedio de éxito</div>
                        </div>
                    </div>
                </div>



               {/* 🚗 Vehículo asignado */}
        <div className="bg-base-100 rounded-box shadow row-span-3 col-span-1 p-6 flex flex-col gap-4 relative">

          {!user.vehicle ? (
            <div className="alert alert-warning text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M12 6a9 9 0 11-9 9 9 9 0 019-9z" />
              </svg>
              <span>Aún no has seleccionado un vehículo. Hazlo para comenzar a recolectar.</span>
            </div>
          ) : (
            <>
            
          <h2 className="text-lg font-semibold">Vehículo seleccionado</h2>
              <p className="font-semibold text-center text-xl">{user.vehicle.tipo}</p>
              {/* Estadísticas sencillas (opcional) */}
              <div className="flex justify-around mb-4">
                <div>
                  <p>Velocidad</p>
                  <progress className="progress progress-success w-24" value={user.vehicle.velocidad} max="60" />
                  <p className="text-xs">{user.vehicle.velocidad} km/h</p>
                </div>
                <div>
                  <p>Consumo</p>
                  <progress className="progress progress-error w-24" value={user.vehicle.consumo} max="50" />
                  <p className="text-xs">{user.vehicle.consumo} L/km</p>
                </div>
                <div>
                  <p>Capacidad</p>
                  <progress className="progress progress-info w-24" value={user.vehicle.capacidad} max="1000" />
                  <p className="text-xs">{user.vehicle.capacidad} kg</p>
                </div>
              </div>

              {/* Aquí va el modelo 3D */}
              <div className=" w-full h-full mt-0 rounded-box flex items-center justify-center text-black hover:s">
        {user.vehicle && user.vehicle.modelo_3d ? (
        
         <VehicleModel url={user.vehicle.modelo_3d} />
        ) : (
          <p className="text-xs">Modelo 3D no disponible</p>
        )}
      </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-base-content py-6 mt-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-center md:text-left">
            © {new Date().getFullYear()} CycleMeta+. Todos los derechos reservados.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="link link-hover text-sm">Inicio</a>
            <a href="#" className="link link-hover text-sm">Sobre nosotros</a>
            <a href="#" className="link link-hover text-sm">Contacto</a>
          </div>
        </div>
      </footer>

        </div>
    );
}
