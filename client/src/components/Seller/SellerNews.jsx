import React, { useState } from "react";

export default function Noticias() {
  const noticias = [
    {
      id: 1,
      titulo: "Nueva zona activa en Cuautepec",
      imagen: "/12694.jpg",
    },
    {
      id: 2,
      titulo: "Tarifas actualizadas: +15% en aluminio",
      imagen: "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp",
    },
    {
      id: 3,
      titulo: "Nuevos camiones asignados 🚛",
      imagen: "https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp",
    },
    {
      id: 4,
      titulo: "¡Ahora puedes ver tus estadísticas en tiempo real!",
      imagen: "https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp",
    },
  ];

  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? noticias.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === noticias.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-[#fff] p-6 rounded-xl col-span-2 row-span-3">
       
      <div className="relative h-70 rounded-xl">
        <img
          src={noticias[current].imagen}
          alt={noticias[current].titulo}
          className="w-full h-full object-cover rounded-xl"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white text-2xl font-semibold px-4 text-center">{noticias[current].titulo}</p>
        </div>

        {/* Botones de navegación */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#e3e3e3]/20 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-[#e3e3e3]/30"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#e3e3e3]/20 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-[#e3e3e3]/30"
        >
          ❯
        </button>
      </div>
    </div>
  )
};