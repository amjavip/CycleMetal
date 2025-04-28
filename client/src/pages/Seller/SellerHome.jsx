import React from "react";

export default function SellerHome(){
    return(
        <div className="min-h-screen bg-opacity-60 bg-gradient-to-t from-[#e3e3e3] to-[#FFF] p-6 top-0">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Resumen del usuario */}
          <div className="bg-[#fff] p-6 rounded-xl row-span-4 flex flex-col">
          <img
  src="/12694.jpg"
  alt="Foto de perfil"
  className="w-85 h-85 rounded-full object-cover self-center"
/>
<br />

            <p className="text-black text-3xl font-semibold">Javier</p><p className="text-[#202020] ">(nombre de usuario)</p>
            <br />
          <button className="btn btn-primary bg-[#505050] hover:bg-[#404040] border-none text-white w-full py-3 self-center rounded-md 
                transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg ">
                Editar perfil
              </button>
          </div>
          
         
          {/* Historial de recolecciones */}
          <div className="bg-[#fff] p-6 rounded-xl col-span-2 row-span-3">
            <h2 className="text-2xl font-bold mb-2 text-black">Tus últimas recolecciones</h2>
            <ul className="text-black list-disc ml-5">
              <li>20 kg aluminio - 14/04</li>
              <li>35 kg cobre - 10/04</li>
              <li>12 kg acero - 05/04</li>
            </ul>
          </div>
  
          
          {/* Notificaciones */}
          <div className="bg-[#fff] p-6 rounded-xl col-span-2 md:col-span-2">
            <h2 className="text-xl font-bold mb-2 text-black">📢 Notificaciones recientes</h2>
            <ul className="text-black list-disc ml-5">
              <li>Nuevo recolector asignado a tu zona</li>
              <li>Tu última venta fue confirmada</li>
              <li>¡Actualizamos nuestras tarifas!</li>
            </ul>
          </div>
  
          {/* Acciones rápidas */}
          <div className="bg-[#fff] p-6 rounded-xl col-span-3">
            <h2 className="text-xl font-bold mb-2 text-black">Acciones rápidas</h2>
            <div className="flex flex-col gap-2">
              <button className="bg-[#303030] hover:bg-[#404040] text-white px-4 py-2 rounded-md">
                Ver estadísticas
              </button>
              <button className="bg-[#303030] hover:bg-[#404040] text-white px-4 py-2 rounded-md">
                Editar perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}