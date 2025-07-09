import { useAuth } from "../../context/AuthContext";
import ActividadSemanal from "../../components/Seller/SellerWeeklyActivity";
import Noticias from "../../components/Seller/SellerNews";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import useCollectorStats from "../../components/Collector/CollectorStats";
import useNearbyOrders from "../../components/Collector/CollectorNearbyOrders";
import { VehicleModel } from "../../components/VehiculeModelsRender";
import { useState } from "react";

export default function CollectorHome() {
    const { user } = useAuth();
    const { stats, loading } = useCollectorStats();
const nearbyOrders = useNearbyOrders();
const [lastRefresh, setLastRefresh] = useState(new Date());
const tiempoDesde = (fecha) => {
  const ahora = new Date();
  const diffMs = ahora - new Date(fecha);
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin === 0) return "hace unos segundos";
  if (diffMin === 1) return "hace 1 minuto";
  return `hace ${diffMin} minutos`;
};



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
{/* 📍 Pedidos cerca */}
<div className="stats shadow bg-base-100 h-1/3 hover-1">
  <div className="stat">
    <div className="stat-figure text-primary">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6h13M5 6h.01M5 12h.01M5 18h.01"></path>
      </svg>
    </div>
    <div className="stat-title">Pedidos cerca de ti</div>
    <div className="stat-value text-primary">{nearbyOrders}</div>
    <div className="stat-desc">Actualizado {tiempoDesde(lastRefresh)}</div>

  </div>
</div>

{/* ✅ Pedidos completados */}
<div className="stats shadow bg-base-100 h-1/3 hover-1">
  <div className="stat">
    <div className="stat-figure text-success">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
      </svg>
    </div>
    <div className="stat-title">Pedidos completados</div>
    <div className="stat-value text-success">{stats?.completados || 0}</div>
    <div className="stat-desc">Esta semana</div>
  </div>
</div>

{/* 💰 Propinas */}
<div className="stats shadow bg-base-100 h-1/3 hover-1">
  <div className="stat">
    <div className="stat-figure text-accent">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.5 0-2 .5-2 1.5S10.5 11 12 11s2 .5 2 1.5S13.5 14 12 14m0-10v1m0 14v1" />
      </svg>
    </div>
    <div className="stat-title">Propinas semanales</div>
    <div className="stat-value text-accent">${stats?.propinas || 0}</div>
    <div className="stat-desc">Día más activo: {stats?.dia_mas_activo || "N/A"}</div>
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
