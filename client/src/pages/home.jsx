import React from 'react';
import { Link } from 'react-router-dom';
import ThreeDScene from '../components/ThreeDScene';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-0 bg-[#FDFAF6] text-[#e4e4e7] black-[#202020]">
      {/* Sección Hero */}
      <div className="hero bg-base-200 min-h-screen px-11 pr-0">
        <div className="hero-content flex flex-col-reverse lg:flex-row items-center gap-10">
          {/* Texto */}
          <div className="text-center lg:text-left px-5">
            <h1 className="text-4xl md:text-7xl font-semibold text-[#000]">Faster, easier, cheaper</h1>
            <h2 className='text-4xl md:text-6xl text-[#000]'>CycleMetal</h2>
            <p className="py-4 text-black">¿Quieres deshacerte de algo?</p>

            {/* Nuevo mensaje */}
            <p className="py-4 text-lg text-gray-700">
              No te preocupes más por dónde tirar lo que no necesites, ¡lo puedes hacer con un solo clic!
            </p>

            {/* Botón estilizado */}
            <Link to="/news">
              <button className="btn btn-primary bg-[#202020] hover:bg-blue-700 border-none text-white px-6 py-3 rounded-md">
                Get Started
              </button>
            </Link>

            {/* Botón de acción */}
            <Link to="/how-it-works">
              <button className="btn btn-secondary mt-4 bg-[#FF6347] hover:bg-[#FF4500] border-none text-white px-6 py-3 rounded-md">
                Aprende cómo funciona
              </button>
            </Link>
          </div>

          {/* Componente ThreeDScene sin props */}
          <div className="flex items-center justify-center text-[#e4e4e7]" style={{ width: '650px', height: '600px', overflow: 'hidden' }}>
            <ThreeDScene />  {/* Ya no se pasan posiciones */}
          </div>
        </div>
      </div>

      {/* Otras secciones pueden seguir aquí */}
      <div className="py-12 text-center">
        <p className="text-lg text-gray-700">
          ¡Haz que la recolección de residuos sea más fácil, rápida y conveniente!
        </p>
      </div>
    </div>
  );
}
