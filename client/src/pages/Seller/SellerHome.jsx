import React from "react";
import Noticias from "../../components/Seller/SellerNews";
import ActividadSemanal from "../../components/Seller/SellerWeeklyActivity";
export default function SellerHome(){
    return(
        <div className="min-h-screen bg-opacity-60 bg-gradient-to-t from-[#909090] to-[#FFF] p-6 top-0">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Resumen del usuario */}
          <div className="bg-[#fff] p-6 w-full rounded-xl row-span-4 flex flex-col">
          <img
  src="/12694.jpg"
  alt="Foto de perfil"
  className="w-85 h-85 rounded-full object-cover self-center"
/>
<br />

            <p className="text-black text-3xl font-semibold">Javier</p><p className="text-[#202020] ">(nombre de usuario)</p>
            <br />
          <button className="btn btn-primary bg-[#303030] hover:bg-[#404040] border-none text-white w-full py-3 self-center rounded-md 
                transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg ">
                Editar perfil
              </button>
          </div>
          
         
          {/* Historial de recolecciones */}
          <div className="bg-white p-6 rounded-xl row-span-3 col-span-2 flex flex-col md:flex-row items-center gap-4 justify-center items-center self-center">
  {/* Gráfica */}
  <div className="w-full md:w-3/4 h-full self-center">
    {/* Aquí va tu componente de gráfica */}
    <ActividadSemanal></ActividadSemanal>
    {/* Por ejemplo tu BarChart */}
   
  </div>

  {/* Botón de puntos */}
  <div className="w-full md:w-1/4 flex justify-center">
    <button className="w-full md:w-auto bg-[#4CAF50] hover:bg-[#45A049] text-white font-bold py-4 px-6 rounded-lg shadow-lg text-lg transition-transform transform hover:scale-105">
      🔋 135 puntos
    </button>
  </div>
</div>

  
          
          {/* Notificaciones */}
          <div className="bg-[#fff] rounded-xl col-span-2 row-span-1 flex flex-col justify-center">
            
            <Noticias></Noticias>
          </div>
  
          {/* Acciones rápidas */}
          
        </div>
        <footer className=" text-[#333] py-6 mt-10">
  <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
    <div className="text-sm text-center md:text-left">
      © {new Date().getFullYear()} CycleMeta+. Todos los derechos reservados.
    </div>

    <div className="flex space-x-4">
      <a href="#" className="hover:underline text-sm transition-all duration-200">Inicio</a>
      <a href="#" className="hover:underline text-sm transition-all duration-200">Sobre nosotros</a>
      <a href="#" className="hover:underline text-sm transition-all duration-200">Contacto</a>
    </div>
  </div>
</footer>

      </div>
    );
}