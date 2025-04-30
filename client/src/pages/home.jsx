import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThreeDScene from '../components/ThreeDScene';

export default function Home() {
  // Estado para controlar la posición del modelo al hacer scroll
  const [scrollPos, setScrollPos] = useState(0);

  // Efecto que escucha el scroll y actualiza la posición
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrollPos(scrollTop);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fff] text-[#e4e4e7] black-[#202020]">
      {/* Sección hero, con flex para dividir el contenido */}
      <div className="min-h-screen px-11 pr-0 flex flex-col lg:flex-row">
        
        {/* Contenedor de texto */}
        <div className="flex-1 text-center lg:text-left px-5 py-25 flex flex-col justify-center gap-6">
          <h1 className="text-4xl md:text-7xl font-semibold text-[#000]">Faster, easier, cheaper</h1>
          <h2 className="text-4xl md:text-6xl text-[#000]">CycleMetal</h2>

          {/* Mensajes de texto */}
          
          <p className="py-2 text-lg text-gray-700">
            No más complicaciones, olvídate de buscar cómo y dónde tirar tus cosas. 
            Con nosotros, lo puedes hacer en un solo clic.
          </p>


          {/* Botones */}
          <div className="flex gap-4">
            <Link to="/news">
              <button className="btn btn-primary bg-[#303030] hover:bg-[#404040] border-none text-white px-6 py-3 rounded-md 
                transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg">
                Get Started
              </button>
            </Link>
            

            <Link to="/how-it-works">
              <button className="btn btn-secondary bg-[#303030] hover:bg-[#404040] border-none text-white px-7 py-3 rounded-md 
                transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg">
                Aprende cómo funciona
              </button>
            </Link>
          </div>
          <br /><br /><br /><br /><br /><br /><br /><br />
          
          <div className="py-16 text-center">
        <p className="text-3xl text-center font-bold text-black mb-6">
          ¡Tu solución está aquí!
        </p>

        <p className="text-lg text-center text-gray-700 mb-8">
          No pierdas más tiempo buscando quién se encargue de tus residuos. Con CycleMetal, solo haz un clic y tu basura será recogida rápidamente, sin complicaciones.
        </p>

        <p className="text-xl text-center font-semibold text-black mb-8">
          Hacemos que la recolección de residuos sea más rápida, fácil y económica.
        </p>
      </div>
        </div>

        {/* Contenedor para el modelo 3D */}
        <div className="flex-1 flex flex-col ">
          <div  className="h-screen w-full overflow-hidden sticky top-0 " >
            {/* Pasamos el scrollPos para modificar la posición del modelo */}
            <ThreeDScene scrollPos={scrollPos} />
          </div>
        </div>
      </div>

      {/* Sección adicional con texto */}
      
    </div>
  );
}